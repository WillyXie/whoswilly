import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteWebsiteDevelopment } from './note-website-development';

describe('NoteWebsiteDevelopment', () => {
  let component: NoteWebsiteDevelopment;
  let fixture: ComponentFixture<NoteWebsiteDevelopment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteWebsiteDevelopment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteWebsiteDevelopment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
