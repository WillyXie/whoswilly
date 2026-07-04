import { Routes } from '@angular/router';

import { Home }      from './home/home';
import { Resume }      from './resume/resume';

import { Mindmap } from './mindmap/mindmap';
import { NoteAxi } from './notes/note-axi/note-axi';
import { NoteComputerArchitecture } from './notes/note-computer-architecture/note-computer-architecture';
import { NotePss } from './notes/note-pss/note-pss';
import { NoteSystemVerilog } from './notes/note-system-verilog/note-system-verilog';
import { NoteTools } from './notes/note-tools/note-tools';
import { NoteUvm } from './notes/note-uvm/note-uvm';
import { NoteWebsiteDevelopment } from './notes/note-website-development/note-website-development';

import { ProjectCPG } from './projects/project_cpg/project-cpg';
import { ProjectN2NIC } from './projects/project_n2nic/project-n2nic';

import { SidebarLayout } from './layout/sidebar-layout/sidebar-layout';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: Home
  },
  {
    path: "resume",
    component: Resume
  },

  // Notes routes wrapped under SidebarLayout
  {
    path: "notes",
    component: SidebarLayout,
    children: [
      { path: "", redirectTo: "mmap", pathMatch: "full" },
      { path: "mmap", component: Mindmap },
      { path: "axi", component: NoteAxi },
      { path: "ca", component: NoteComputerArchitecture },
      { path: "pss", component: NotePss },
      { path: "sv", component: NoteSystemVerilog },
      { path: "tools", component: NoteTools },
      { path: "uvm", component: NoteUvm },
      { path: "web", component: NoteWebsiteDevelopment },
    ]
  },

  // Projects routes wrapped under SidebarLayout
  {
    path: "projects",
    component: SidebarLayout,
    children: [
      { path: "", redirectTo: "cpg", pathMatch: "full" },
      { path: "cpg", component: ProjectCPG },
      { path: "n2nic", component: ProjectN2NIC },
    ]
  },

  {
    path: "**",
    component: Home
  },
];
