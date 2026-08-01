import { Component, OnInit, OnDestroy, signal, Inject, PLATFORM_ID, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface TocHeading {
  id: string;
  text: string;
  level: number; // 1, 2, or 3
}

@Component({
  selector: 'app-sidebar-layout',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './sidebar-layout.html',
  styleUrl: './sidebar-layout.css'
})
export class SidebarLayout implements OnInit, OnDestroy, AfterViewInit {
  isExpanded = signal(false);
  private collapseTimeout: any;
  private routerSubscription?: Subscription;

  title = '';
  items: { title: string; link: string }[] = [];

  // TOC state
  tocHeadings = signal<TocHeading[]>([]);
  activeTocId = signal('');
  isTocExpanded = signal(false);
  private intersectionObserver?: IntersectionObserver;
  private tocCollapseTimeout: any;

  noteContents = [
    //{ title: "AXI",                   link: "notes/axi" },
    //{ title: "Computer Architecture", link: "notes/ca" },
    { title: "Little Book of Semaphore", link: "notes/lbs" },
    { title: "Mindmap",               link: "notes/mmap" },
    //{ title: "PSS",                   link: "notes/pss" },
    //{ title: "System Verilog",        link: "notes/sv" },
    { title: "Tools",                 link: "notes/tools" },
    { title: "UVM",                   link: "notes/uvm" },
    { title: "Website Development",   link: "notes/web" }
  ];

  projectContents = [
    { title: "C++ Playground",  link: "projects/cpg" },
    { title: "N2NIC",           link: "projects/n2nic" }
  ];

  tripContents = [
    { title: "Japan", link: "trips/japan" },
    { title: "USA",   link: "trips/usa" }
  ];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.updateSidebarContent(this.router.url);
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateSidebarContent(event.urlAfterRedirects || event.url);
        if (isPlatformBrowser(this.platformId)) {
          this.startScanWithRetry();
        }
      });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startScanWithRetry();
    }
  }

  /** Retry scanning at increasing delays until headings are found (or max attempts reached). */
  private startScanWithRetry(): void {
    const delays = [0, 100, 300, 600];
    let attempt = 0;

    const tryOnce = () => {
      this.scanHeadings();
      if (this.tocHeadings().length > 0) return; // success — stop
      attempt++;
      if (attempt < delays.length) {
        setTimeout(tryOnce, delays[attempt]);
      }
    };

    // Kick off the first attempt on the next tick so the outlet has a frame to render.
    setTimeout(tryOnce, delays[0]);
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    this.intersectionObserver?.disconnect();
    if (this.tocCollapseTimeout) clearTimeout(this.tocCollapseTimeout);
  }

  private updateSidebarContent(url: string) {
    const isProject = url.includes('/projects');
    const isTrip = url.includes('/trips');
    if (isProject) {
      this.title = 'PROJECTS';
      this.items = this.projectContents;
    } else if (isTrip) {
      this.title = 'TRIPS';
      this.items = this.tripContents;
    } else {
      this.title = 'NOTES';
      this.items = this.noteContents;
    }
  }

  /** Scan the note-content-area for h1/h2/h3, assign ids, build TOC list. */
  private scanHeadings() {
    this.intersectionObserver?.disconnect();
    this.activeTocId.set('');

    const contentEl = document.querySelector('.note-content-area');
    if (!contentEl) {
      this.tocHeadings.set([]);
      return;
    }

    const headingEls = Array.from(contentEl.querySelectorAll('h1, h2, h3')) as HTMLElement[];
    if (headingEls.length === 0) {
      this.tocHeadings.set([]);
      return;
    }

    const newHeadings: TocHeading[] = [];
    headingEls.forEach((el, i) => {
      if (!el.id) {
        el.id = 'toc-heading-' + i;
      }
      newHeadings.push({
        id: el.id,
        text: el.textContent?.trim() ?? '',
        level: parseInt(el.tagName.charAt(1), 10)
      });
    });

    // Set signal and immediately force a synchronous CD pass so *ngIf
    // re-evaluates without waiting for the next zone event (e.g. hover).
    this.tocHeadings.set(newHeadings);
    this.cdr.detectChanges();

    if (newHeadings.length > 0) {
      this.activeTocId.set(newHeadings[0].id);
    }

    // Run IntersectionObserver callback inside NgZone so active-heading
    // signal updates also trigger change detection reliably.
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        this.ngZone.run(() => {
          const visible = entries.filter(e => e.isIntersecting);
          if (visible.length > 0) {
            const topEntry = visible.reduce((a, b) =>
              a.boundingClientRect.top < b.boundingClientRect.top ? a : b
            );
            this.activeTocId.set(topEntry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    );

    headingEls.forEach(el => this.intersectionObserver!.observe(el));
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  expandToc() {
    if (this.tocCollapseTimeout) clearTimeout(this.tocCollapseTimeout);
    this.isTocExpanded.set(true);
  }

  collapseToc() {
    this.tocCollapseTimeout = setTimeout(() => {
      this.isTocExpanded.set(false);
    }, 200);
  }

  expand() {
    if (this.collapseTimeout) {
      clearTimeout(this.collapseTimeout);
    }
    this.isExpanded.set(true);
  }

  collapse() {
    this.collapseTimeout = setTimeout(() => {
      this.isExpanded.set(false);
    }, 200);
  }

  getAbbreviation(title: string): string {
    const words = title.split(/[\s_-]+/);
    if (words.length === 1) {
      return title.substring(0, 2);
    }
    return (words[0][0] + (words[1]?.[0] || '')).substring(0, 2);
  }
}

