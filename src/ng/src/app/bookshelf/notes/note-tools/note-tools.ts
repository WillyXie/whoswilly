import { Component, OnInit } from '@angular/core';
import { Graphviz } from '@hpcc-js/wasm-graphviz';

@Component({
  selector: 'app-note-tools',
  imports: [],
  templateUrl: './note-tools.html',
  styleUrl: '../notes.css'
})
export class NoteTools implements OnInit{
  // Inner members
  dotExample = {
    id : "dot-example",
    source : "digraph G { Hello -> World }",
  }

  dotSource = [
    this.dotExample,
  ];

  // Function definition
  async dot2svg (dot: string): Promise<any> {
    const graphviz = await Graphviz.load();
    const svg = graphviz.layout(dot, "svg", "dot");

    const item = document.getElementById("dot-example");

    return svg;
  }

  async genSVG () {
    const graphviz = await Graphviz.load();
    for (let idx=0; idx < this.dotSource.length; idx++) {
      const dot = this.dotSource[idx].source;
      const svg = graphviz.layout(dot, "svg", "dot");

      const item = document.getElementById(this.dotSource[idx].id);
      if (item==null) {
        alert("Didn't get element");
      } else {
        item.innerHTML = svg;
      }
    }
  }

  // Life-cycle hooks
  ngOnInit(){
    this.genSVG();
  }
}
