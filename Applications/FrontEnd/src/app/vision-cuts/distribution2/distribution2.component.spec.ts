import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Distribution2Component } from './distribution2.component';

describe('Distribution2Component', () => {
  let component: Distribution2Component;
  let fixture: ComponentFixture<Distribution2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Distribution2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Distribution2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
