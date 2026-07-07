import { Component, signal, HostListener, Inject, PLATFORM_ID }  from '@angular/core';
import { CommonModule, isPlatformBrowser }      from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive }     from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isMobileMenuOpen = signal(false);
  showBackToTop = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.showBackToTop.set(window.scrollY > 300);
    }
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
