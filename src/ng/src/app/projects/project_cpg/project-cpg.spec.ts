import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCPG } from './project-cpg';

describe('ProjectCPG', () => {
  let component: ProjectCPG;
  let fixture: ComponentFixture<ProjectCPG>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCPG]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCPG);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
