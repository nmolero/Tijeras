import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { inputTypes } from 'src/app/constants/crud.const';

//Services
import { HttpService } from '../../../../services/http-general-service';
import { HttpCrudService } from '../../../../services/http-crud-service';
import { SharedService } from '../../../../services/shared-service';
import { ValidateForm } from '../../../../services/validate-form';
import { DateFormatter } from '../../../../services/date-formatter';


@Component({
  selector: 'app-crud-add-edit-dialog',
  templateUrl: './crud-add-edit-dialog.component.html',
  styleUrls: ['./crud-add-edit-dialog.component.css'],
  providers: [ValidateForm, DateFormatter]
})
export class CrudAddEditDialogComponent implements OnInit {

  @Input() header: string = "";
  // @Input() visible: boolean = false;
  @Input() data: any = null;

  @Output() onHide = new EventEmitter<boolean>();


  private _visible: boolean = false;
  get visible(): any {
    return this._visible;
  }

  @Input()
  set visible(val: any) {
    //console.log('previous item = ', this._visible);
    //console.log('currently selected item=', val);
    this._visible = val;
    // this._visible = false;
  }

  isConfirmButton: boolean = true;


  inputTypes: any = inputTypes;

  constructor(
    private httpService: HttpService,
    private httpCrudService: HttpCrudService,
    public sharedService: SharedService,
    private validateForm: ValidateForm, private dateFormatter: DateFormatter
  ) { }

  ngOnInit(): void {

  }


  ////////////////////////////////////////////////////////

  HandleDialogHide(e) {

    this.onHide.emit(true)
  }


  //////////////////////////////////////////////////////

  async HandleConfirmButton() {



    //console.log(this.data)

    if (this.data.deleteCheckBoxValue !== undefined) {
      if (this.data.deleteCheckBoxValue) {


        let dataArray: number[] = [];

        dataArray.push(this.data.eventualScheduleId);

        this.sharedService.deleteDialogDataEsValuesChange(dataArray);

      } else {
        this.AddEditForm();
      }
    } else {
      this.AddEditForm();
    }




  }

  AddEditForm() {

    let data: any = {}

    this.data.formData.forEach(item => {
      switch (item.type) {
        case inputTypes.INPUT_TEXT:
          data[item.dbName] = item.value;
          break;
        case inputTypes.DROPDOWN:
          data[item.dbName] = item.value.id;
          break;
        case inputTypes.CALENDAR:
          data[item.dbName] = item.value ? this.dateFormatter.IsoFormatter(item.value) : null;
          break;
        case inputTypes.CASCADE:
          data[item.dbName] = parseInt(item.value.ref_);
          break;
        default:
          break;
      }

    });

    data['IsDeleted'] = false;

    if (this.data.workScheduleId !== 0) {
      data['workScheduleId'] = this.data.workScheduleId;
    }

    if (this.data.eventualScheduleId != 0) {
      data['eventualScheduleId'] = this.data.eventualScheduleId;
    }

    //console.log(data);

    let dataArray: any[] = [];

    dataArray.push(data);

    this.sharedService.saveDialogDataValuesChange(data);
    this.sharedService.saveDialogDataValuesChange({});

  }

  //////////////////////////////////////////////

  HandleOnInputParameter() {

    const isFormValid: any = this.data.formData.find(item => (item.value === null || item.value === ''));

    //console.log(this.data)

    //console.log(isFormValid);

    if (isFormValid !== undefined) {
      this.isConfirmButton = true;
    } else {
      this.isConfirmButton = false;
    }
  }

  HandleValidateForm() {

    const isValidState: boolean = this.validateForm.FormInputsValidation(this.data.formData);

    if (isValidState) {
      this.isConfirmButton = false;
    } else {
      this.isConfirmButton = true;
    }


  }

  //////////////////////////////////////////////////

  GetObjectProperties(data: any) {

    data.map(item => ({

    }));
    const keys: string[] = Object.getOwnPropertyNames(data);

  }

  ///////////////////////////////////////////////////

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);
    const currentItem: SimpleChange = changes.visible;
    //console.log('prev value: ', currentItem.previousValue);
    //console.log('got item: ', currentItem.currentValue);
    if (currentItem.currentValue === true) {

      this.HandleValidateForm();
      //this.HandleOnInputParameter();
    }

  }


  //////////////////////////////////////////////

  HandleDeleteCheckBox() {
    //console.log(this.data.deleteCheckBoxValue);
    if (this.data.deleteCheckBoxValue !== undefined) {
      if (this.data.deleteCheckBoxValue) {
        this.data.formData.forEach(element => {
          element.disabled = true;
        });
        this.isConfirmButton = false;
      } else {
        this.data.formData.forEach(element => {
          element.disabled = false;
        });

        this.HandleValidateForm();
      }
    }
  }



}
