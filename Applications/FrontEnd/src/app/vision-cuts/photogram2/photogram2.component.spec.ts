import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Photogram2Component } from './photogram2.component';

describe('Photogram2Component', () => {
  let component: Photogram2Component;
  let fixture: ComponentFixture<Photogram2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Photogram2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Photogram2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
