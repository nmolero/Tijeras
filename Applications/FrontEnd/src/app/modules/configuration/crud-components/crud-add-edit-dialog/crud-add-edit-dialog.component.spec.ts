import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudAddEditDialogComponent } from './crud-add-edit-dialog.component';

describe('CrudAddEditDialogComponent', () => {
  let component: CrudAddEditDialogComponent;
  let fixture: ComponentFixture<CrudAddEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudAddEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudAddEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
