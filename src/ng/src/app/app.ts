import { Component, Type }  from '@angular/core';
import { CommonModule}      from '@angular/common';
import { RouterOutlet }     from '@angular/router';

import { Intro }      from './intro/intro';
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
    { title: "Intro",     componentString: "intro",},
    { title: "Bookshelf", componentString: "book",},
  ];

  curComponentType: Type<any> | null = Intro;
  switchComponent(componentName: string) {
    if (componentName === 'book') {
      this.curComponentType = Bookshelf;
    } else if (componentName === 'intro') {
      this.curComponentType = Intro;
    }
  }
}

