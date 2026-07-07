import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteLittleBookOfSemaphore } from './note-little-book-of-semaphore';

describe('NoteLittleBookOfSemaphore', () => {
  let component: NoteLittleBookOfSemaphore;
  let fixture: ComponentFixture<NoteLittleBookOfSemaphore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteLittleBookOfSemaphore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteLittleBookOfSemaphore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
