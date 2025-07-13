import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notetools } from './notetools';

describe('Notetools', () => {
  let component: Notetools;
  let fixture: ComponentFixture<Notetools>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notetools]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Notetools);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
