import { Component, Type }  from '@angular/core';
import { CommonModule}      from '@angular/common';
import { RouterOutlet }     from '@angular/router';

import { Home }      from './home/home';
import { Resume }      from './resume/resume';
import { Bookshelf }  from './bookshelf/bookshelf';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  mainContents = [
    { title: "HOME",      componentString: "home",},
    { title: "RESUME",    componentString: "resume",},
    { title: "BOOKSHELF", componentString: "book",},
  ];

  curComponentType: Type<any> | null = Home;
  switchComponent(componentName: string) {
    if (componentName === "book") {
      this.curComponentType = Bookshelf;
    } else if (componentName === "resume") {
      this.curComponentType = Resume;
    } else if (componentName === "home") {
      this.curComponentType = Home;
    }
  }
}

