import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

//Services

import { ReportSnackBar } from '../../../shared/components/report-snack-bar/report-snack-bar';
import { UserConfigurationData } from '../../../services/user-configuration';
import { HttpService } from '../../../services/http-general-service';
import { HttpCrudService } from '../../../services/http-crud-service';


//Interfaces

import { IDropDownItems } from '../../../interfaces/components/dropdown'
import { Table } from 'primeng/table';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    MessageService, ReportSnackBar, UserConfigurationData, HttpService, HttpCrudService
  ]
})
export class SystemSettingsComponent implements OnInit {

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private messageService: MessageService, private httpService: HttpService,
    private httpCrudService: HttpCrudService,
    private reportSnackBar: ReportSnackBar, private userDataService: UserConfigurationData
  ) { }



  @ViewChild('dataTable') dataTable: Table;


  //BlockUI

  isLoadingResults = false;

  //CSV
  exportFileName: string = "STA - Parámetros de Sistema";

  //Panel

  headerTitleLabel: string = "Parámetros de Sistema";

  //Table

  dataTableValues: any[] = [];

  //Table Structure

  listOfColumns: any =
    [
      { field: 'checkBoxSelect', header: '', width: '3rem', hidden: true, exportable: false },
      { field: 'id', header: 'ID', width: '8rem', filterValue: '', hidden: false },
      { field: 'key', header: 'Key', filterValue: '', hidden: false },
      { field: 'value', header: 'Valor', filterValue: '', hidden: false },
      { field: 'moduleName', header: 'Módulo', filterValue: '', hidden: false },
      { field: 'actionButtons', header: '', width: '12rem', hidden: true, exportable: false }
    ];

  //Filters

  idFilterValue: string = "";
  userLoginFilterValue: string = "";
  userNameFilterValue: string = "";
  profileFilterValue: string = "";

  //CheckBox

  selectedRows: any = null;


  //Dialogs

  displayAddDialog: boolean = false;
  addDialogHeader: string = "Agregar Configuración";

  deleteDialogHeader: string = "Eliminar Configuración";
  displayDeleteDialog: boolean = false;

  editHeaderDialog: string = "Actualizar Configuración"
  displayEditDialog: boolean = false;


  //DropDown

  selectedModule: IDropDownItems = null;
  modulesOptions: IDropDownItems[] = [];


  //Buttons
  isDeleteItemsDisabled: boolean = true;



  async ngOnInit() {

    //Menu Side Bar configuration
    this.storage.set('isPreviousPageLogin', false);

    this.isLoadingResults = true;
    //console.log(this.storage.get('isLoggedIn'));

    await this.httpCrudService.getSystemModulesDropDown().then(
      data => {

        console.log(data);

        if ((data !== null) && (data.error == null)) {

          this.modulesOptions = [...data];

        } else {

          this.modulesOptions.push({ id: 0, label: 'Sin Datos', code: 'NoData' });

          this.ShowUnAuthorizeToast(data);

        }

        this.selectedModule = this.modulesOptions[0];

      }
    )
    await this.getSystemSettings();



    this.isLoadingResults = false;

  }


  async getSystemSettings() {

    await this.httpCrudService.getSystemSettings().then(
      data => {

        //console.log(data);

        if ((data !== null) && (data.error == null)) {


          this.dataTableValues = data.map(function (currentValue, index, array) {
            let dataTableRow: any =
            {
              checkBoxSelect: false,
              id: currentValue.id,
              key: currentValue.key,
              value: currentValue.value,
              moduleName: currentValue.moduleName,
              moduleId: currentValue.moduleId
            };
            return dataTableRow;
          });

          ///console.log(this.dataTableValues);


        } else {

          this.ShowUnAuthorizeToast(data);

        }
      }
    );

  }


  ShowUnAuthorizeToast(data: any) {

    if (data !== null) {
      if ((data.error !== undefined) && (data.error !== null)) {
        if (data.status === 401) {
          this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Operación Denegada. Consulte por los permisos adecuados para realizar la siguiente acción.' });
        }
      }
    } else {
      this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
    }


  }


  ////////////////////////////////////////////////////////////


  keyValue: string = "";
  value: string = "";
  isConfirmAddButton: boolean = true;

  HandleAddButton() {

    this.displayAddDialog = true;
    this.keyValue = "";
    this.value = "";
    this.selectedModule = this.modulesOptions[0];
  }


  HandleAddDialogHide(event) {

  }


  async HandleConfirmAddButton() {

    this.isLoadingResults = true;

    let data: any = {
      key: this.keyValue,
      value: this.value,
      moduleId: this.selectedModule.id
    }

    await this.httpCrudService.postAddSystemKey(data).then(
      async data => {
        //console.log(data);
        await this.DisplayToastAndUpdateTable(data);
      }
    );


    this.displayAddDialog = false;





  }

  /////////////////////////////////////////////////////

  async DisplayToastAndUpdateTable(data: number) {
    if (data !== null) {
      if (data == 1) {

        await this.getSystemSettings();


        this.isLoadingResults = false;

        this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'success', summary: 'Completado', detail: 'Se han actualizado los datos correctamente' });
      } else {

        this.isLoadingResults = false;
        if (data === 0) {
          this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
        }

        this.ShowUnAuthorizeToast(data);


      }


    } else {
      this.isLoadingResults = false;

      this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
    }
  }

  //////////////////////////////////////////////////////

  isDeleteSelectedItemsPressed: boolean = false;

  HandleDeleteSelectedItems() {

    this.isDeleteSelectedItemsPressed = true;
    this.displayDeleteDialog = true;



    //console.log(selectedIds);



  }

  ////////////////////////////////////////////////////7

  isConfirmEditButton: boolean = false;

  editKey: string = "";
  editValue: string = "";
  editModule: string = "";
  editSelectedModule: IDropDownItems = null;

  HandleEditItem(selectedItem) {

    this.selectedRowItem = selectedItem;

    this.editKey = selectedItem.key;
    this.editValue = selectedItem.value;
    this.editSelectedModule = this.modulesOptions.find(
      item => {
        return item.label === selectedItem.moduleName;
      }
    );

    this.editModule = this.editSelectedModule.label;

    this.displayEditDialog = true;



  }

  async HandleConfirmEditDialogButton() {

    this.isLoadingResults = true;

    let data: any = {
      id: this.selectedRowItem.id,
      key: this.editKey,
      value: this.editValue,
      moduleId: this.editSelectedModule.id

    }


    await this.httpCrudService.postEditSystemSetting(data).then(
      async data => {
        //console.log(data);
        await this.DisplayToastAndUpdateTable(data);
      }
    );



  }


  //////////////////////////////////////////////////////


  HandleIsFilterEmpty(event) {
    /*
    if ((this.testNumberFilterValue == "") && (this.statusFilterValue == "")
      && (this.ofFilterValue == "") && (this.testTypeFilterValue == "")
      && (this.requestedByFilterValue == "") && (this.sampleQuantityFilterValue == "")
      && (this.productCodeFilterValue == "") && (this.receivedByFilterValue == "")
      && (this.storageLocationFilterValue == "") && (this.testExecutedByFilterValue == "")
      && (this.physicalSampleDestinationFilterValue == "") && (this.testInitialCommentsFilterValue == "")
      && (this.dimensionFilterValue == "") && (this.steelGradeFilterValue == "")
      && (this.castNumberFilterValue == "") && (this.clientFilterValue == "")
      && (this.sectorFilterValue == "") && (this.testTitleFilterValue == "")
      && (this.testFinalCommentsFilterValue == "")) {

      this.totalReports = this.dataTableValues.length;
      this.filteredDataTableValues = this.dataTableValues;

    }*/

  }

  ////////////////////////////////////////////////////
  //Add Dialog Validation

  HandleElementValidation(event, keyValue, value) {
    //console.log(this.selectedProfile, userLogin, userName);

    if (this.selectedModule.id != 0) {
      if ((keyValue.length > 3) && (value.length > 0)) {
        this.isConfirmAddButton = false;
        this.isConfirmEditButton = false;
      }
      else {
        this.isConfirmAddButton = true;
        this.isConfirmEditButton = true;
      }

    }
    else {
      this.isConfirmAddButton = true;
      this.isConfirmEditButton = true;
    }


  }


  ///////////////////////////////////

  selectedRowItem: any = null;

  HandleDeleteItem(selectedItem: any) {
    this.selectedRowItem = selectedItem;
    this.displayDeleteDialog = true;
    //console.log(selectedItem);
  }

  async HandleDeleteConfirmButton() {

    this.isLoadingResults = true;

    let selectedIds: number[] = [];

    if (this.isDeleteSelectedItemsPressed) {
      selectedIds = this.selectedRows.map(item => {
        return item.id;
      });
    } else {
      selectedIds.push(this.selectedRowItem.id)
    }

    //console.log(selectedIds);

    await this.httpCrudService.postDeleteSystemSettings(selectedIds).then(
      async data => {
        //console.log(data);
        await this.DisplayToastAndUpdateTable(data);
      }
    )


    this.isDeleteItemsDisabled = true;
    this.dataTable.reset();

  }


  ////////////////////////////////////////////////////////////
  //Export CSV

  HandleExportCSV(e: Table) {
    const hiddenColumns: any[] = [];

    e.columns.forEach((c) => {

      // search for whatever criteria you care for.  in my use case if the column is hidden i don't want to export that data
      if (c.hidden === true) {
        hiddenColumns.push({ field: c.field, col: c });
        c.field = '';
      }
    });

    e.exportCSV();


    hiddenColumns.forEach((hc) => {
      hc.col.field = hc.field;
    });
  }


  ////////////////////////////////////////////////////////

  HandleRowSelect(selectedRow) {
    //console.log(this.selectedRows);

    this.isDeleteItemsDisabled = false;

  }


  HandleRowUnSelect(selectedRow) {
    //console.log(this.selectedRows);

    if (this.selectedRows.length === 0) {
      this.isDeleteItemsDisabled = true;
    } else {
      this.isDeleteItemsDisabled = false;
    }
  }



  HandleHeaderCheckBoxClick() {
    if ((this.selectedRows.length > 0) && (!this.isDeleteItemsDisabled)) {
      this.isDeleteItemsDisabled = false;
    } else {
      if (this.isDeleteItemsDisabled) {
        this.isDeleteItemsDisabled = false;
      } else {
        this.isDeleteItemsDisabled = true;
      }

    }
  }

}
