import { Component, OnInit } from '@angular/core';
import { Base } from '@app/base/base'
import { Graphviz } from '@hpcc-js/wasm-graphviz';

@Component({
  selector: 'app-note-tools',
  imports: [],
  templateUrl: './note-tools.html',
  styleUrl: './note-tools.css',
})
export class NoteTools extends Base implements OnInit{
  // Inner members
  dotExample = {
    id : "dot-example",
    source : "digraph G { Hello -> World }",
  }

  dotSource = [
    this.dotExample,
  ];

  codeBuildQT: string = `
$ git clone git://code.qt.io/qt/qt5.git qt6
$ cd qt6
$ git switch 6.5.3
$ perl init-repository

$ mkdir qt6-build
$ cd qt6-build
$ ../qt6/configure -prefix /path/to/install
$ cmake --build . --parallel 4
$ cmake --install .
  `.trim();

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
