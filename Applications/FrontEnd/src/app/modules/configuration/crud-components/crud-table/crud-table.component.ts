import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { tables, actions, eventType } from '../../../../constants/crud.const';


//#region Services - importo los servicios

import { ReportSnackBar } from '../../../../shared/components/report-snack-bar/report-snack-bar';
import { UserConfigurationData } from '../../../../services/user-configuration';
import { HttpService } from '../../../../services/http-general-service';
import { HttpCrudService } from '../../../../services/http-crud-service';
import { SharedService } from '../../../../services/shared-service';
//#endregion

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.css']
})
export class CrudTableComponent implements OnInit {

  //#region - Inputs - declaro las variables

  @Input() dataTableValues: any[] = [];
  @Input() listOfColumns: any[] = [];
  @Input() exportFileName: string = "";
  @Input() selection: any;
  @Input() summaryElementsLabel: string = "";
  @Input() table: string = "";
  @Input() captionTitle: string = "";
  //#endregion

  //Outputs

  @Output() onClick = new EventEmitter<any>();
  @Output() isLoadingResults = new EventEmitter<boolean>();

  isDeleteItemsDisabled: boolean = true;//Confirmo si estará disponible este botón

  //Contructor para que todo se inicialice sin ser instanciado
  constructor(
    private messageService: MessageService, private httpService: HttpService,
    private httpCrudService: HttpCrudService, public sharedService: SharedService
  ) { }

  async ngOnInit() {

    // this.isLoadingResults.emit(true);

    // switch (this.table) {
    //   case tables.CAUSE:
    //     await this.httpCrudService.getEventParentClass().then(
    //       data => {
    //         //console.log(data);

    //         if (data !== null) {

    //           this.dataTableValues = data.map(item => {
    //             return {
    //               id: item.eventClassId,
    //               name: item.eventClassName,
    //               description: item.eventClassDescription,
    //               eventClassType: item.eventClassTypeName
    //             }
    //           });
    //         }
    //       }
    //     );

    //     // console.log(this.dataTableValues);

    //     break;
    //   case tables['SUB-CAUSE']:
    //     await this.httpCrudService.getAllSubCauseEventClass().then(
    //       data => {
    //         //console.log(data);

    //         if (data !== null) {

    //           this.dataTableValues = data.map(item => {
    //             return {
    //               id: item.eventClassId,
    //               name: item.eventClassName,
    //               description: item.eventClassDescription,
    //               parentCause: item.eventParentClassName
    //             }
    //           });
    //         }
    //       }
    //     );

    //     break;
    //   default:
    //     break;
    // }

    // this.isLoadingResults.emit(false);

  }


  ///////////////////////////////////////

  //#region - Método para seleccionar la fila
  HandleRowSelect(selectedRow) {
    //console.log(this.selection);
    this.isDeleteItemsDisabled = false;
    return selectedRow;
  }
  //#endregion

  //#region - Método que se encarga de deseleccionar un fila
  HandleRowUnSelect(selectedRow) {
    //console.log(this.selection);

    if (this.selection.length === 0) {
      this.isDeleteItemsDisabled = true;
    } else {
      this.isDeleteItemsDisabled = false;
    }
  }
  //#endregion

  selectedRowItem: any = null;

  //#region - Método para eleminar elemento
  HandleDeleteItem(selectedItem: any) {

    const data: any = {
      action: actions.DELETE_S,
      data: {
        selectedRowItem: selectedItem,
        visible: true,
        isDeleteSelectedItemsPressed: false
      }
    }

    this.sharedService.dialogDataValuesChange(data);

    //this.selectedRowItem = selectedItem;
    // this.displayDeleteDialog = true;
    //console.log(selectedItem);
  }
  //#endregion

  //#region - Método que se encarga de eleminar el elemento seleccionado
  HandleDeleteSelectedItems() {

    const data: any = {
      action: actions.DELETE_M,
      data: {
        selectedRowItem: this.selection,
        visible: true,
        isDeleteSelectedItemsPressed: true
      }
    }

    this.sharedService.dialogDataValuesChange(data);
  }
  //#endregion

  //#region - Método que se encarga de editar el elemento
  HandleEditItem(selectedItem) {

    // this.selectedRowItem = selectedItem;

    // this.editName = selectedItem.name;
    // this.editDescription = selectedItem.description;


    // this.displayEditDialog = true;


    const event: any = {
      type: eventType.CLICK,
      action: actions.UPDATE,
      source: this.table,
      data: selectedItem
    }
    this.onClick.emit(event);


  }
  //#endregion

  //#region - Método que se encarga de manejar el evento agregar
  HandleAddButton() {

    const event: any = {
      type: eventType.CLICK,
      action: actions.ADD,
      source: this.table
    }
    this.onClick.emit(event);
    // console.log(this.table);

  }

  HandleHeaderCheckBoxClick() {
    if ((this.selection.length > 0) && (!this.isDeleteItemsDisabled)) {
      this.isDeleteItemsDisabled = false;
    } else {
      if (this.isDeleteItemsDisabled) {
        this.isDeleteItemsDisabled = false;
      } else {
        this.isDeleteItemsDisabled = true;
      }

    }
  }
  //#endregion


}
