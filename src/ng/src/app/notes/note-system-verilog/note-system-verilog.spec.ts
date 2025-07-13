import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteSystemVerilog } from './note-system-verilog';

describe('NoteSystemVerilog', () => {
  let component: NoteSystemVerilog;
  let fixture: ComponentFixture<NoteSystemVerilog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteSystemVerilog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteSystemVerilog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
