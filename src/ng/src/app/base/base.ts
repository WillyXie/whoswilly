import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

// Import Prism.js core and language highlight
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-typescript';

@Component({
  selector: 'app-base',
  template: '',
  imports: [],
  styleUrl: './base.css'
})
export class Base {
  // Inject the PLATFORM_ID to determine if the application is running in the browser.
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // Prism highlight can only be used when DOM is ready.
    // Make sure highlight is only executed on browser when SSR is enabled.
    if (isPlatformBrowser(this.platformId)) {
      Prism.highlightAll();
    }
  }
}
