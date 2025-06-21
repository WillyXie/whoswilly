import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteAngular } from './note-angular';

describe('NoteAngular', () => {
  let component: NoteAngular;
  let fixture: ComponentFixture<NoteAngular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteAngular]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteAngular);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
