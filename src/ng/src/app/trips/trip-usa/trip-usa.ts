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
    const markerPositions: any[] = [];
    const timestamp = Date.now();

    // Construct URLs with timestamp to prevent caching
    let targetUrl = `https://www.google.com/maps/d/kml?mid=${this.mapId}&forcekml=1&t=${timestamp}`;

    // Append layer ID (lid) if specified
    const selectedLayer = this.currentLayerId();
    if (selectedLayer) {
      targetUrl += `&lid=${selectedLayer}`;
    }

    const liveKmlUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
    const localKmlUrl = this.getAssetUrl(`trip-usa.kml?t=${timestamp}`);

    let kmlText = '';
    try {
      // Try to fetch live data via CORS proxy first
      const response = await fetch(liveKmlUrl);
      if (!response.ok) {
        throw new Error(`Live KML fetch failed with status: ${response.status}`);
      }
      kmlText = await response.text();
      console.log(`Successfully fetched live USA map data (Layer: ${selectedLayer || 'All'}) from Google My Maps.`);
    } catch (e) {
      console.warn('Could not fetch live map data via CORS proxy. Falling back to local KML.', e);
      try {
        const response = await fetch(localKmlUrl);
        if (!response.ok) {
          throw new Error(`Local KML fetch failed with status: ${response.status}`);
        }
        kmlText = await response.text();
      } catch (localError) {
        console.error('Failed to load both live and local KML map data:', localError);
        return [];
      }
    }

    return await this.parseKmlText(kmlText, L, markerPositions);
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
              const marker = L.marker([lat, lng])
                .bindPopup(`<div class="p-1"><h4 class="font-bold text-base mt-0 mb-1 text-indigo-600">${name}</h4><p class="text-sm text-gray-600 m-0">${description}</p></div>`)
                .addTo(this.map);
              this.mapElements.push(marker);
              markerPositions.push([lat, lng]);
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
              .bindPopup(`<div class="p-1"><h4 class="font-bold text-base mt-0 mb-1 text-indigo-600">${name}</h4><p class="text-sm text-gray-600 m-0">${description}</p></div>`)
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
