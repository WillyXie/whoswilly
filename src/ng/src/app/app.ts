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
  isNoteOpen = false;
  isProjectOpen = false;

  toggleNoteDropdown() {
    this.isNoteOpen = !this.isNoteOpen;
  }

  toggleProjectDropdown() {
    this.isProjectOpen = !this.isProjectOpen;
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

  projectContents = [
    { title: "C++ Playground",  link: "cpg",},
    { title: "N2NIC",           link: "n2nic",},
  ];
}

