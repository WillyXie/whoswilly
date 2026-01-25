import { Component } from '@angular/core';

import { Base } from '@app/base/base'

@Component({
  selector: 'app-note-system-verilog',
  imports: [],
  templateUrl: './note-system-verilog.html',
  styleUrl: './note-system-verilog.css',
})
export class NoteSystemVerilog extends Base {
  codeInterface: string = `
interface bus_intf (input clk);
  logic valid;
  logic ready;
  logic [7:0] data;

  modport TB (
    input ready,
    output valid, data
  );

  modport DUT (
    input valid, data,
    output ready
  );
endinterface: bus_intf

module dut (bus_intf busIF);
  always @ (posedge busIF.clk) begin

  end
endmodule: dut

module tb;
  bit clk;
  always #10 clk=~clk;

  bus_intf busIF(clk);

  dut dut0(busIF.DUT);

  initial begin
    busIF.enable <= 1'b0;
    #10 busIF.enable <= 1'b1;
    #100 $finish;
  end
endmodule: tb
`
  .trim();
}
