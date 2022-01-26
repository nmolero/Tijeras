import { Component, Input, OnInit } from '@angular/core';
import { actions } from 'src/app/constants/crud.const';

//Services
import { SharedService } from '../../../../services/shared-service';
import { HttpCrudService } from '../../../../services/http-crud-service';

@Component({
  selector: 'app-crud-delete-dialog',
  templateUrl: './crud-delete-dialog.component.html',
  styleUrls: ['./crud-delete-dialog.component.css']
})

// *************************************************************************************
/******************************* Muestra un dialogo **************************************/
/*************************************************************************************** */

export class CrudDeleteDialogComponent implements OnInit {

  constructor(
    public sharedService: SharedService,
    private httpCrudService: HttpCrudService,
  ) { }

  @Input() header: string = "";
  @Input() singleDeleteLabel: string = "";
  @Input() multipleDeleteLabel: string = "";



  isDeleteSelectedItemsPressed: boolean = false;

  selectedRowItem: any = null;
  selectedRows: any[] = [];

  visible: boolean = false;


  message: any = null;

  ngOnInit() {

    this.sharedService.dialogDataSharedMessage.subscribe(message => {

      console.log(message);
      this.message = message;
      // If para una eliminación simple
      if (this.message.action === actions.DELETE_S) {
        this.visible = this.message.data.visible;
        this.isDeleteSelectedItemsPressed = this.message.data.isDeleteSelectedItemsPressed;
        this.selectedRowItem = this.message.data.selectedRowItem;
      }

      // If para una eliminación múltiple
      if (this.message.action === actions.DELETE_M) {
        this.visible = this.message.data.visible;
        this.isDeleteSelectedItemsPressed = this.message.data.isDeleteSelectedItemsPressed;
        this.selectedRows = this.message.data.selectedRowItem;
      }
    });
  }


  ////////////////////////////////////

  // #region - Método que se encarga de manejar eliminar botón de confirmación
  async HandleDeleteConfirmButton() {

    const isArray: boolean = Array.isArray(this.message.data.selectedRowItem);

    console.log(this.message)
    let dataArray: number[] = [];

    if (!isArray) {

      if (this.message.data.selectedRowItem.id !== undefined) {
        dataArray.push(this.message.data.selectedRowItem.id);
      } else {
        dataArray.push(this.message.data.selectedRowItem.workScheduleId);
      }

    } else {
      dataArray = this.message.data.selectedRowItem.map(item => {
        return item.id
      });
    }

    this.sharedService.deleteDialogDataValuesChange(dataArray);
    this.sharedService.deleteDialogDataValuesChange({});

  }
  //#endregion
  //////////////////////////////////////////////////

  //#region - Método para ocultar el mensaje modal
  HandleHideDialog() {
    this.sharedService.dialogDataValuesChange({});
  }
  //#endregion
}
