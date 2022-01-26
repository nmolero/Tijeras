import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeGraficComponent } from './range-grafic.component';

describe('RangeGraficComponent', () => {
  let component: RangeGraficComponent;
  let fixture: ComponentFixture<RangeGraficComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangeGraficComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeGraficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
