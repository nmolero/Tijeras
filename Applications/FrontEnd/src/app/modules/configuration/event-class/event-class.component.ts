import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

//const
import { tables, inputTypes, actions } from '../../../constants/crud.const';

//#region - Services

import { ReportSnackBar } from '../../../shared/components/report-snack-bar/report-snack-bar';
import { UserConfigurationData } from '../../../services/user-configuration';
import { HttpService } from '../../../services/http-general-service';
import { HttpCrudService } from '../../../services/http-crud-service';
import { SharedService } from '../../../services/shared-service';
//#endregion

//#region - Interfaces

import { IDropDownItems } from '../../../interfaces/components/dropdown'
import { Table } from 'primeng/table';
//#endregion


@Component({
  selector: 'app-event-class',
  templateUrl: './event-class.component.html',
  styleUrls: ['./event-class.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    MessageService, ReportSnackBar, UserConfigurationData, HttpService, HttpCrudService
  ]
})

export class EventClassComponent implements OnInit {

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private messageService: MessageService, private httpService: HttpService,
    private httpCrudService: HttpCrudService, public sharedService: SharedService,
    private reportSnackBar: ReportSnackBar, private userDataService: UserConfigurationData
  ) { }

  //BlockUI

  isLoadingResults = false;

  //#region - Panel desplegable

  headerTitleLabel: string = "Menú desplegable para la \"Causa y Subcausa\"";
  collapsed: boolean = true;
  //#endregion

  //#region - Tables
  causeDataTableValues: any[] = [];
  subCauseDataTableValues: any[] = [];
  //#endregion

  //#region - able Structures para cada columna o fila en el formulario

  causeListOfColumns: any =
    [
      { field: 'checkBoxSelect', header: '', width: '3rem', hidden: true, exportable: false },
      { field: 'id', header: 'ID', width: '6rem', filterValue: '', hidden: false },
      { field: 'name', header: 'Nombre', filterValue: '', hidden: false },
      { field: 'description', header: 'Descripción', filterValue: '', hidden: false },
      { field: 'eventClassType', header: 'Tipo', filterValue: '', hidden: false },
      { field: 'actionButtons', header: '', width: '', hidden: true, exportable: false }
    ];

  subcCauseListOfColumns: any = [
    { field: 'checkBoxSelect', header: '', width: '3rem', hidden: true, exportable: false },
    { field: 'id', header: 'ID', width: '6rem', filterValue: '', hidden: false },
    { field: 'name', header: 'Nombre', filterValue: '', hidden: false },
    { field: 'description', header: 'Descripción', filterValue: '', hidden: false },
    { field: 'parentCause', header: 'Causa', filterValue: '', hidden: false },
    { field: 'eventClassType', header: 'Tipo', filterValue: '', hidden: false },
    { field: 'actionButtons', header: '', width: '', hidden: true, exportable: false }
  ];

  causeExportFileName: string = "STA2 - Causas";
  subCauseExportFileName: string = "STA2 - Sub Causas"

  causeSelectedRows: any;
  subCauseSelectedRows: any;

  causeTable: string = tables.CAUSE;
  subCauseTable: string = tables['SUB-CAUSE'];
  //#endregion

  //#region - Dialog para mostrar

  addDialogheader: string = ""
  addDialogVisible: boolean = false;

  addDialogData: any[] = [];

  deleteDialogheader: string = "Eliminar registro/s";
  deleteDialogVisible: boolean = false;
  //#endregion

  //DropDown

  eventClassTypesOptions: IDropDownItems[] = [];
  eventParentClassOptions: IDropDownItems[] = [];



  async ngOnInit() {

    //Menu Side Bar configuration
    this.storage.set('isPreviousPageLogin', false);

    this.sharedService.saveDialogDataSharedMessage.subscribe(async message => {

      //console.log(message);

      if (Array.isArray(message)) {

        this.isLoadingResults = true;

        const dataArray: any = message;
        await this.httpCrudService.postEventClass_Save(dataArray).then(
          data => {
            //console.log(data);
            this.DisplayToastAndUpdateTable(data);
          }
        );

        this.isLoadingResults = false;
      }


    });

    this.sharedService.deleteDataSharedMessage.subscribe(async message => {

      //console.log(message);

      if (Array.isArray(message)) {
        this.isLoadingResults = true;

        const dataArray: any = message;
        await this.httpCrudService.postDeleteEventClass(dataArray).then(
          data => {
            //console.log(data);

            this.DisplayToastAndUpdateTable(data);
          }
        );

      }


    });


    this.isLoadingResults = true;

    await this.httpCrudService.getEventClassType().then( //en la espera para obtener el tipo de clase de evento
      async data => {
        //console.log(data);
        if ((data !== null) && (data.error == null)) {//Si el dato es distinto a nulo o el error es nulo

          this.eventClassTypesOptions = data.map(item => ({//me devuelda esta
            label: item.eventClassTypeName,
            code: item.eventClassTypeName,
            id: item.eventClassTypeId
          }));

          await this.httpCrudService.getEventParentClass().then(//Obtiene la clase del evento padre
            async data => {
              //console.log(data);

              if ((data !== null) && (data.error == null)) {
                this.causeDataTableValues = data.map(item => {
                  return {
                    id: item.eventClassId,
                    name: item.eventClassName,
                    description: item.eventClassDescription
                  }
                });

                await this.httpCrudService.getEventParentClass().then(//Obtener evento de la clase padre
                  async data => {
                    //console.log(data);

                    if ((data !== null) && (data.error == null)) {

                      this.causeDataTableValues = data.map(item => {
                        return {
                          id: item.eventClassId,
                          name: item.eventClassName,
                          description: item.eventClassDescription,
                          eventClassType: item.eventClassTypeName
                        }
                      });

                      await this.httpCrudService.getAllSubCauseEventClass().then(//Obtener todos los eventos de la clase sub causa
                        data => {
                          //console.log(data);

                          if ((data !== null) && (data.error == null)) {

                            this.subCauseDataTableValues = data.map(item => {
                              return {
                                id: item.eventClassId,
                                name: item.eventClassName,
                                description: item.eventClassDescription,
                                parentCause: item.eventParentClassName,
                                eventClassType: item.eventClassTypeName
                              }
                            });
                          } else {
                            this.ShowUnAuthorizeToast(data);
                          }
                        }
                      );

                    } else {
                      this.ShowUnAuthorizeToast(data);
                    }
                  }
                );
              } else {
                this.ShowUnAuthorizeToast(data);
              }
            }
          );

        } else {
          this.ShowUnAuthorizeToast(data);
        }
      }
    );


    this.eventParentClassOptions = this.causeDataTableValues.map(item => ({
      label: item.name,
      code: item.name,
      id: item.id
    }));

    this.isLoadingResults = false;



  }


  ////////////////////////////////////////////

  HandleDialogButton(e) {
    console.log(e);

    switch (e.source) {
      case tables.CAUSE:

        if (e.action === actions.ADD) {
          this.addDialogheader = 'Añadir causa';
          this.addDialogData = [
            {
              name: 'name',
              dbName: 'EventClassName',
              label: 'Nombre',
              value: '',
              type: inputTypes.INPUT_TEXT,
              disabled: false
            },
            {
              name: 'description',
              dbName: 'EventClassDescription',
              label: 'Descripción',
              value: '',
              type: inputTypes.INPUT_TEXT,
              disabled: false
            },
            {
              name: 'eventClassType',
              dbName: 'EventClassTypeId',
              label: 'Tipo',
              options: this.eventClassTypesOptions,
              value: this.eventClassTypesOptions[0],
              type: inputTypes.DROPDOWN,
              disabled: false
            }
          ];
        }

        if (e.action === actions.UPDATE) {
          this.addDialogheader = 'Editar causa';
          this.addDialogData = [
            {
              name: 'id',
              dbName: 'EventClassId',
              label: 'ID',
              value: e.data.id,
              type: inputTypes.INPUT_TEXT,
              disabled: true
            },
            {
              name: 'name',
              dbName: 'EventClassName',
              label: 'Nombre',
              value: e.data.name,
              type: inputTypes.INPUT_TEXT,
              disabled: false
            },
            {
              name: 'description',
              dbName: 'EventClassDescription',
              label: 'Descripción',
              value: e.data.description,
              type: inputTypes.INPUT_TEXT,
              disabled: false
            },
            {
              name: 'eventClassType',
              dbName: 'EventClassTypeId',
              label: 'Tipo',
              options: this.eventClassTypesOptions,
              value: this.eventClassTypesOptions.find(item => item.label === e.data.eventClassType),
              type: inputTypes.DROPDOWN,
              disabled: false
            }
          ];
        }
        //console.log(this.addDialogData);
        break;

      case tables['SUB-CAUSE']:

        if (e.action === actions.ADD) {
          this.addDialogheader = 'Añadir sub-causa';
          //console.log(this.causeDataTableValues);
          this.addDialogData = [
            {
              name: 'name',
              dbName: 'EventClassName',
              label: 'Nombre',
              value: '',
              type: inputTypes.INPUT_TEXT,
              disabled: false
            },
            {
              name: 'description',
              dbName: 'EventClassDescription',
              label: 'Descripción',
              value: '',
              type: inputTypes.INPUT_TEXT,
              disabled: false
            },
            {
              name: 'parentCause',
              dbName: 'EventParentClassId',
              label: 'Causa',
              options: this.eventParentClassOptions,
              value: this.causeDataTableValues[0],
              type: inputTypes.DROPDOWN,
              disabled: false
            },
            {
              name: 'eventClassType',
              dbName: 'EventClassTypeId',
              label: 'Tipo',
              options: this.eventClassTypesOptions,
              value: this.eventClassTypesOptions[0],
              type: inputTypes.DROPDOWN,
              disabled: false
            },
          ];
        }

        if (e.action === actions.UPDATE) {
          this.addDialogheader = 'Añadir sub-causa';
          //console.log(this.causeDataTableValues);
          this.addDialogData = [
            {
              name: 'id',
              dbName: 'EventClassId',
              label: 'ID',
              value: e.data.id,
              type: inputTypes.INPUT_TEXT,
              disabled: true
            },
            {
              name: 'name',
              dbName: 'EventClassName',
              label: 'Nombre',
              value: e.data.name,
              type: inputTypes.INPUT_TEXT,
              disabled: false
            },
            {
              name: 'description',
              dbName: 'EventClassDescription',
              label: 'Descripción',
              value: e.data.description,
              type: inputTypes.INPUT_TEXT,
              disabled: false
            },
            {
              name: 'parentCause',
              dbName: 'EventParentClassId',
              label: 'Causa',
              options: this.eventParentClassOptions,
              value: this.eventParentClassOptions.find(item => item.label === e.data.parentCause),
              type: inputTypes.DROPDOWN,
              disabled: false
            },
            {
              name: 'eventClassType',
              dbName: 'EventClassTypeId',
              label: 'Tipo',
              options: this.eventClassTypesOptions,
              value: this.eventClassTypesOptions.find(item => item.label === e.data.eventClassType),
              type: inputTypes.DROPDOWN,
              disabled: false
            }
          ];

        }

        console.log(this.addDialogData);
        break;

      default:
        break;
    }



    this.addDialogVisible = true;
  }


  //////////////////////////////

  HandleLoadingEvent(e) {
    //console.log(e);
  }


  //////////////////////////////////


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

  /////////////////////////////////////////

  async getEventParentClass() {

  }


  async DisplayToastAndUpdateTable(data: any) {
    if (data !== null) {
      if (data.deleteRecords !== undefined) {
        if (((data.deleteRecords !== 0) || (data.newRecords !== 0) || (data.updateRecords !== 0))
          && (data.deleteRecords !== -1)) {

          await this.getTablesData();


          this.isLoadingResults = false;

          this.messageService.add({
            life: 6000, key: 'operationStatusInfo',
            severity: 'success', summary: 'Completado',
            detail: 'Se han actualizado los datos correctamente'
          });

        } else {

          this.isLoadingResults = false;
          // if (data === 0) {
          //   this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
          // }

          if (data.deleteRecords === -1) {
            this.messageService.add({
              life: 6000, key: 'operationStatusInfo',
              severity: 'error', summary: 'Error',
              detail: 'No se ha completado la operación. Causa/s con sub causas existentes!'
            });
          } else {
            this.ShowUnAuthorizeToast(data);
          }



        }
      } else {
        this.isLoadingResults = false;
        this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
      }



    } else {
      this.isLoadingResults = false;

      this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
    }
  }

  ////////////////////////////////////////////////////

  async getTablesData() {

    await this.httpCrudService.getEventParentClass().then(
      async data => {
        //console.log(data);

        if ((data !== null) && (data.error == null)) {

          this.causeDataTableValues = data.map(item => {
            return {
              id: item.eventClassId,
              name: item.eventClassName,
              description: item.eventClassDescription,
              eventClassType: item.eventClassTypeName
            }
          });

          await this.httpCrudService.getAllSubCauseEventClass().then(
            data => {
              //console.log(data);

              if ((data !== null) && (data.error == null)) {

                this.subCauseDataTableValues = data.map(item => {
                  return {
                    id: item.eventClassId,
                    name: item.eventClassName,
                    description: item.eventClassDescription,
                    parentCause: item.eventParentClassName,
                    eventClassType: item.eventClassTypeName
                  }
                });
              } else {
                this.ShowUnAuthorizeToast(data);
              }
            }
          );

        } else {
          this.ShowUnAuthorizeToast(data);
        }
      }
    );
  }
}
