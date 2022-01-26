import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

//Services

import { ReportSnackBar } from '../../shared/components/report-snack-bar/report-snack-bar';
import { UserConfigurationData } from '../../services/user-configuration';
import { HttpService } from '../../services/http-general-service';
import { HttpCrudService } from '../../services/http-crud-service';
import { SharedService } from '../../services/shared-service';
import { DateFormatter } from '../../services/date-formatter';

//Const
import { inputTypes, tables } from 'src/app/constants/crud.const';
import { actions } from 'src/app/constants/crud.const';

//Interface
import { IDropDownItems } from 'src/app/interfaces/components/dropdown';
import { isEmptyObject } from 'jquery';


@Component({
  selector: 'app-work-schedule',
  templateUrl: './work-schedule.component.html',
  styleUrls: ['./work-schedule.component.css'],
  providers: [
    MessageService, ReportSnackBar, UserConfigurationData, HttpService, HttpCrudService,
    DateFormatter
  ]
})
export class WorkScheduleComponent implements OnInit {

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private messageService: MessageService, private httpService: HttpService,
    private httpCrudService: HttpCrudService, public sharedService: SharedService,
    private reportSnackBar: ReportSnackBar, private userDataService: UserConfigurationData,
    private dateFormatter: DateFormatter
  ) { }

  //BlockUI

  isLoadingResults = false;

  //Panel

  headerTitleLabel: string = "Programación Períodica";
  collapsed: boolean = true;

  //Tables
  workScheduleDataTableValues: any[] = [];

  workScheduleListOfColumns: any = [
    { field: 'checkBoxSelect', header: '', width: '3rem', hidden: true, exportable: false, isDate: false },
    { field: 'id', header: 'ID', width: '6rem', filterValue: '', hidden: false, isDate: false },
    { field: 'name', header: 'Nombre', filterValue: '', hidden: false, isDate: false },
    //{ field: 'workScheduleDescription', header: 'Descripción', filterValue: '', hidden: false },
    { field: 'startTime', header: 'Inicio', filterValue: '', hidden: false, isDate: true },
    { field: 'endTime', header: 'Fin', filterValue: '', hidden: false, isDate: true },
    { field: 'workSchemeName', header: 'Esquema', filterValue: '', hidden: false, isDate: false },
    { field: 'rotationName', header: 'Rotación', filterValue: '', hidden: false, isDate: false },
    { field: 'actionButtons', header: '', width: '', hidden: true, exportable: false, isDate: false }
  ];

  wScheduleExportFileName: string = "STA2 - Cronogramas";

  wscheduleSelectedRows: any[] = [];

  wScheduleTable: string = tables['W-SCHEDULE'];

  //Dialogs

  addDialogVisible: boolean = false;
  addDialogheader: string = 'Añadir cronograma';
  addDialogData: any = {
    formData: [],
  };

  deleteDialogheader: string = 'Eliminar registro/s';

  //CASCADE - DROPDOWN

  eventClassTreeNode: any[] = [];
  equipmentOptions: IDropDownItems[] = []

  rotationOptions: IDropDownItems[] = [];
  workSchemeOptions: IDropDownItems[] = [];


  async ngOnInit() {

    //Menu Side Bar configuration
    this.storage.set('isPreviousPageLogin', false);




    this.sharedService.saveDialogDataSharedMessage.subscribe(async message => {

      console.log(message);
      this.isLoadingResults = true;
      if (!isEmptyObject(message)) {
        await this.httpCrudService.postAddWorkSchedule(message).then(
          data => {
            //console.log(data);

            this.DisplayToastAndUpdateTable(data);
          }
        );;
      }

      this.isLoadingResults = false;
    });


    this.sharedService.deleteDataSharedMessage.subscribe(async message => {
      if (Array.isArray(message)) {
        this.isLoadingResults = true;

        const dataArray: any = message;
        await this.httpCrudService.postDeleteWorkShedules(dataArray).then(
          data => {
            //console.log(data);

            this.DisplayToastAndUpdateTable(data);
          }
        );

        this.isLoadingResults = false;

      }
    });

    this.isLoadingResults = true;

    await this.httpCrudService.getRotation().then(data => {
      //console.log(data);
      if (data !== null) {
        this.rotationOptions = data.map(item => {
          return {
            id: item.rotationId,
            code: item.rotationName,
            label: item.rotationDescription
          }
        });
      }
    });

    await this.getWorkSchedule();




    await this.httpCrudService.getWorkScheme().then(data => {
      //console.log(data);
      if (data !== null) {
        this.workSchemeOptions = data.map(item => {
          return {
            id: item.workSchemeId,
            code: item.workSchemeName,
            label: item.workSchemeName
          }
        });
      }
    });

    this.isLoadingResults = false;
  }


  async HandleDialogButton(e) {
    console.log(e);


    switch (e.source) {
      case tables['W-SCHEDULE']:
        if (e.action === actions.ADD) {
          this.addDialogData['workScheduleId'] = 0;
          this.addDialogData.formData = [
            {
              name: 'workScheduleName',
              dbName: 'WorkScheduleName',
              label: 'Nombre',
              value: '',
              type: inputTypes.INPUT_TEXT,
              disabled: false
            },
            {
              name: 'workScheduleDescription',
              dbName: 'WorkSchemeDescription',
              label: 'Descripción',
              value: '',
              type: inputTypes.INPUT_TEXT,
              disabled: false
            },
            {
              name: 'workSchemeName',
              dbName: 'WorkSchemeId',
              label: 'Esquema',
              value: { id: 0, label: 'Esquema', code: 'noSelection' },
              type: inputTypes.DROPDOWN,
              disabled: false,
              options: [
                { id: 0, label: 'Esquema', code: 'noSelection' },
                ...this.workSchemeOptions
              ]
            },
            {
              name: 'rotationName',
              dbName: 'RotationId',
              label: 'Rotación',
              value: { id: 0, label: 'Rotación', code: 'noSelection' },
              type: inputTypes.DROPDOWN,
              disabled: false,
              options: [
                { id: 0, label: 'Rotación', code: 'noSelection' },
                ...this.rotationOptions
              ]
            },
            {
              label: 'Inicio',
              dbName: 'StartTime',
              type: inputTypes.CALENDAR,
              disabled: false,
              value: null,
              configuration: {
                maxDate: new Date(),
                isNulleable: false
              }
            },
            {
              label: 'Fin',
              dbName: 'EndTime',
              type: inputTypes.CALENDAR,
              disabled: false,
              value: null,
              configuration: {
                maxDate: new Date(),
                isNulleable: true
              }
            },
          ];
        }
        if (e.action === actions.UPDATE) {

          this.addDialogData['workScheduleId'] = e.data.workScheduleId;
          this.addDialogData.formData = [
            {
              name: 'workScheduleName',
              dbName: 'WorkScheduleName',
              label: 'Nombre',
              value: e.data.name,
              type: inputTypes.INPUT_TEXT,
              disabled: false
            },
            {
              name: 'workScheduleDescription',
              dbName: 'WorkSchemeDescription',
              label: 'Descripción',
              value: e.data.workScheduleDescription,
              type: inputTypes.INPUT_TEXT,
              disabled: false
            },
            {
              name: 'workSchemeName',
              dbName: 'WorkSchemeId',
              label: 'Esquema',
              value: this.workSchemeOptions.find(item => item.label === e.data.workSchemeName),
              type: inputTypes.DROPDOWN,
              disabled: false,
              options: [
                { id: 0, label: 'Esquema', code: 'noSelection' },
                ...this.workSchemeOptions
              ]
            },
            {
              name: 'rotationName',
              dbName: 'RotationId',
              label: 'Rotación',
              value: this.rotationOptions.find(item => item.label === e.data.rotationName),
              type: inputTypes.DROPDOWN,
              disabled: false,
              options: [
                { id: 0, label: 'Rotación', code: 'noSelection' },
                ...this.rotationOptions
              ]
            },
            {
              label: 'Inicio',
              dbName: 'StartTime',
              type: inputTypes.CALENDAR,
              disabled: false,
              value: e.data.startTime ? this.dateFormatter.ISODateObjectFormatter(e.data.startTime) : null,
              configuration: {
                maxDate: new Date(),
                isNulleable: false
              }
            },
            {
              label: 'Fin',
              dbName: 'EndTime',
              type: inputTypes.CALENDAR,
              disabled: false,
              value: e.data.endTime ? this.dateFormatter.ISODateObjectFormatter(e.data.endTime) : null,
              configuration: {
                maxDate: new Date(),
                isNulleable: true
              }
            },
          ];


        }
        break;


    }

    console.log(this.addDialogData)

    this.addDialogVisible = true;
  }


  /////////////////////////////////////////////////

  async getWorkSchedule() {

    await this.httpCrudService.getWorkSchedule().then(data => {
      console.log(data);
      if (data !== null) {
        this.workScheduleDataTableValues = data.map(item => {

          if (item.endTime)

            //this.dateFormatter.DateArrayFormatter(item.endTime)[2]

            return {
              id: item.workScheduleId,
              name: item.workScheduleName,
              workScheduleDescription: item.workScheduleDescription,
              rotationName: item.rotationDescription,
              startTime: item.startTime,
              endTime: item.endTime,
              workSchemeName: item.workSchemeName
            }
        });
      } else {
        this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
      }
    });


  }



  /////////////////////////////////////////////////

  async DisplayToastAndUpdateTable(data: any) {
    if (data !== null) {

      if (((data.deleteRecords !== 0) || (data.newRecords !== 0) || (data.updateRecords !== 0))) {

        await this.getWorkSchedule();

        this.messageService.add({
          life: 6000, key: 'operationStatusInfo',
          severity: 'success', summary: 'Completado',
          detail: 'Se han actualizado los datos correctamente'
        });

      } else {
        this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
      }


    } else {


      this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
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
