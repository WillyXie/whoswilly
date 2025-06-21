import { Component, Type }  from '@angular/core';
import { CommonModule }     from '@angular/common';
import { MatButtonModule }  from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

import { NotesModule } from './notes/notes-module';
import { NoteAngular } from './notes/note-angular/note-angular';
import { NoteAxi } from './notes/note-axi/note-axi';
import { NoteComputerArchitecture } from './notes/note-computer-architecture/note-computer-architecture';
import { NotePss } from './notes/note-pss/note-pss';
import { NoteSystemVerilog } from './notes/note-system-verilog/note-system-verilog';
import { NoteTools } from './notes/note-tools/note-tools';
import { NoteUvm } from './notes/note-uvm/note-uvm';
import { NoteWebsiteDevelopment } from './notes/note-website-development/note-website-development';

@Component({
  selector: 'app-bookshelf',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    //NotesModule,
  ],
  templateUrl: './bookshelf.html',
  styleUrl: './bookshelf.css'
})
export class Bookshelf {
  currentComponentType: Type<any> | null = NoteAngular;
  //currentComponentInputs: { [key: string]: any } = { message: 'Initial message for Part 1' };

  switchComponent(componentName: string) {
    if (componentName === 'ang') {
      this.currentComponentType = NoteAngular;
    } else if (componentName === 'axi') {
      this.currentComponentType = NoteAxi;
    } else if (componentName === 'ca') {
      this.currentComponentType = NoteComputerArchitecture;
    } else if (componentName === 'pss') {
      this.currentComponentType = NotePss;
    } else if (componentName === 'sv') {
      this.currentComponentType = NoteSystemVerilog;
    } else if (componentName === 'tools') {
      this.currentComponentType = NoteTools;
    } else if (componentName === 'uvm') {
      this.currentComponentType = NoteUvm;
    } else if (componentName === 'web') {
      this.currentComponentType = NoteWebsiteDevelopment;
      //this.currentComponentInputs = { value: Math.floor(Math.random() * 100) };
    } else {
      console.log("Cannot find appropriate component type for : ", componentName);
    }
  }
}
