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
  selector: 'app-users-crud',
  templateUrl: './users-crud.component.html',
  styleUrls: ['./users-crud.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    MessageService, ReportSnackBar, UserConfigurationData, HttpService, HttpCrudService
  ]
})
export class UsersCrudComponent implements OnInit {

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private messageService: MessageService, private httpService: HttpService,
    private httpCrudService: HttpCrudService,
    private reportSnackBar: ReportSnackBar, private userDataService: UserConfigurationData
  ) {


  }

  @ViewChild('dataTable') dataTable: Table;


  //BlockUI

  isLoadingResults = false;

  //Panel

  headerTitleLabel: string = "ABM - Usuarios";

  //CSV
  exportFileName: string = "STA - Usuarios";

  //Table

  dataTableValues: any[] = [];

  //Table Structure

  listOfColumns: any =
    [
      { field: 'checkBoxSelect', header: '', width: '3rem', hidden: true, exportable: false },
      { field: 'id', header: 'ID', width: '8rem', filterValue: '', hidden: false },
      { field: 'userLogin', header: 'Login', filterValue: '', hidden: false },
      { field: 'userName', header: 'Nombre', filterValue: '', hidden: false },
      { field: 'profile', header: 'Perfil', filterValue: '', hidden: false },
      { field: 'actionButtons', header: '', width: '10rem', hidden: true, exportable: false }
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
  addDialogHeader: string = "Agregar Nuevo Usuario";

  deleteDialogHeader: string = "Eliminar Usuario";
  displayDeleteDialog: boolean = false;

  editHeaderDialog: string = "Actualizar Perfil de Usuario"
  displayEditDialog: boolean = false;


  //DropDown

  selectedProfile: IDropDownItems = null;
  profilesTypes: IDropDownItems[] = [];


  //Buttons
  isDeleteItemsDisabled: boolean = true;



  async ngOnInit() {

    //Menu Side Bar configuration
    this.storage.set('isPreviousPageLogin', false);

    this.isLoadingResults = true;
    //console.log(this.storage.get('isLoggedIn'));

    await this.getUsers();


    await this.httpCrudService.getProfiles().then(
      data => {
        //console.log(data);
        if ((data !== null) && (data.error == null)) {

          this.profilesTypes = data;

        }
        else {

          this.profilesTypes.push({ id: 0, label: 'Sin Datos', code: 'NoData' });
          //console.log(data);

          this.ShowUnAuthorizeToast(data);
        }

        this.selectedProfile = this.profilesTypes[0];
      }
    )

    this.isLoadingResults = false;

  }

  ////////////////////////////////////////////////////////////

  userLoginInputValue: string = "";
  userNameInputValue: string = "";
  isConfirmAddButton: boolean = true;

  HandleAddButton() {

    this.displayAddDialog = true;
    this.userLoginInputValue = "";
    this.userNameInputValue = "";
    this.selectedProfile = this.profilesTypes[0];
  }


  HandleAddDialogHide(event) {

  }


  async HandleConfirmAddButton() {

    this.isLoadingResults = true;

    let userData: any = {
      login: this.userLoginInputValue,
      name: this.userNameInputValue,
      profileId: this.selectedProfile.id
    }

    await this.httpCrudService.postAddUser(userData).then(
      async data => {
        //console.log(data);
        await this.DisplayToastAndUpdateTable(data);
      }
    );



    this.displayAddDialog = false;





  }

  /////////////////////////////////////////////////////

  async DisplayToastAndUpdateTable(data: any) {
    if (data !== null) {
      if ((data == 1) && (data.error == null)) {

        await this.getUsers();


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

  isDeleteSelectedUsersPressed: boolean = false;
  HandleDeleteSelectedItems() {

    this.isDeleteSelectedUsersPressed = true;
    this.displayDeleteDialog = true;



    //console.log(selectedIds);



  }

  ////////////////////////////////////////////////////7

  isConfirmEditButton: boolean = false;

  editUserLogin: string = "";
  editUserName: string = "";
  editUserProfile: string = "";
  editSelectedProfile: IDropDownItems = null;

  HandleEditItem(selectedItem) {

    this.selectedRowItem = selectedItem;

    this.editUserLogin = selectedItem.userLogin;
    this.editUserName = selectedItem.userName;
    this.editSelectedProfile = this.profilesTypes.find(
      item => {
        return item.label === selectedItem.profile;
      }
    );

    this.editUserProfile = this.editSelectedProfile.label;

    this.displayEditDialog = true;



  }

  async HandleConfirmEditDialogButton() {

    this.isLoadingResults = true;

    let userData: any = {
      id: this.selectedRowItem.id,
      login: this.editUserLogin,
      name: this.editUserName,
      profileId: this.editSelectedProfile.id

    }


    await this.httpCrudService.postEditUser(userData).then(
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

  HandleElementValidation(event, userLogin, userName) {
    //console.log(this.selectedProfile, userLogin, userName);

    if (this.selectedProfile.id != 0) {
      if ((userName.length > 3) && (userLogin.length > 3)) {
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

  async getUsers() {
    await this.httpCrudService.getUsers().then(
      data => {

        console.log(data);

        if ((data !== null) && (data.error == null)) {

          this.dataTableValues = data.map(function (currentValue, index, array) {
            let dataTableRow: any =
            {
              checkBoxSelect: false,
              id: currentValue.userId,
              userLogin: currentValue.userLogin,
              userName: currentValue.userName,
              profile: currentValue.profileName
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

  //////////////////////////////////////////////////////////

  selectedRowItem: any = null;

  HandleDeleteItem(selectedItem: any) {
    this.selectedRowItem = selectedItem;
    this.displayDeleteDialog = true;
    //console.log(selectedItem);
  }

  async HandleDeleteConfirmButton() {

    this.isLoadingResults = true;

    let selectedIds: number[] = [];

    if (this.isDeleteSelectedUsersPressed) {
      selectedIds = this.selectedRows.map(item => {
        return item.id;
      });
    } else {
      selectedIds.push(this.selectedRowItem.id)
    }

    //console.log(selectedIds);

    await this.httpCrudService.postDeleteUser(selectedIds).then(
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


}
