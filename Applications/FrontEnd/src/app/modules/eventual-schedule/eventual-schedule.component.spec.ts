import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventualScheduleComponent } from './eventual-schedule.component';

describe('EventualScheduleComponent', () => {
  let component: EventualScheduleComponent;
  let fixture: ComponentFixture<EventualScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventualScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventualScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
