import { Component, Type }  from '@angular/core';
import { CommonModule }     from '@angular/common';
import { MatButtonModule }  from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector:'note-angular',
  templateUrl: './notes/angular.html',
  styleUrl: './notes.css',
})
export class NoteAngular {}

@Component({
  selector:'note-axi',
  templateUrl: './notes/axi.html',
  styleUrl: './notes.css',
})
export class NoteAXI {}

@Component({
  selector:'note-computer-architecture',
  templateUrl: './notes/computer_architecture.html',
  styleUrl: './notes.css',
})
export class NoteComputerArchitecture {}

@Component({
  selector:'note-pss',
  templateUrl: './notes/pss.html',
  styleUrl: './notes.css',
})
export class NotePSS {}

@Component({
  selector:'note-systemverilog',
  templateUrl: './notes/systemverilog.html',
  styleUrl: './notes.css',
})
export class NoteSystemVerilog {}

@Component({
  selector:'note-uvm',
  templateUrl: './notes/uvm.html',
  styleUrl: './notes.css',
})
export class NoteUVM {}

@Component({
  selector:'note-webdev',
  templateUrl: './notes/webdev.html',
  styleUrl: './notes.css',
})
export class NoteWebDev {}

@Component({
  selector: 'app-bookshelf',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
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
      this.currentComponentType = NoteAXI;
    } else if (componentName === 'ca') {
      this.currentComponentType = NoteComputerArchitecture;
    } else if (componentName === 'pss') {
      this.currentComponentType = NotePSS;
    } else if (componentName === 'sv') {
      this.currentComponentType = NoteSystemVerilog;
      //this.currentComponentInputs = { message: 'Switched to Part 1!' };
    } else if (componentName === 'uvm') {
      this.currentComponentType = NoteUVM;
    } else if (componentName === 'web') {
      this.currentComponentType = NoteWebDev;
      //this.currentComponentInputs = { value: Math.floor(Math.random() * 100) };
    }
  }
}
