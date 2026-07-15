import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-usa',
  imports: [CommonModule],
  templateUrl: './trip-usa.html',
  styleUrl: './trip-usa.css'
})
export class TripUSA implements AfterViewInit, OnDestroy {
  private map: any;
  private L: any;
  private mapElements: any[] = [];

  isLoading = signal(true);
  currentLayerId = signal('');
  legendGroups = signal<any[]>([]);
  private tempGroups = new Map<string, any>();

  mapId = '1HVjxZZrCRmw8ANpVOOywP2100TmF5co';
  centerCoords: [number, number] = [37.0902, -95.7129]; // Centered over USA
  zoomLevel = 4; // Initial zoom level

  layers = [
    { name: '🇺🇸 All USA Locations', id: '' },
    { name: '🏄‍♂️ California', id: 'Rjh--TCgomA' },
    { name: '🌵 Texas', id: 'gBlt9VzTNC8' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.initMap();
    }
  }

  private async initMap() {
    try {
      // Dynamically import leaflet in browser context only to prevent SSR crashes
      const leafletModule = await import('leaflet');
      // Resolve CommonJS default export wrapper for ESM compatibility
      this.L = (leafletModule as any).default || leafletModule;
      const L = this.L;

      // Resolve marker icon bug in bundlers
      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      L.Marker.prototype.options.icon = defaultIcon;

      // Initialize map
      this.map = L.map('map').setView(this.centerCoords, this.zoomLevel);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      // Load and parse KML file, getting positions
      const markerPositions = await this.loadKml(L);

      // Turn off loading state to display the map container in the DOM
      this.isLoading.set(false);

      // Wait a tick for the DOM to render the container (remove hidden class),
      // then force Leaflet to recalculate container bounds and auto-fit map view
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
          if (markerPositions && markerPositions.length > 0) {
            this.map.fitBounds(L.latLngBounds(markerPositions), { padding: [50, 50] });
          }
        }
      }, 100);

    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }

  private async loadKml(L: any): Promise<any[]> {
    this.tempGroups.clear();
    this.legendGroups.set([]);

    const markerPositions: any[] = [];
    const timestamp = Date.now();

    // Construct target URL with timestamp to prevent caching
    let targetUrl = `https://www.google.com/maps/d/kml?mid=${this.mapId}&forcekml=1&t=${timestamp}`;

    // Append layer ID (lid) if specified
    const selectedLayer = this.currentLayerId();
    if (selectedLayer) {
      targetUrl += `&lid=${selectedLayer}`;
    }

    // List of CORS proxies to try for reliability
    const proxyUrls = [
      `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
    ];

    let kmlText = '';
    let success = false;

    for (const proxyUrl of proxyUrls) {
      try {
        console.log(`Attempting to fetch live KML map data via proxy: ${proxyUrl.split('?')[0]}...`);
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          throw new Error(`Proxy returned status: ${response.status}`);
        }
        kmlText = await response.text();
        if (kmlText && kmlText.includes('<kml')) {
          success = true;
          console.log(`Successfully fetched live USA map data (Layer: ${selectedLayer || 'All'}) from Google My Maps.`);
          break;
        } else {
          throw new Error('Response did not contain valid KML data.');
        }
      } catch (error) {
        console.warn(`Failed to fetch KML via proxy. Error: ${error}`);
      }
    }

    if (!success) {
      console.error('Failed to load live KML map data from all proxies.');
      return [];
    }

    const positions = await this.parseKmlText(kmlText, L, markerPositions);

    // Convert tempGroups map to array for the legend component
    const groupsArray = Array.from(this.tempGroups.values());
    this.legendGroups.set(groupsArray);

    return positions;
  }

  private async parseKmlText(kmlText: string, L: any, markerPositions: any[]): Promise<any[]> {
    try {
      const parser = new DOMParser();
      const kmlDoc = parser.parseFromString(kmlText, 'text/xml');

      // Check if the KML contains a NetworkLink redirect (standard for dynamic Google My Maps URLs)
      const networkLinks = kmlDoc.getElementsByTagName('NetworkLink');
      if (networkLinks.length > 0) {
        const hrefElement = kmlDoc.getElementsByTagName('href')[0];
        const hrefUrl = hrefElement?.textContent?.trim();
        if (hrefUrl) {
          console.log('Found NetworkLink in KML. Fetching actual map layer data from:', hrefUrl);

          // Unescape XML ampersands and add timestamp to avoid caching
          const timestamp = Date.now();
          const cleanUrl = hrefUrl.replace(/&amp;/g, '&');
          const targetUrlWithCacheBust = cleanUrl.includes('?') 
            ? `${cleanUrl}&t=${timestamp}` 
            : `${cleanUrl}?t=${timestamp}`;

          const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrlWithCacheBust)}`;

          try {
            const response = await fetch(proxyUrl);
            if (response.ok) {
              const redirectKmlText = await response.text();
              // Recursively parse the redirected KML content
              return await this.parseKmlText(redirectKmlText, L, markerPositions);
            } else {
              console.warn('Failed to fetch NetworkLink redirect data via CORS proxy.');
            }
          } catch (fetchError) {
            console.error('Error fetching NetworkLink redirect KML:', fetchError);
          }
        }
      }

      // Parse Style elements to extract color and icon url
      const stylesMap = new Map<string, { iconUrl: string; color: string }>();
      const styleNodes = kmlDoc.getElementsByTagName('Style');
      
      const kmlColorToCssHex = (kmlColor: string): string => {
        if (!kmlColor || kmlColor.length < 8) return '#0288d1';
        // KML hex color format is aabbggrr (Alpha, Blue, Green, Red)
        const b = kmlColor.slice(2, 4);
        const g = kmlColor.slice(4, 6);
        const r = kmlColor.slice(6, 8);
        return `#${r}${g}${b}`;
      };

      const getColorName = (hex: string): string => {
        const h = hex.toLowerCase();
        if (h === '#0288d1' || h === '#00a9e0') return 'Blue';
        if (h === '#673ab7') return 'Purple';
        if (h === '#ff5252' || h === '#d32f2f') return 'Red';
        if (h === '#4caf50' || h === '#2e7d32') return 'Green';
        if (h === '#ff9800' || h === '#f57c00') return 'Orange';
        if (h === '#ffeb3b' || h === '#fbc02d') return 'Yellow';
        if (h === '#e91e63' || h === '#c2185b') return 'Pink';
        if (h === '#00bcd4' || h === '#0097a7') return 'Cyan';
        return 'Category';
      };

      for (let i = 0; i < styleNodes.length; i++) {
        const styleNode = styleNodes[i];
        const id = styleNode.getAttribute('id');
        if (id) {
          const iconStyle = styleNode.getElementsByTagName('IconStyle')[0];
          const iconUrl = iconStyle?.getElementsByTagName('Icon')[0]?.getElementsByTagName('href')[0]?.textContent?.trim() || '';
          const kmlColor = iconStyle?.getElementsByTagName('color')[0]?.textContent?.trim() || '';
          const color = kmlColorToCssHex(kmlColor);
          stylesMap.set(id, { iconUrl, color });
        }
      }

      // Parse StyleMaps
      const styleMapNodes = kmlDoc.getElementsByTagName('StyleMap');
      const styleMapToStyleId = new Map<string, string>();
      for (let i = 0; i < styleMapNodes.length; i++) {
        const styleMapNode = styleMapNodes[i];
        const id = styleMapNode.getAttribute('id');
        if (id) {
          const pairs = styleMapNode.getElementsByTagName('Pair');
          for (let j = 0; j < pairs.length; j++) {
            const key = pairs[j].getElementsByTagName('key')[0]?.textContent?.trim();
            if (key === 'normal') {
              const styleUrl = pairs[j].getElementsByTagName('styleUrl')[0]?.textContent?.trim() || '';
              const cleanStyleUrl = styleUrl.replace(/^#/, '');
              styleMapToStyleId.set(id, cleanStyleUrl);
              break;
            }
          }
        }
      }

      // Resolve style color helper
      const getPlacemarkColor = (styleUrl: string): string => {
        const cleanUrl = styleUrl.replace(/^#/, '');
        const match = cleanUrl.match(/icon-\d+-([0-9A-Fa-f]{6})/);
        if (match) {
          return `#${match[1]}`;
        }
        
        // Fallback to parsed Style nodes
        let resolvedId = styleMapToStyleId.get(cleanUrl) || cleanUrl;
        let style = stylesMap.get(resolvedId);
        if (!style) {
          style = stylesMap.get(cleanUrl);
        }
        return style ? style.color : '#0288d1';
      };

      // Custom Leaflet marker builder with SVG teardrop filled with the category color
      const createCustomMarkerIcon = (color: string) => {
        const pinColor = color || '#0288d1';

        const svgHtml = `
          <div style="display: flex; align-items: center; justify-content: center; width: 30px; height: 42px;">
            <svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 2px 3px rgba(0,0,0,0.35));">
              <path d="M15 0C6.71573 0 0 6.71573 0 15C0 24.375 13.125 39.375 14.25 40.625C14.625 41.0625 15.375 41.0625 15.75 40.625C16.875 39.375 30 24.375 30 15C30 6.71573 23.2843 0 15 0Z" fill="${pinColor}"/>
              <circle cx="15" cy="15" r="5" fill="white"/>
            </svg>
          </div>
        `;
        
        return L.divIcon({
          html: svgHtml,
          className: 'custom-map-marker',
          iconSize: [30, 42],
          iconAnchor: [15, 42],
          popupAnchor: [0, -36]
        });
      };

      const placemarks = kmlDoc.getElementsByTagName('Placemark');
      console.log(`Parsing USA KML file: found ${placemarks.length} placemarks.`);

      for (let i = 0; i < placemarks.length; i++) {
        const placemark = placemarks[i];
        const name = placemark.getElementsByTagName('name')[0]?.textContent || 'Location';
        const description = placemark.getElementsByTagName('description')[0]?.textContent || '';

        // 1. Check if it's a Point (Marker)
        const point = placemark.getElementsByTagName('Point')[0];
        if (point) {
          const coordsStr = point.getElementsByTagName('coordinates')[0]?.textContent?.trim();
          if (coordsStr) {
            const [lng, lat] = coordsStr.split(',').map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
              const styleUrl = placemark.getElementsByTagName('styleUrl')[0]?.textContent?.trim() || '';
              const color = getPlacemarkColor(styleUrl);
              
              const markerIcon = createCustomMarkerIcon(color);

              const marker = L.marker([lat, lng], { icon: markerIcon })
                .bindPopup(`<div class="p-2"><h4 class="font-bold text-base mt-0 mb-1 text-indigo-600">${name}</h4><p class="text-sm text-gray-600 m-0">${description}</p></div>`)
                .addTo(this.map);
              this.mapElements.push(marker);
              markerPositions.push([lat, lng]);

              // Add to legend groups
              const styleKey = color;
              let group = this.tempGroups.get(styleKey);
              if (!group) {
                const colorName = getColorName(color);
                group = {
                  color,
                  styleName: colorName !== 'Category' ? `${colorName} Locations` : `Category (${color})`,
                  locations: []
                };
                this.tempGroups.set(styleKey, group);
              }
              group.locations.push({
                name,
                description,
                coords: [lat, lng],
                markerInstance: marker
              });
            }
          }
        }

        // 2. Check if it's a LineString (Route/Path)
        const lineString = placemark.getElementsByTagName('LineString')[0];
        if (lineString) {
          const coordsStr = lineString.getElementsByTagName('coordinates')[0]?.textContent?.trim();
          if (coordsStr) {
            const coordsList = coordsStr.split(/\s+/).map(coord => {
              const [lng, lat] = coord.split(',').map(Number);
              return [lat, lng] as [number, number];
            }).filter(c => !isNaN(c[0]) && !isNaN(c[1]));

            if (coordsList.length > 0) {
              const polyline = L.polyline(coordsList, { 
                color: '#4f46e5',
                weight: 4, 
                opacity: 0.8,
                dashArray: '5, 10'
              })
              .bindPopup(`<div class="p-2"><h4 class="font-bold text-base mt-0 mb-1 text-indigo-600">${name}</h4><p class="text-sm text-gray-600 m-0">${description}</p></div>`)
              .addTo(this.map);
              this.mapElements.push(polyline);
            }
          }
        }
      }
    } catch (e) {
      console.error('Error parsing KML map data XML:', e);
    }
    return markerPositions;
  }

  async onLayerChange(event: Event) {
    if (!this.L || !this.map) return;

    const select = event.target as HTMLSelectElement;
    this.currentLayerId.set(select.value);

    // Show loading spinner
    this.isLoading.set(true);

    // Remove old layer components
    this.clearMapLayers();

    // Re-fetch and parse KML for the chosen segment
    const markerPositions = await this.loadKml(this.L);

    this.isLoading.set(false);

    // Invalidate map viewport size and fit bounds
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
        if (markerPositions && markerPositions.length > 0) {
          this.map.fitBounds(this.L.latLngBounds(markerPositions), { padding: [50, 50] });
        }
      }
    }, 100);
  }

  zoomToMarker(loc: any) {
    if (this.map && loc.markerInstance) {
      const latLng = loc.markerInstance.getLatLng();
      this.map.setView(latLng, 14);
      loc.markerInstance.openPopup();
      
      const mapElement = document.getElementById('map');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  getTotalLocationsCount(): number {
    return this.legendGroups().reduce((acc, g) => acc + g.locations.length, 0);
  }

  private getAssetUrl(path: string): string {
    let base = './';
    if (isPlatformBrowser(this.platformId)) {
      const baseEl = document.querySelector('base');
      if (baseEl) {
        base = baseEl.getAttribute('href') || './';
      }
    }
    const cleanBase = base.endsWith('/') ? base : base + '/';
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return cleanBase + cleanPath;
  }

  private clearMapLayers() {
    if (this.map) {
      this.mapElements.forEach(element => {
        this.map.removeLayer(element);
      });
    }
    this.mapElements = [];
  }

  ngOnDestroy() {
    this.clearMapLayers();
    if (this.map) {
      this.map.remove();
    }
  }
}
