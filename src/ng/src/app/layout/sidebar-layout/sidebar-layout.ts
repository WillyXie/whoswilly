import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-layout',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './sidebar-layout.html',
  styleUrl: './sidebar-layout.css'
})
export class SidebarLayout implements OnInit, OnDestroy {
  isExpanded = signal(false);
  private collapseTimeout: any;
  private routerSubscription?: Subscription;

  title = '';
  items: { title: string; link: string }[] = [];

  noteContents = [
    { title: "Mindmap",               link: "notes/mmap" },
    { title: "AXI",                   link: "notes/axi" },
    { title: "Computer Architecture", link: "notes/ca" },
    { title: "PSS",                   link: "notes/pss" },
    { title: "System Verilog",        link: "notes/sv" },
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateSidebarContent(this.router.url);
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateSidebarContent(event.urlAfterRedirects || event.url);
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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

  expand() {
    if (this.collapseTimeout) {
      clearTimeout(this.collapseTimeout);
    }
    this.isExpanded.set(true);
  }

  collapse() {
    this.collapseTimeout = setTimeout(() => {
      this.isExpanded.set(false);
    }, 200); // 200ms delay for smooth feel
  }

  getAbbreviation(title: string): string {
    const words = title.split(/[\s_-]+/);
    if (words.length === 1) {
      return title.substring(0, 2);
    }
    return (words[0][0] + (words[1]?.[0] || '')).substring(0, 2);
  }
}
