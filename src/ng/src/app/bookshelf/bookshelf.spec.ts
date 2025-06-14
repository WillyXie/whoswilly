import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bookshelf } from './bookshelf';

describe('Bookshelf', () => {
  let component: Bookshelf;
  let fixture: ComponentFixture<Bookshelf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bookshelf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bookshelf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
