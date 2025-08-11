import { Component } from '@angular/core';

import { Base } from '@app/base/base'
import { Graphviz } from '@hpcc-js/wasm-graphviz';

@Component({
  selector: 'app-note-tools',
  imports: [],
  templateUrl: './note-tools.html',
  styleUrl: './note-tools.css',
})
export class NoteTools extends Base{
  // Code block source
  codeNVimInstall: string = `
$ git clone https://github.com/neovim/neovim.git; cd neovim
$ make CMAKE_BUILD_TYPE=RelWithDebInfo CMAKE_INSTALL_PREFIX=<install path>
$ make install
  `.trim();

  codeLazyVimInstall: string = `
$ sudo snap install tectonic
$ sudo apt install fd-find ripgrep luarocks
$ npm install -g @mermaid-js/mermaid-cli # mmdc
$ git clone https://github.com/LazyVim/starter ~/.config/nvim
  `.trim();

  codeGraphizCmdExample: string = `
$ sudo apt install graphviz
$ echo 'digraph { a -> b }' | dot -Tsvg > graphviz.svg
  `.trim();

  codeInstallWASMGraphviz: string = `
$ npm install @hpcc-js/wasm-graphviz
`.trim();

  codeBuildQT: string = `
$ git clone git://code.qt.io/qt/qt5.git qt6
$ cd qt6
$ git switch 6.5.3
$ perl init-repository

$ mkdir qt6-build
$ cd qt6-build
$ ../qt6/configure -prefix /path/to/install
$ cmake --build . --parallel 4
$ cmake --install .
  `.trim();

  // Graphviz dot source
  dotExample: string = `
    digraph G { a -> b }
  `.trim();

  override dotSource = [
    {id: "dot-example", source: this.dotExample},
  ];
}
