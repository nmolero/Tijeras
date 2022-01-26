import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudDeleteDialogComponent } from './crud-delete-dialog.component';

describe('CrudDeleteDialogComponent', () => {
  let component: CrudDeleteDialogComponent;
  let fixture: ComponentFixture<CrudDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudDeleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
