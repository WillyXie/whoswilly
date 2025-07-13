import { Component } from '@angular/core';
import { Base } from '@app/base/base'

@Component({
  selector: 'app-note-website-development',
  imports: [],
  templateUrl: './note-website-development.html',
  styleUrl: './note-website-development.css',
})
export class NoteWebsiteDevelopment extends Base {
  codeJS: string = `
element = document.getElementById("placeholder");
elements = document.getElementsByClassName("dot");
for (let idx = 0; idx < elements.length; idx++) {{'{'}}
  console.log(elements[idx].innerHTML);
  const dot = elements[idx].innerHTML;
  elements[idx].innerHTML = graphviz.layout(dot, "svg", "dot");
  {{'}'}}
  `.trim();

  codeSetupNG: string = `
$ npm install -g @angular/cli
$ ng new [project]
$ ng start
#Add new modules
$ ng add @angular/material
  `.trim();

  codeEscapeSpecialCharacter: string = `
< (less than)           => &lt;
> (greater than)        => &gt;
& (ampersand)           => &amp;
{ (opening curly brace) => &#123;
} (closing curly brace) => &#125;
  `.trim();

  codeTSExample: string = `
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
        <button
          class="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200 rounded-md py-2 px-3"
          (click)="switchComponent('resume');"
          routerLink="/resume"
        >
          <span>RESUME</span>
        </button>
  noteContents = [
    { title: "Mindmap",               componentString: "mmap",},
    { title: "AXI",                   componentString: "axi",},
    { title: "Computer Architecture", componentString: "ca",},
    { title: "PSS",                   componentString: "pss",},
    { title: "System Verilog",        componentString: "sv",},
    { title: "Tools",                 componentString: "tools",},
    { title: "UVM",                   componentString: "uvm",},
    { title: "Website Development",   componentString: "web",},
  ];
  curComponentType: Type<any> | null = Home;

  switchComponent(componentName: string) {
    if (componentName === "resume") {
      this.curComponentType = Resume;
    } else if (componentName === "home") {
      this.curComponentType = Home;
    } else if (componentName === 'mmap') {
      this.curComponentType = Mindmap;
    } else if (componentName === 'axi') {
      this.curComponentType = NoteAxi;
    } else if (componentName === 'ca') {
      this.curComponentType = NoteComputerArchitecture;
    } else if (componentName === 'pss') {
      this.curComponentType = NotePss;
    } else if (componentName === 'sv') {
      this.curComponentType = NoteSystemVerilog;
    } else if (componentName === 'tools') {
      this.curComponentType = NoteTools;
    } else if (componentName === 'uvm') {
      this.curComponentType = NoteUvm;
    } else if (componentName === 'web') {
      this.curComponentType = NoteWebsiteDevelopment;
      //this.currentComponentInputs = { value: Math.floor(Math.random() * 100) };
    } else {
      console.log("Cannot find appropriate component type for : ", componentName);
    }
  }
  `.trim();
}

