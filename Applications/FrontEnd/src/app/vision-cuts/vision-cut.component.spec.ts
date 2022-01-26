import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionCutComponent } from './vision-cut.component';

describe('VisionCutComponent', () => {
  let component: VisionCutComponent;
  let fixture: ComponentFixture<VisionCutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisionCutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionCutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
