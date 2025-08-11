import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

// Import Prism.js core and language highlight
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-typescript';

import { Graphviz } from '@hpcc-js/wasm-graphviz';

@Component({
  selector: 'app-base',
  template: '',
  imports: [],
  styleUrl: './base.css'
})
export class Base {
  dotSource: {id: string; source: string;}[] = [];

  // Function Declaration
  async genSVG () {
    const graphviz = await Graphviz.load();
    for (let idx=0; idx < this.dotSource.length; idx++) {
      const dot = this.dotSource[idx].source;
      const svg = graphviz.layout(dot, "svg", "dot");
      const item = document.getElementById(this.dotSource[idx].id);
      if (item==null) {
        //alert("Didn't get element");
        console.error("Didn't get element %s", this.dotSource[idx].id);
      } else {
        item.innerHTML = svg;
      }
    }
  }

  // Inject the PLATFORM_ID to determine if the application is running in the browser.
  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {}

  // Life-cycle hooks
  ngOnInit(){
    if (isPlatformBrowser(this.platformId)) {
      this.genSVG();
    }
  }

  ngAfterViewInit(): void {
    // Prism highlight can only be used when DOM is ready.
    // Make sure highlight is only executed on browser when SSR is enabled.
    if (isPlatformBrowser(this.platformId)) {
      Prism.highlightAll();
    }
  }
}
