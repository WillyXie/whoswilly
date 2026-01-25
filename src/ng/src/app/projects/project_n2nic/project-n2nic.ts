import { Component } from '@angular/core';
import { Base } from '@app/base/base';

@Component({
  selector: 'app-project-n2nic',
  imports: [],
  templateUrl: './project-n2nic.html',
  styleUrl: './project-n2nic.css',
})
export class ProjectN2NIC extends Base {
  codeWaveDrom: string = `
<header>
  <script src="./skins/default.js" type="text/javascript"></script>
  <script src="./wavedrom.min.js" type="text/javascript"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/skins/default.js" type="text/javascript"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/wavedrom.min.js" type="text/javascript"></script>
</header>
<body onload="WaveDrom.ProcessAll()">
  <div>
    <script type="WaveDrom">
      { signal : [
        { name: "clk",  wave: "p......" },
        { name: "bus",  wave: "x.34.5x",   data: "head body tail" },
        { name: "wire", wave: "0.1..0." },
      ]}
    </script>
  </div>
</body>
  `.trim();
}
