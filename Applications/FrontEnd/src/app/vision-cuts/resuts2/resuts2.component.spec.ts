import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resuts2Component } from './resuts2.component';

describe('Resuts2Component', () => {
  let component: Resuts2Component;
  let fixture: ComponentFixture<Resuts2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Resuts2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Resuts2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
