import { Component } from '@angular/core';
import { Graphviz } from '@hpcc-js/wasm-graphviz';

@Component({
  selector: 'intro',
  imports: [],
  templateUrl: `./intro.html`,
  styleUrl: './intro.css'
})
export class Intro {
  // Inner members
  dotKnowledge = {
    id : "dot-knowledge",
    archive : "digraph G { Hello -> World }",
    source : `
      graph KnowledgeMindmap {
	      labelloc="t"
	      label="Mind map of my knowledge learning.\nTwopi radial graph."
	      fontname="URW Chancery L, Apple Chancery, Comic Sans MS, cursive"
        normalize=true
        ratio=auto
	      layout=twopi; graph [ranksep=2];
	      edge [penwidth=5 color="#f0f0ff"]
	      node [
          fillcolor="#f0f0ffA0"
          fontcolor=pink
          fontname="URW Chancery L, Apple Chancery, Comic Sans MS, cursive"
          fontsize=20
          penwidth=0
	        style="filled"
        ]

        // Root
	      Knowledge [fontsize=25 fontcolor=indigo URL="https://en.wikipedia.org/wiki/Category:Happiness"]

	      Knowledge -- {
          CA
          DIC
          Tools
          WebDev
	      }

        // ComputerArchitecture
	      CA    [fontsize=25 fontcolor=goldenrod tooltip="Computer Architecture"]
	      AXI   [fontcolor=goldenrod]
        AMBA  [fontcolor=goldenrod]
	      CHI   [fontcolor=goldenrod]
	      CPU   []

	      CA -- {
          AMBA
          CPU
        }

	      AMBA -- {
          AXI
          CHI
        }

        // DIC
	      DIC   [fontcolor=goldenrod fontsize=25 tooltip="Digitial IC Development"]
	      DICDE [tooltip="Digitial IC Design"]
	      DICDV [fontcolor=goldenrod tooltip="Digitial IC Design Verification"]
	      PSS   []
	      SV    [tooltip="System Verilog"]
	      UVM   [fontcolor=goldenrod]

	      DIC -- {
          DICDE
          DICDV
        }

        DICDE -- {
          SV
        }

        DICDV -- {
          UVM
          PSS
        }

        // Tools
        DAC       [tooltip="Diagram As Code"]
        Github    []
        Graphviz  []
	      Tools     [fontsize=25]
        VIM       []

	      Tools -- {
          DAC
          Github
          VIM
	      }

        DAC -- {
          Graphviz
        }

        // Website
	      WebDev  [fontsize=25 tooltip="Website Development"]
	      Angular []
	      CSS     []
	      HTML    []
	      JS      [tooltip="JavaScript"]

        WebDev -- {
          Angular
          CSS
          HTML
          JS
        }

        // Copyright
	      c [label="© 2025-2025 Willy Xie" fontsize=12 shape=plain style="" fontcolor=gray]
      }
    `
  };

  dotSource = [
    this.dotKnowledge,
  ];

  // Function definition
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
    if (typeof document !== "undefined")
      this.genSVG();
  }
}
