import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWindowComponent } from './view-window.component';

describe('ViewWindowComponent', () => {
  let component: ViewWindowComponent;
  let fixture: ComponentFixture<ViewWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
