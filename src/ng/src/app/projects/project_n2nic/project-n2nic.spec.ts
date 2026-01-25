import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectN2NIC } from './project-n2nic';

describe('ProjectN2NIC', () => {
  let component: ProjectN2NIC;
  let fixture: ComponentFixture<ProjectN2NIC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectN2NIC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectN2NIC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
