import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactsMetalicsComponent } from './impacts-metalics.component';

describe('ImpactsMetalicsComponent', () => {
  let component: ImpactsMetalicsComponent;
  let fixture: ComponentFixture<ImpactsMetalicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpactsMetalicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactsMetalicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
