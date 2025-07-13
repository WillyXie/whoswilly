import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotePss } from './note-pss';

describe('NotePss', () => {
  let component: NotePss;
  let fixture: ComponentFixture<NotePss>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotePss]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotePss);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
