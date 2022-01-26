import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WschemeAddDialogComponent } from './wscheme-add-dialog.component';

describe('WschemeAddDialogComponent', () => {
  let component: WschemeAddDialogComponent;
  let fixture: ComponentFixture<WschemeAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WschemeAddDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WschemeAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
