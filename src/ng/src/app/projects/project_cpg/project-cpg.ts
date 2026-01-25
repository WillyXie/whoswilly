import { Component } from '@angular/core';
import { Base } from '@app/base/base'

@Component({
  selector: 'app-note-cpg',
  imports: [],
  templateUrl: './project-cpg.html',
  styleUrl: './project-cpg.css',
})
export class ProjectCPG extends Base {
  codeHelloWorld: string = `
#include <iostream>

int main(int argc, char** argv) {
  std::cout << "Hello World!" << std::endl;
  return 0;
}
  `.trim();
}

