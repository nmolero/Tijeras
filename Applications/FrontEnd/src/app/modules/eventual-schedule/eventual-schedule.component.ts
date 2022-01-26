import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

//#region - Importo los servicios

import { ReportSnackBar } from '../../shared/components/report-snack-bar/report-snack-bar';
import { UserConfigurationData } from '../../services/user-configuration';
import { HttpService } from '../../services/http-general-service';
import { HttpCrudService } from '../../services/http-crud-service';
import { SharedService } from '../../services/shared-service';
import { DateFormatter } from '../../services/date-formatter';

//#endregion

//#region - Importo las constantes
import { inputTypes, tables } from 'src/app/constants/crud.const';
import { actions } from 'src/app/constants/crud.const';
//#endregion

//#region FullCalendar - Para el calendario

import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/angular/node_modules/@fullcalendar/core/locales/es';
import { IDropDownItems } from 'src/app/interfaces/components/dropdown';
import { isEmptyObject } from 'jquery';
import { DateCalculations } from 'src/app/services/date-calculations';
//#endregion


@Component({
  selector: 'app-eventual-schedule',
  templateUrl: './eventual-schedule.component.html',
  styleUrls: ['./eventual-schedule.component.css'],
  providers: [
    MessageService, ReportSnackBar, UserConfigurationData, HttpService, HttpCrudService,
    DateFormatter, DateCalculations
  ]
})
export class EventualScheduleComponent implements OnInit {

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private messageService: MessageService, private httpService: HttpService,
    private httpCrudService: HttpCrudService, public sharedService: SharedService,
    private reportSnackBar: ReportSnackBar, private userDataService: UserConfigurationData,
    private dateFormatter: DateFormatter, private dateCalculations: DateCalculations
  ) {

  }

  @ViewChild('fullCalendar') calendarComponent: FullCalendarComponent;



  //BlockUI
  isLoadingResults = false;

  //PanelMenu

  header: string = "Programación Eventual";
  collapsed: boolean = false;

  //FullCalendar

  options: any = {};

  events: any[] = [];

  calendarOptions: CalendarOptions;

  //Dialog

  addDialogheader: string = "";
  addDialogVisible: boolean = false;

  addDialogData: any = {
    formData: [],

  }

  //CASCADE - DROPDOWN

  eventClassTreeNode: any[] = [];
  equipmentOptions: IDropDownItems[] = []

  async ngOnInit() {

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      //dateClick: this.handleDateClick.bind(this), // bind is important!,
      themeSystem: 'bootstrap',
      events: this.events,
      height: 'auto',
      selectable: true,
      weekNumbers: true,
      weekText: '',
      nowIndicator: true,
      weekTextLong: 'numeric',
      dayHeaderClassNames: ['dayHeader'],
      dayCellClassNames: 'dayHeader',
      eventClassNames: 'dayHeader',
      editable: false,
      eventMouseEnter: (e) => {
        //console.log(e);

      },
      dayHeaderFormat: { weekday: 'short', omitCommas: false },
      showNonCurrentDates: false,
      displayEventEnd: true,
      //aspectRatio: 2,
      headerToolbar: {
        left: 'prev,next,today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        end: 'today prev,next'
      },
      locales: [esLocale],
      locale: 'es',
      dateClick: (e) => {
        console.log(e);

        const dates: Date[] = this.dateCalculations.getTodayLapseOfTime(e.date);

        this.HandleAddButton(dates[0], dates[1]);

      },
      eventClick: (e) => {
        this.HandleEditEvent(e);
      }
    }

    this.sharedService.saveDialogDataSharedMessage.subscribe(async message => {


      this.isLoadingResults = true;

      if (!isEmptyObject(message)) {
        //console.log(message);
        if (message['EventualScheduleName'] !== undefined) {
          await this.httpCrudService.postAddEventualSchedule(message).then(data => {
            console.log(data);
            this.DisplayToastAndUpdateTable(data);

          });
        }

      }

      this.isLoadingResults = false;

    });

    this.sharedService.deleteDataSharedMessageEs.subscribe(async message => {

      //console.log(message);
      if (Array.isArray(message)) {

        this.isLoadingResults = true;

        const dataArray: any = message;

        await this.httpCrudService.postDeleteEventualShedules(dataArray).then(
          data => {
            //console.log(data);

            this.DisplayToastAndUpdateTable(data);
          }
        );

        this.isLoadingResults = false;

      }
    });
    this.isLoadingResults = true;

    await this.GetEventualSchedule();


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

    setTimeout(() => {
      //console.log(this.calendarComponent);
    }, 10);

  }

  ///////////////////////////////////////////////////

  //#region - Método de nodos nulos de árbol de búsqueda
  SearchTreeNullNodes(element) {

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
  //#endregion
  ////////////////////////////////////////////////

  //#region - Método para añadir
  HandleAddButton(startTime: Date, endTime: Date) {

    let isDateClick: boolean = false;

    if ((startTime !== null) && (endTime !== null)) {
      isDateClick = true;
    }

    const todayDates: Date[] = this.dateCalculations.getTodayLapseOfTime(new Date);


    if (this.addDialogData.deleteCheckBoxValue !== undefined) {
      delete this.addDialogData.deleteCheckBoxValue;
    }

    if (this.addDialogData.deleteEvent !== undefined) {
      delete this.addDialogData.deleteEvent;
    }

    this.addDialogheader = "Añadir Evento";
    this.addDialogData.formData = [
      {
        name: 'eventualScheduleName',
        dbName: 'EventualScheduleName',
        label: 'Nombre',
        value: '',
        type: inputTypes.INPUT_TEXT,
        disabled: false
      },
      {
        name: 'eventualScheduleDescription',
        dbName: 'EventualScheduleDescription',
        label: 'Descripción',
        value: '',
        type: inputTypes.INPUT_TEXT,
        disabled: false
      },
      {
        name: 'eventClass',
        dbName: 'EventClassId',
        label: 'Causa',
        value: {
          text: 'causa',
          code: 'noSelection',
          configuration: {
            isNulleable: false
          }
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
      {
        label: 'Inicio',
        dbName: 'StartTime',
        type: inputTypes.CALENDAR,
        disabled: false,
        value: isDateClick ? startTime : todayDates[0],
        configuration: {
          maxDate: null,
          isNulleable: false
        }
      },
      {
        label: 'Fin',
        dbName: 'EndTime',
        type: inputTypes.CALENDAR,
        disabled: false,
        value: isDateClick ? endTime : todayDates[1],
        configuration: {
          maxDate: null,
          isNulleable: false
        }
      },
    ];

    //console.log(this.addDialogData);
    if (this.addDialogData.eventualScheduleId !== undefined) {
      delete this.addDialogData.eventualScheduleId;
    }


    this.addDialogVisible = true;
  }
  //#endregion
  ///////////////////////////////////////////////

  //#region - Método que maneja la edición del evento
  HandleEditEvent({ event }) {

    console.log(event);
    console.log(event.extendedProps);

    this.addDialogheader = "Editar Evento";

    this.addDialogData.formData = [
      {
        name: 'eventualScheduleName',
        dbName: 'EventualScheduleName',
        label: 'Nombre',
        value: event.title,
        type: inputTypes.INPUT_TEXT,
        disabled: false
      },
      {
        name: 'eventualScheduleDescription',
        dbName: 'eventualScheduleDescription',
        label: 'Descripción',
        value: event.extendedProps.description ? event.extendedProps.description : '',
        type: inputTypes.INPUT_TEXT,
        disabled: false
      },
      {
        name: 'eventClass',
        dbName: 'EventClassId',
        label: 'Causa',
        value: { text: event.extendedProps.eventClassName, ref_: event.extendedProps.eventClassId.toString() },
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
        value: this.equipmentOptions.find(item => item.id === event.extendedProps.equipmentId) ? this.equipmentOptions.find(item => item.id === event.extendedProps.equipmentId) : { id: 0, label: 'Máquina', code: 'noSelection' },
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
      {
        label: 'Inicio',
        dbName: 'StartTime',
        type: inputTypes.CALENDAR,
        disabled: false,
        value: event.start ? event.start : null,
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
        value: event.end ? event.end : null,
        configuration: {
          maxDate: new Date(),
          isNulleable: false
        }
      },
    ];

    this.addDialogData['deleteEvent'] = true;
    this.addDialogData['deleteCheckBoxValue'] = false;

    this.addDialogData['eventualScheduleId'] = parseInt(event.id);

    console.log(this.addDialogData);
    this.addDialogVisible = true;

  }
  //#endregion
  //////////////////////////////////////////////////

  //#region - Método para obtener el evento en el calendario
  async GetEventualSchedule() {

    await this.httpCrudService.getEventualSchedule().then(data => {
      console.log(data);
      if ((data !== null) && (data.error == null)) {
        this.events = data.map(item => {
          return {
            id: item.eventualScheduleId,
            title: item.eventualScheduleName,
            description: item.eventualScheduleDescription ? item.eventualScheduleDescription : '',
            eventClassName: item.eventClassName,
            eventClassId: item.eventClassId,
            equipmentId: item.equipmentId,
            start: item.startTime,
            end: item.endTime
          }
        });
      } else {
        //this.ShowUnAuthorizeToast(data);
      }

      this.calendarOptions.events = [...this.events]


    });
  }
  //#endregion
  //////////////////////////////////////////////

  async DisplayToastAndUpdateTable(data: any) {
    if (data !== null) {

      if (((data.deleteRecords !== 0) || (data.newRecords !== 0) || (data.updateRecords !== 0))) {
        await this.GetEventualSchedule();




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
  ////////////////////////////////////////


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
