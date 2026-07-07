import { Routes } from '@angular/router';

import { Home }      from './home/home';
import { Resume }      from './resume/resume';

import { Mindmap } from './mindmap/mindmap';
import { NoteAxi } from './notes/note-axi/note-axi';
import { NoteComputerArchitecture } from './notes/note-computer-architecture/note-computer-architecture';
import { NoteLittleBookOfSemaphore } from './notes/note-little-book-of-semaphore/note-little-book-of-semaphore';
import { NotePss } from './notes/note-pss/note-pss';
import { NoteSystemVerilog } from './notes/note-system-verilog/note-system-verilog';
import { NoteTools } from './notes/note-tools/note-tools';
import { NoteUvm } from './notes/note-uvm/note-uvm';
import { NoteWebsiteDevelopment } from './notes/note-website-development/note-website-development';

import { ProjectCPG } from './projects/project_cpg/project-cpg';
import { ProjectN2NIC } from './projects/project_n2nic/project-n2nic';

import { TripJapan } from './trips/trip-japan/trip-japan';
import { TripUSA } from './trips/trip-usa/trip-usa';

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
      { path: "axi", component: NoteAxi },
      { path: "ca", component: NoteComputerArchitecture },
      { path: "lbs", component: NoteLittleBookOfSemaphore },
      { path: "mmap", component: Mindmap },
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

  // Trips routes wrapped under SidebarLayout
  {
    path: "trips",
    component: SidebarLayout,
    children: [
      { path: "", redirectTo: "japan", pathMatch: "full" },
      { path: "japan", component: TripJapan },
      { path: "usa", component: TripUSA },
    ]
  },

  // Redirects from old root-level paths to new nested paths
  { path: "axi", redirectTo: "notes/axi", pathMatch: "full" },
  { path: "ca", redirectTo: "notes/ca", pathMatch: "full" },
  { path: "lbs", redirectTo: "notes/lbs", pathMatch: "full" },
  { path: "mmap", redirectTo: "notes/mmap", pathMatch: "full" },
  { path: "pss", redirectTo: "notes/pss", pathMatch: "full" },
  { path: "sv", redirectTo: "notes/sv", pathMatch: "full" },
  { path: "tools", redirectTo: "notes/tools", pathMatch: "full" },
  { path: "uvm", redirectTo: "notes/uvm", pathMatch: "full" },
  { path: "web", redirectTo: "notes/web", pathMatch: "full" },
  { path: "cpg", redirectTo: "projects/cpg", pathMatch: "full" },
  { path: "n2nic", redirectTo: "projects/n2nic", pathMatch: "full" },
  { path: "japan", redirectTo: "trips/japan", pathMatch: "full" },
  { path: "usa", redirectTo: "trips/usa", pathMatch: "full" },

  {
    path: "**",
    component: Home
  },
];
