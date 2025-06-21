import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteComputerArchitecture } from './note-computer-architecture';

describe('NoteComputerArchitecture', () => {
  let component: NoteComputerArchitecture;
  let fixture: ComponentFixture<NoteComputerArchitecture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteComputerArchitecture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteComputerArchitecture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
