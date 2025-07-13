import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteUvm } from './note-uvm';

describe('NoteUvm', () => {
  let component: NoteUvm;
  let fixture: ComponentFixture<NoteUvm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteUvm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteUvm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
