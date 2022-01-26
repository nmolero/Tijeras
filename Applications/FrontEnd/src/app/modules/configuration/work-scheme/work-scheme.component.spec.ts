import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkSchemeComponent } from './work-scheme.component';

describe('WorkSchemeComponent', () => {
  let component: WorkSchemeComponent;
  let fixture: ComponentFixture<WorkSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkSchemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
