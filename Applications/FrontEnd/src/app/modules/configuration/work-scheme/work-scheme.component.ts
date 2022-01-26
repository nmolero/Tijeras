import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

//Services

import { ReportSnackBar } from '../../../shared/components/report-snack-bar/report-snack-bar';
import { UserConfigurationData } from '../../../services/user-configuration';
import { HttpService } from '../../../services/http-general-service';
import { HttpCrudService } from '../../../services/http-crud-service';
import { SharedService } from '../../../services/shared-service';
import { inputTypes, tables } from 'src/app/constants/crud.const';
import { actions } from 'src/app/constants/crud.const';
import { IDropDownItems } from 'src/app/interfaces/components/dropdown';
import { isEmptyObject } from 'jquery';



@Component({
  selector: 'app-work-scheme',
  templateUrl: './work-scheme.component.html',
  styleUrls: ['./work-scheme.component.css'],
  providers: [
    MessageService, ReportSnackBar, UserConfigurationData, HttpService, HttpCrudService
  ]
})
export class WorkSchemeComponent implements OnInit {

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private messageService: MessageService, private httpService: HttpService,
    private httpCrudService: HttpCrudService, public sharedService: SharedService,
    private reportSnackBar: ReportSnackBar, private userDataService: UserConfigurationData
  ) { }

  //BlockUI

  isLoadingResults = false;

  //Panel

  headerTitleLabel: string = "ABM - Esquemas";
  collapsed: boolean = true;

  //Tables
  workSchemesDataTableValues: any[] = [];

  workSchemeListOfColumns: any = [
    { field: 'checkBoxSelect', header: '', width: '3rem', hidden: true, exportable: false },
    { field: 'id', header: 'ID', width: '6rem', filterValue: '', hidden: false, isDate: false },
    { field: 'name', header: 'Nombre', filterValue: '', hidden: false, isDate: false },
    { field: 'description', header: 'Descripción', filterValue: '', hidden: false, isDate: false },
    { field: 'actionButtons', header: '', width: '', hidden: true, exportable: false }
  ];

  wSchemeExportFileName: string = "STA2 - Esquemas";

  wschemeSelectedRows: any[] = [];

  wSchemeTable: string = tables['W-SCHEME'];

  //Dialogs

  addDialogVisible: boolean = false;
  addDialogheader: string = 'Añadir esquema';
  addDialogData: any = {
    formData: [],
    weekDays: [],
    noWeekDays: false
  };

  deleteDialogheader: string = 'Eliminar registro/s';

  //CASCADE - DROPDOWN

  eventClassTreeNode: any[] = [];
  equipmentOptions: IDropDownItems[] = []

  async ngOnInit() {

    //Menu Side Bar configuration
    this.storage.set('isPreviousPageLogin', false);

    this.sharedService.saveDialogDataSharedMessage.subscribe(async message => {

      //console.log(message);
      this.isLoadingResults = true;
      if (!isEmptyObject(message)) {
        await this.httpCrudService.postAddWorkScheme(message).then(data => {
          this.DisplayToastAndUpdateTable(data);
        });
      }

      this.isLoadingResults = false;
    });

    this.sharedService.deleteDataSharedMessage.subscribe(async message => {
      if (Array.isArray(message)) {
        this.isLoadingResults = true;

        const dataArray: any = message;
        await this.httpCrudService.postDeleteWorkSchemes(dataArray).then(
          data => {
            //console.log(data);

            this.DisplayToastAndUpdateTable(data);
          }
        );

        this.isLoadingResults = false;

      }
    });
    this.isLoadingResults = true;

    await this.getWorkScheme();


    await this.httpCrudService.getWorkSchemeEquipmentEventClass().then(data => {
      if (data !== null) {

        this.machineListDataTableValues = data.map(item => {

          return {

            id: item.workSchemeEquipmentEventClass,
            workSchemeName: item.workSchemeName,
            equipmentName: item.equipmentName,
            eventClassName: item.eventClassName,
            name: item.equipmentName

          }

        });
      }
    });

    await this.httpService.getEventClassTree('Parada').then(data => {
      if (data !== null) {
        this.eventClassTreeNode.push(data);
      }
    });

    this.SearchTreeNullNodes(this.eventClassTreeNode[0]);


    await this.httpCrudService.getEquipmentByType('MAQ').then(
      data => {
        //console.log(data);
        if (data !== null) {
          this.equipmentOptions = data;
        }

      }
    );

    this.isLoadingResults = false;
  }


  async HandleDialogButton(e) {
    console.log(e);


    this.addDialogData.noWeekDays = false;

    switch (e.source) {
      case tables['W-SCHEME']:
        if (e.action === actions.ADD) {
          this.addDialogData['workSchemeId'] = 0;
          this.addDialogData.noWeekDays = true;
          this.addDialogData.weekDays = [];
          this.addDialogData.formData = [
            {
              name: 'name',
              dbName: 'WorkSchemeName',
              label: 'Nombre',
              value: '',
              type: inputTypes.INPUT_TEXT,
              disabled: false,
              configuration: {
                isNulleable: false
              }
            },
            {
              name: 'description',
              dbName: 'WorkSchemeDescription',
              label: 'Descripción',
              value: '',
              type: inputTypes.INPUT_TEXT,
              disabled: false,
              configuration: {
                isNulleable: false
              }
            },
            // {
            //   name: 'eventClass',
            //   dbName: 'EventClassName',
            //   label: 'Causa',
            //   value: {
            //     text: 'causa',
            //     code: 'noSelection',
            //   },
            //   type: inputTypes.CASCADE,
            //   disabled: false,
            //   treeOptions: this.eventClassTreeNode,
            //   placeholder: 'Causa',
            //   configuration: {
            //     isNulleable: false
            //   }
            // },
            // {
            //   name: 'equipment',
            //   dbName: 'EquipmentId',
            //   label: 'Máquina',
            //   value: { id: 0, label: 'Máquina', code: 'noSelection' },
            //   type: inputTypes.DROPDOWN,
            //   disabled: false,
            //   options: [
            //     { id: 0, label: 'Máquina', code: 'noSelection' },
            //     ...this.equipmentOptions
            //   ],
            //   configuration: {
            //     isNulleable: false
            //   }
            // },
          ];
        }
        if (e.action === actions.UPDATE) {

          this.addDialogData.noWeekDays = false;
          this.addDialogData['workSchemeId'] = e.data.id;

          this.addDialogData.formData = [
            {
              name: 'name',
              dbName: 'WorkSchemeName',
              label: 'Nombre',
              value: e.data.name,
              type: inputTypes.INPUT_TEXT,
              disabled: false,
              configuration: {
                isNulleable: false
              }
            },
            {
              name: 'description',
              dbName: 'WorkSchemeDescription',
              label: 'Descripción',
              value: e.data.description,
              type: inputTypes.INPUT_TEXT,
              disabled: false,
              configuration: {
                isNulleable: false
              }
            },
            // {
            //   name: 'eventClass',
            //   dbName: 'EventClassName',
            //   label: 'Causa',
            //   value: { text: e.data.eventClassName, ref_: e.data.eventClass.toString() },
            //   type: inputTypes.CASCADE,
            //   disabled: false,
            //   treeOptions: this.eventClassTreeNode,
            //   placeholder: 'Causa',
            //   configuration: {
            //     isNulleable: false
            //   }
            // },
            // {
            //   name: 'equipment',
            //   dbName: 'EquipmentId',
            //   label: 'Máquina',
            //   value: this.equipmentOptions.find(item => item.id === e.data.equipment) ? this.equipmentOptions.find(item => item.id === e.data.equipment) : { id: 0, label: 'Máquina', code: 'noSelection' },
            //   type: inputTypes.DROPDOWN,
            //   disabled: false,
            //   options: [
            //     { id: 0, label: 'Máquina', code: 'noSelection' },
            //     ...this.equipmentOptions
            //   ],
            //   configuration: {
            //     isNulleable: false
            //   }
            // },
          ];

          this.addDialogData.weekDays = e.data.weekDays;
        }
        break;


    }

    console.log(this.addDialogData)

    this.addDialogVisible = true;
  }


  SearchTreeNullNodes(element) {
    //console.log(element);

    if (element !== undefined) {
      if (element.nodes !== null) {
        let result = null;
        for (let i = 0; result == null && i < element.nodes.length; i++) {
          result = this.SearchTreeNullNodes(element.nodes[i])
        }
        return result;
      } else {
        delete element.nodes;
      }
    }

  }


  ///////////////////////////////////////////////

  wSchemeOptions: IDropDownItems[] = [];


  async getWorkScheme() {
    await this.httpCrudService.getWorkScheme().then(data => {
      //console.log(data);
      if (data !== null) {
        this.workSchemesDataTableValues = data.map(item => {
          return {
            id: item.workSchemeId,
            name: item.workSchemeName,
            description: item.workSchemeDescription,
            weekDays: item.weekDays,
            eventClass: item.eventClassId,
            eventClassName: item.eventClassName,
            equipment: item.equipmentId
          }
        });

        this.wSchemeOptions = data.map(item => {
          return {
            id: item.workSchemeId,
            label: item.workSchemeName,
            code: item.workSchemeName
          }
        });

        this.wSchemeOptions = [{ id: 0, label: 'Esquema', code: 'noSlection' }, ...this.wSchemeOptions];
      }
    });

    //console.log(this.workSchemesDataTableValues);

  }

  //////////////////////////////////////////////////

  HandleMachineAddButton() {

    this.addDialogData.noWeekDays = true;
    this.addDialogData.formData = [
      {
        name: 'workScheme',
        dbName: 'WorkSchemeId',
        label: 'Tipo',
        options: this.wSchemeOptions,
        value: this.wSchemeOptions[0],
        type: inputTypes.DROPDOWN,
        disabled: false
      },
      {
        name: 'eventClass',
        dbName: 'EventClassName',
        label: 'Causa',
        value: {
          text: 'causa',
          code: 'noSelection',
        },
        type: inputTypes.CASCADE,
        disabled: false,
        treeOptions: this.eventClassTreeNode,
        placeholder: 'Causa',
        configuration: {
          isNulleable: false
        }
      },
      {
        name: 'equipment',
        dbName: 'EquipmentId',
        label: 'Máquina',
        value: { id: 0, label: 'Máquina', code: 'noSelection' },
        type: inputTypes.DROPDOWN,
        disabled: false,
        options: [
          { id: 0, label: 'Máquina', code: 'noSelection' },
          ...this.equipmentOptions
        ],
        configuration: {
          isNulleable: false
        }
      },
    ];


    this.addDialogVisible = true;

  }

  machineListheader: string = 'Listado máquinas';
  machineListDialogvisible: boolean = false;

  machineListDataTableValues: any[] = [];

  machineListOfColumns: any = [
    { field: 'checkBoxSelect', header: '', width: '3rem', hidden: true, exportable: false },
    { field: 'id', header: 'ID', width: '6rem', filterValue: '', hidden: false, isDate: false },
    { field: 'workSchemeName', header: 'Esquema', filterValue: '', hidden: false, isDate: false },
    { field: 'equipmentName', header: 'Máquina', filterValue: '', hidden: false, isDate: false },
    { field: 'eventClassName', header: 'Causa', filterValue: '', hidden: false, isDate: false },
    { field: 'actionButtons', header: '', width: '', hidden: true, exportable: false }
  ];

  machineExportFileName: string = "STA2 - Esquemas";

  machineSelectedRows: any[] = [];

  machineListTable: string = tables['M-EVCLS-WS'];







  HandleMachineList() {

    this.machineListDialogvisible = true;


  }

  /////////////////////////////////////////////////

  async DisplayToastAndUpdateTable(data: any) {
    if (data !== null) {

      if (((data.deleteRecords !== 0) || (data.newRecords !== 0) || (data.updateRecords !== 0))) {

        await this.getWorkScheme();

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
