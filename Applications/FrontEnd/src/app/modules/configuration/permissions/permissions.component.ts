import { AfterViewInit, Component, HostListener, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

//Services

import { ReportSnackBar } from '../../../shared/components/report-snack-bar/report-snack-bar';
import { UserConfigurationData } from '../../../services/user-configuration';
import { HttpService } from '../../../services/http-general-service';
import { HttpCrudService } from '../../../services/http-crud-service';

//Interfaces

import { IDropDownItems } from '../../../interfaces/components/dropdown'
import { Table } from 'primeng/table';
import { TabView } from 'primeng/tabview';




@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    MessageService, ReportSnackBar, UserConfigurationData, HttpService, HttpCrudService
  ]
})
export class PermissionsComponent implements OnInit, AfterViewInit {

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private messageService: MessageService, private httpService: HttpService,
    private httpCrudService: HttpCrudService,
    private reportSnackBar: ReportSnackBar, private userDataService: UserConfigurationData
  ) { }

  @ViewChild('dataTable') dataTable: Table;
  @ViewChild('tabView') tabView: TabView;
  //BlockUI

  isLoadingResults = false;

  //CSV
  exportFileName: string = "STA - Permisos";

  //Panel

  headerTitleLabel: string = "Permisos";

  //Tables

  dataTableValues: any[] = [];
  dataViewModulesValues: any[] = [];
  dataViewFilteredModulesValues: any[] = [];

  selectedRows: any;

  listOfColumns: any =
    [
      //{ field: 'checkBoxSelect', header: '', width: '3rem', hidden: true, exportable: false },
      { field: 'id', header: 'ID', width: '8rem', filterValue: '', hidden: false },
      { field: 'name', header: 'Nombre', filterValue: '', hidden: false },
      { field: 'description', header: 'Descripción', filterValue: '', hidden: false },
      { field: 'enabledString', header: 'Habilitado', width: '10rem', filterValue: '', hidden: false },
      //{ field: 'endPoint', header: 'EndPoint', hidden: true, exportable: false },
      { field: 'actionButtons', header: '', width: '5rem', hidden: true, exportable: false }
    ];

  isDeleteItemsDisabled: boolean = true;

  //TabView

  items: any[] = [];

  activeIndex: number = 0;

  isTabViewVisible: boolean = true;

  //Drag&Drop

  //Drag over Listener

  isDragOver: boolean = false;

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();


    const dropableArea = evt.path.find(item => {
      return item.id === 'dropableArea';
    });


    if ((dropableArea !== undefined)) {
      this.isDragOver = true;
    } else {
      this.isDragOver = false;
    }


  }


  //Dragleave Listener

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    //console.log(evt);
    evt.preventDefault();
    evt.stopPropagation();




    const dropableArea = evt.path.find(item => {
      return item.id === 'dropableArea';
    });


    if ((dropableArea !== undefined)) {
      this.isDragOver = true;
    } else {
      this.isDragOver = false;
    }

    //console.log('Drag Leave');

  }

  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    //console.log(evt);

    this.isDragOver = false;



  }

  //Dialogs

  displayAddDialog: boolean = false;
  addDialogHeader: string = "Agregar Módulo";

  deleteDialogHeader: string = "Eliminar Permiso";
  displayDeleteDialog: boolean = false;

  editHeaderDialog: string = "Actualizar Módulo"
  displayEditDialog: boolean = false;

  isConfirmAddButton: boolean = true;




  //Inputs

  name: string = "";
  description: string = "";
  endPoint: string = "";
  profileName: string = "";
  profileDescription: string = "";

  //Switch
  enabled: boolean = false;

  //DataView

  emptyMessage: string = "Ya se han asignados todos los permisos!"

  dialogType = "modules";

  //DropDown

  enabledOptions: any[] =
    [
      { id: 2, label: 'ON', value: 'ON' },
      { id: 3, label: 'OFF', value: 'OFF' },
    ]

  selectedEnabledFilter: any = null;

  addProfileOptions: IDropDownItems[] = [];

  selectedAddProfile: IDropDownItems = null;

  //button

  isAddModuleButtonDisabled: boolean = false;


  async ngOnInit() {

    //Menu Side Bar configuration
    this.storage.set('isPreviousPageLogin', false);

    this.isLoadingResults = true;
    await this.getSystemModules();

    await this.getProfiles();

    const activeIndex: number = this.tabView.tabs.findIndex(item => {
      return item._selected === true;
    });

    //console.log(this.tabView.findSelectedTab())

    //console.log(this.tabView.activeIndex);

    const defaultProfileId: number = 1;



    await this.getSystemModulesByProfileId(defaultProfileId);


    this.dataViewFilteredModulesValues = this.SearchModules(this.dataTableValues, this.dataViewModulesValues);


    //this.dataTable.clear();
    this.isLoadingResults = false;

  }

  SearchModules(dataTable: any[], dataView: any): any[] {

    let filteredValues: any[] = [];

    dataView.forEach(moduleItem => {

      const module = dataTable.find(item => {
        return item.id === moduleItem.id;
      });
      //console.log(module);
      if (module === undefined) {
        filteredValues = [...filteredValues, moduleItem];
      }

    });

    return filteredValues;

  }


  /////////////////////////////////////////////////////////////

  async getSystemModules() {

    await this.httpCrudService.getSystemModules().then(
      data => {

        //console.log(data);

        if ((data !== null) && (data.error == null)) {


          this.dataViewModulesValues = data.map(function (currentValue, index, array) {
            let dataTableRow: any =
            {
              id: currentValue.id,
              name: currentValue.name,
              description: currentValue.description,
              enabled: currentValue.enabled,
              endPoint: currentValue.endPoint
            };
            return dataTableRow;
          });

          ///console.log(this.dataTableValues);


        } else {
          this.isAddModuleButtonDisabled = true;
          this.ShowUnAuthorizeToast(data);

        }
      }
    );

  }

  async getSystemModulesByProfileId(profileId: number) {

    await this.httpCrudService.getSystemModulesByProfileId(profileId).then(
      data => {
        //console.log(data);
        if ((data !== null) && (data.error == null)) {

          this.dataTableValues = data.map(item => {

            const dataTableRow: any = {
              id: item.systemModuleId,
              name: item.systemModuleName,
              description: item.systemModuleDescription,
              enabled: item.enabled,
              enabledString: item.enabled ? 'ON' : 'OFF'
            }
            return dataTableRow;
          });

          console.log(this.dataTableValues);

        } else {

          this.ShowUnAuthorizeToast(data);

        }

      }
    );

  }


  async getProfiles() {

    await this.httpCrudService.getProfiles().then(
      data => {
        if ((data !== null) && (data.error == null)) {
          this.items = data.map((item) => {
            return (
              {
                id: item.id,
                header: item.label,
                code: item.code
              }
            );
          });
          [...this.addProfileOptions] = data;

          this.addProfileOptions = [{ id: 0, label: 'Ninguno', code: 'noProfile' }, ...this.addProfileOptions];
          this.selectedAddProfile = this.addProfileOptions[0];

          if (data.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Aviso!', detail: 'No se encontraron perfiles.' });
          }

        } else {

          this.isTabViewVisible = false;

          this.ShowUnAuthorizeToast(data);

          this.messageService.add({ severity: 'error', summary: 'Error!', closable: false, detail: 'Se ha producido un error en la comunicación con el servidor.' });

        }

      }
    );
  }
  async ngAfterViewInit() {


    // const activeIndex: number = this.tabView._activeIndex;

    // console.log(activeIndex)

    // console.log(this.tabView.findSelectedTab())
    // await this.httpCrudService.getSystemModulesByProfileId(this.items[activeIndex]).then(
    //   data => {
    //     console.log(data);
    //   }
    // );


  }

  //////////////////////////////////////////////////////

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

  async DisplayToastAndUpdateTable(data: number, dialogType: string, request: boolean) {
    if (data !== null) {
      if (data == 1) {

        if (request) {

          switch (dialogType) {
            case 'modules':
              await this.getSystemModules();
              break;

            case 'profiles':
              await this.getProfiles();
              break;
          }
        }




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


  /////////////////////////////////////////////

  draggedItem: any;

  dragStart(event, item) {

    //console.log(event, item);
    this.draggedItem = item;
  }


  dragEnd() {
    this.draggedItem = null;
  }

  async drop() {

    const draggedItem = this.draggedItem;

    if (draggedItem) {

      const isModule: number = this.dataTableValues.findIndex(item => {

        return item.id === draggedItem.id
      });

      if (isModule === -1) {

        this.isLoadingResults = true;


        //console.log(this.activeIndex);

        const data = {
          profileId: this.items[this.activeIndex].id,
          permissionId: 0,
          systemModuleId: draggedItem.id,
          systemModuleName: draggedItem.name,
          systemModuleDescription: draggedItem.description
        };

        await this.httpCrudService.postAddPermission(data).then(
          async data => {

            console.log(data);

            if (data === 1) {
              this.dataTableValues = [draggedItem, ...this.dataTableValues];
              //console.log(this.dataViewModulesValues);

              //console.log(draggedItem);
              this.DisplayToastAndUpdateTable(data, 'modules', false);
              const deleteModule: number = this.dataViewFilteredModulesValues.findIndex(
                item => {
                  return item.id === draggedItem.id;
                }
              );
              this.dataViewFilteredModulesValues.splice(deleteModule, 1);

              this.dataViewFilteredModulesValues = [...this.dataViewFilteredModulesValues];
              // console.log(this.dataViewModulesValues);
              //await this.DisplayToastAndUpdateTable(data, 'modules');
            } else {
              this.DisplayToastAndUpdateTable(data, 'modules', false);
            }
          }
        );

        this.isLoadingResults = false;
      } else {


        this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'El perfil ya posee dicho permiso!' });
      }

    }
  }

  ///////////////////////////////////////////////

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

  ////////////////////////////////////////////////

  HandleAddButton(dialogType: string) {

    this.dialogType = dialogType;


    switch (dialogType) {
      case 'modules':
        this.addDialogHeader = 'Agregar Módulo';
        break;
      case 'profiles':
        this.addDialogHeader = 'Agregar Perfil';
        break;
    }

    this.displayAddDialog = true;
    //this.selectedModule = this.modulesOptions[0];
  }


  async HandleConfirmAddButton(dialogType: string) {

    this.isLoadingResults = true;
    let data: any = {};

    switch (dialogType) {
      case 'modules':
        data = {
          name: this.name,
          description: this.description,
          endPoint: this.endPoint,
          enabled: this.enabled

        }


        await this.httpCrudService.postAddSystemModule(data).then(
          async data => {
            //console.log(data);
            await this.DisplayToastAndUpdateTable(data, dialogType, true);

            this.dataViewFilteredModulesValues = this.SearchModules(this.dataTableValues, this.dataViewModulesValues);
          }
        );

        break;
      case 'profiles':
        data = {
          name: this.profileName,
          description: this.profileDescription,
          referenceProfileId: this.selectedAddProfile.id
        }


        await this.httpCrudService.postAddProfile(data).then(
          async data => {
            //console.log(data);
            await this.DisplayToastAndUpdateTable(data, dialogType, true);


          }
        );

        break;
    }


    this.displayAddDialog = false;


  }


  HandleAddDialogHide(event) {

    this.isConfirmAddButton = true;

    this.profileDescription = "";
    this.profileName = "";
    this.name = "";
    this.description = "";
    this.endPoint = "";
    this.enabled = false;
  }



  selectedRowItem: any = null;

  HandleDeleteItem(selectedItem: any) {
    this.selectedRowItem = selectedItem;
    this.displayDeleteDialog = true;
    //console.log(selectedItem);
  }


  isDeleteSelectedItemsPressed: boolean = false;

  HandleDeleteSelectedItems() {

    this.isDeleteSelectedItemsPressed = true;
    this.displayDeleteDialog = true;



    //console.log(selectedIds);



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

    console.log(selectedIds);

    const data: any = {

      ids: selectedIds,
      profileId: this.items[this.activeIndex].id
    }

    await this.httpCrudService.postDeletePermissions(data).then(
      async data => {
        //console.log(data);

        await this.DisplayToastAndUpdateTable(data, '', false);

        if (data === 1) {



          selectedIds.forEach(element => {

            const index: number = this.dataTableValues.findIndex(item => {
              return item.id === element;
            });
            console.log(index);
            if (index >= 0) {

              this.dataTableValues.splice(index, 1);
            }

          });
          this.dataViewFilteredModulesValues = this.SearchModules(this.dataTableValues, this.dataViewModulesValues);
        }
      }
    )


    this.isDeleteItemsDisabled = true;
    this.dataTable.reset();

    this.isLoadingResults = false;

  }


  //////////////////////////////////////////////////

  async HandleChangeTab(activeIndex) {

    this.isLoadingResults = true;
    await this.getSystemModulesByProfileId(this.items[activeIndex].id);

    this.dataViewFilteredModulesValues = this.SearchModules(this.dataTableValues, this.dataViewModulesValues);

    this.dataViewFilteredModulesValues = [...this.dataViewFilteredModulesValues];
    this.isLoadingResults = false;
  }

  /////////////////////////////////////////////////

  HandleElementValidation(dialogType) {
    //console.log(this.selectedProfile, userLogin, userName);
    //console.log(dialogType);

    switch (dialogType) {
      case 'modules':
        if ((this.name.length > 3) && (this.description.length > 0)) {
          this.isConfirmAddButton = false;
          //this.isConfirmEditButton = false;
        }
        else {
          this.isConfirmAddButton = true;
          //this.isConfirmEditButton = true;
        }
        break;
      case 'profiles':
        if ((this.profileName.length > 3) && (this.profileDescription.length > 0)) {
          this.isConfirmAddButton = false;
          //this.isConfirmEditButton = false;
        }
        else {
          this.isConfirmAddButton = true;
          //this.isConfirmEditButton = true;
        }
        break;
    }




  }

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



}
