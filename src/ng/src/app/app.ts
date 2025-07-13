import { Component, Type }  from '@angular/core';
import { CommonModule}      from '@angular/common';
import { RouterLink, RouterOutlet }     from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  // If the dropdown is open or closed.
  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  noteContents = [
    { title: "Mindmap",               link: "mmap",},
    { title: "AXI",                   link: "axi",},
    { title: "Computer Architecture", link: "ca",},
    { title: "PSS",                   link: "pss",},
    { title: "System Verilog",        link: "sv",},
    { title: "Tools",                 link: "tools",},
    { title: "UVM",                   link: "uvm",},
    { title: "Website Development",   link: "web",},
  ];
}

