import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClassComponent } from './event-class.component';

describe('EventClassComponent', () => {
  let component: EventClassComponent;
  let fixture: ComponentFixture<EventClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
