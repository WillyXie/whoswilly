import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteAxi } from './note-axi';

describe('NoteAxi', () => {
  let component: NoteAxi;
  let fixture: ComponentFixture<NoteAxi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteAxi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteAxi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
