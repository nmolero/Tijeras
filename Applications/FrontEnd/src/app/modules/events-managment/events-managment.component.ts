import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Renderer2, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS,MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS,} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MenuItem, MessageService, SelectItem, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { FilterService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { FilterMatchMode } from 'primeng/api';


  // #region Importar Animations
import { fadeInOnEnterAnimation,
         fadeOutOnLeaveAnimation,
         fadeOutUpOnLeaveAnimation,
         slideInDownOnEnterAnimation,
         slideOutDownOnLeaveAnimation,
         slideOutUpOnLeaveAnimation }
from 'angular-animations';
//#endregion

  // #region Importar Interfaces
import { IDropDownItems } from 'src/app/interfaces/components/dropdown';
//#endregion

  // #region Para el manejo de Servicios
import { ReportSnackBar } from '../../shared/components/report-snack-bar/report-snack-bar';
import { UserConfigurationData } from '../../services/user-configuration';
import { HttpService } from '../../services/http-general-service';
import { HttpCrudService } from '../../services/http-crud-service';
import { Table } from 'primeng/table';
import { DateErrorStateMatcher } from '../../services/error-state-matcher';
import { DateFormatter } from '../../services/date-formatter';
import { DatePickersValidation } from '../../services/datepickers-validation'
import { DateCalculations } from '../../services/date-calculations'
import { OverlayPanel } from 'primeng/overlaypanel';
import $ from "jquery";
import { ScrollPanel } from 'primeng/scrollpanel';
import { ContextMenu } from 'primeng/contextmenu';
import { actions, states } from 'src/app/constants/events.const';
import { inputTypes } from 'src/app/constants/crud.const';
import { DropdownItem } from 'primeng/dropdown';
// import { constants } from 'buffer';
import { Comment } from '@angular/compiler';
import { element } from 'protractor';



@Component({
  selector: 'app-events-managment',
  templateUrl: './events-managment.component.html',
  styleUrls: ['./events-managment.component.css'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation(),
    fadeOutUpOnLeaveAnimation(),
    slideInDownOnEnterAnimation(),
    slideOutUpOnLeaveAnimation(),
    slideOutDownOnLeaveAnimation()

  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    ConfirmationService, MessageService,
    MessageService, ReportSnackBar, UserConfigurationData, HttpService, HttpCrudService,
    DateErrorStateMatcher, DatePickersValidation, DateFormatter, DateCalculations, FilterService,
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class EventsManagmentComponent implements OnInit, AfterViewInit {

  constructor(
    private confirmationService: ConfirmationService, private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService, private dateFormatter: DateFormatter,
    private messageService: MessageService, private httpService: HttpService,
    private httpCrudService: HttpCrudService, private formBuilder: FormBuilder,
    private reportSnackBar: ReportSnackBar, private userDataService: UserConfigurationData,
    private datePickersValidation: DatePickersValidation, private dateCalculations: DateCalculations,
    private filterService: FilterService, private config: PrimeNGConfig
  ) {
    this.datePickersForms = this.formBuilder.group({
      'startDate': [''],
      'endDate': ['']
    }, { validator: this.HandleCheckDates });


    this.datePickersForms.setValue({
      startDate: this.startDateBegin,
      endDate: this.startDateEnd
    });
  }

  @ViewChild('dataTable') dataTable: Table;
  @ViewChildren('bodyTableRow', { read: ElementRef }) bodyTableRow: QueryList<ElementRef>;
  @ViewChild('actionContextMenu') actionContextMenu: ContextMenu;

  @ViewChild('paramReportOverlayPanel') paramReportOverlayPanel: OverlayPanel;
  @ViewChild('overlayPanel') overlayPanel: OverlayPanel;

  @ViewChildren('keyInputText', { read: ElementRef }) keyInputText: QueryList<ElementRef>;
  @ViewChildren('filterInputText', { read: ElementRef }) filterInputText: QueryList<ElementRef>;
  @ViewChildren('filterResetButton', { read: ElementRef }) filterResetButton: QueryList<ElementRef>;
  @ViewChildren('paramReportScrollPanel', { read: ElementRef }) paramReportScrollPanel: QueryList<ElementRef>;
  //#endregion

  // #region - BlockUI
  isLoadingResults = false;
  //#endregion

  // #region Panel
  headerTitleLabel: string = "Impactos en rendimiento metálicos";
  //#endregion

  // #region CSV
  exportFileName: string = "STA - Eventos";
  // #endregion

  // #region Table

  dataTableValues: any[] = []; //Los valores de la tabla de este array estarán vacío
  selectedRows: any = null; //Le digo que las filas seleccionadas será nulas
  filteredDataTableValues: any[] = []; //El filtrado estará vacío, y representado como array

  listOfColumns: any =//Este array es la estructura de la tabla, se hizo un array para guardar los datos
    [
      { field: 'beginDate', header: 'Fecha inicio', hidden: true, exportable: true },
      { field: 'endDate', header: 'Fecha fin', filterValue: '', hidden: false },
      { field: 'eventType', header: 'Material', filterValue: '', hidden: false },
      { field: 'duration', header: '% Rendimiento despunte', filterValue: 0, hidden: false },
      { field: 'equipment', header: '$ Rendimiento descole', filterValue: '', hidden: false },
      { field: 'area', header: 'Peso desunpute', filterValue: '', hidden: false },
      { field: 'shift', header: 'Peso descole', filterValue: '', hidden: false }
    ];
  //#endregion

  // #region DatePickers - para el formato de fecha
  datePickersForms: FormGroup;
  DatePickerErrormatcher = new DateErrorStateMatcher();

  startDateBegin = new Date();
  startDateEnd = this.startDateBegin;
  //#endregion

  // #region Filter DatePickers - para poder filtrar las fechas
  filterStartDate: Date = null; //Filtrar el comienzo de la fecha
  filterStartTime: Date = null; //Filtrar el final del tiempo
  filterEndDate: Date = null; //Filrar el final de la fecha
  filterEndTime: Date = null; //Filtrar el final del tiempo

  isFilterStartTimeDisabled: boolean = false; //Quiero que el tiempo inicial este disponible, por eso false
  isFilterEndTimeDisabled: boolean = false; //Lo mismo para este
  //#endregion

  //  #region Calendar - Start

  maxDate: Date = new Date();//Creo un objeto del objeto Date

  HandleCheckDates(group: FormGroup) {
    if (group.controls.endDate.value < group.controls.startDate.value) {
      return { endDateLessThanStartDate: true }
      // Creo una función definiendo como parametro group, instanciando la clase ForGroup
      // En la función if le digo que del parámetro group, seleccione los controles, con la fecha final el valor. A cambio de que sea
      // la fecha final sea menor que la fecha inicial
    }
    return null;
  }
  //#endregion

  // #region DropDowns - para el despliegue

  defaultLapseOfTimeOptions: IDropDownItems[] = [ //Opciones de lapso de tiempo por defecto
    //{ id: 0, code: 'noSelection', label: 'Intervalo' },
    { id: 1, code: 'lastMonth', label: 'Mes pasado' },
    { id: 2, code: 'actualMonth', label: 'Mes actual' },
    { id: 3, code: 'yesterday', label: 'Día anterior' },
    { id: 4, code: 'today', label: 'Día actual' },
    { id: 5, code: 'last8hs', label: 'Últimas 8hs' },
    { id: 6, code: 'last7Days', label: 'Últimos 7 días' },
    { id: 7, code: 'last30Days', label: 'Últimos 30 días' },
  ];
  // Le digo que seleccione el primer ID por un lapso de tiempo
  selectedDefaultLapseOfTime: IDropDownItems = this.defaultLapseOfTimeOptions[1];

  stateOptions: IDropDownItems[] = [];
  selectedState: IDropDownItems = null;

  areaOptions: IDropDownItems[] = [];
  selectedArea: IDropDownItems = null;

  equipmentOptions: IDropDownItems[] = [];
  selectedEquipment: IDropDownItems = null;

  eventTypeOptions: IDropDownItems[] = [];
  selectedEventType: IDropDownItems = null;

  shiftOptions: IDropDownItems[] = [];
  selectedShift: IDropDownItems = null;

  crewOptions: IDropDownItems[] = [];
  selectedCrew: IDropDownItems = null;
//#endregion

  // #region Button - para los botones
  // Creo variables booleanas
  isFilterButtonDisabled: boolean = false;
  isButtonsDisabled: boolean = false;
  isKeyConfirmButtonDisabled: boolean = false;
  isAddFilterConfigDisabled: boolean = false;
//#endregion

  //DataView

  dataViewValues: any[] = [  ];
  // Esto estaba dentro del array dataViewValues. Lo saqué afuera porque es mejor que el array esté vacío
  //     { id: 1, key: 'Filtro 1', public: false, isEditionMode: false, isActive: true },
  //     { id: 2, key: 'Filtro 2', public: true, isEditionMode: false, isActive: false },
  //     { id: 3, key: 'Filtro 3', public: false, isEditionMode: false, isActive: false },

  paramReportDataViewValues: any[] = [];

  reportParameter: string = ""

  //OverlayPanel

  isOverlayDisplay: boolean = false;
  isClickAnotherFilter: boolean = false;

  // #region Duración del filtro

  uomsDuration: any[] = [
    { label: 's', key: "seconds", constant: 1 },
    { label: 'min', key: "minutes", constant: 60 },
    { label: 'h', key: "hours", constant: 3600 }
  ];

  selectedDurationUOM: any = this.uomsDuration[1];

  durationSliderValue: number = 0;
//#endregion

  // #region Filtrado de culumnas;
  isDisplayCollumnFilters: boolean = false;
  matchModeOptions: SelectItem[];
  columnFilterStartDate: Date;
  //#endregion

  //Radio Button

  // activeFilter: string = this.dataViewValues[0].key;
  activeFilter: string = ''; //El filtro estará vacío

  // #region Context Menu - Estas son las acciones que va a ejercer dicho botón
  actionMenuItems: MenuItem[] = [
    {
      label: 'Declarar',
      disabled: false,
      visible: true,
      icon: 'pi pi-fw pi-check',
      command: (event) => {
      }
    },
    {
      label: 'Copiar declaración',
      disabled: false,
      visible: true,
      icon: 'pi pi-fw pi-copy',
      command: (event) => {
        this.declarationStorage = JSON.stringify(this.rightClickRowData);
        console.log(event, this.declarationStorage);
      }
    },
    {
      label: 'Pegar declaración',
      disabled: true,
      visible: true,
      icon: 'pi pi-fw pi-pencil',
      command: (event) => {
        // Falta hacer la declaración
       }
    },
  ];
  //#endregion

  // #region Los botones de la barra de herramientas
  toolBarButtons: any[] = [
    { name: actions.ADD, label: '', icon: 'pi pi-plus', disabled: false, toolTipText: 'Añadir evento', tooltipPosition: 'top', action: () => { } },
    { name: actions.DECLARE, label: '', icon: 'pi pi-external-link', disabled: true, toolTipText: 'Declarar evento', tooltipPosition: 'top', action: () => { } },
    { name: actions.DELETE, label: '', icon: 'pi pi-trash', disabled: true, toolTipText: 'Eliminar evento/s', tooltipPosition: 'top', action: this.HandleDeleteEvents.bind(this) },
    { name: actions.SPLIT, label: '', icon: 'fa fa-unlink', disabled: true, toolTipText: 'Dividir evento', tooltipPosition: 'top', action: () => { } },
    { name: actions.JOIN, label: '', icon: 'fa fa-link', disabled: true, toolTipText: 'Unir eventos', tooltipPosition: 'top', action: () => { } },
    { name: actions.COPY, label: '', icon: 'fa fa-copy', disabled: true, toolTipText: 'Copiar declaración', tooltipPosition: 'top', action: this.HandleCopyDeclaration.bind(this) },
    { name: actions.PASTE, label: '', icon: 'fa fa-paste', disabled: true, toolTipText: 'Pegar declaración', tooltipPosition: 'top', action: this.HandlePasteDeclaration.bind(this) },
    // En resumen:
          // Este array lo que hace es especificarle la accion que va a hacer con el name: actions(si te das cuenta los vas aencontrar en la carpeta constants/events.const.ts)
          // Luego los label estarán vacíos porque no tendrá descripción, sino mas bien un icon, después se le dirá si esta disponible o no. Con el toolTipText escribo el msj
          // y con el tooltipPosition, digo donde mostrar el msj.
          // Por último en action declaro el funcionamiento (lo recomendable es hacer el objeto a parte)
  ];
  //#endregion


  // #region Esta es la programación que cumplirá el funcionamiento de la vista en la tabla
  async ngOnInit() {

    //Menu Side Bar configuration
    this.storage.set('isPreviousPageLogin', false);

    this.matchModeOptions = [
      { label: 'Despues de', disabled: false, value: 'gte', icon: 'pi pi-calendar' },
      { label: 'Antes de', disabled: false, value: 'lte', icon: 'pi pi-calendar' }
    ];

    // this.isLoadingResults = true;

    await this.getUserTableProperty();//selecciono a obtener propiedades de usuario en la tabla

    const activeFilterIndex: number = this.dataViewValues.findIndex(item => item.active === true);

    let selectedDefaultLapseOfTime: any = null;//El lapzo de tiempo por defectos será nulo
    if (activeFilterIndex >= 0) {
      selectedDefaultLapseOfTime = JSON.parse(this.dataViewValues[activeFilterIndex].value).intervalFilter;
      // Digo que si el indice del filtro activo es mayor o igual a cero, entonces que el lapzo de tiempo sea igual a un JSON.parse
    }
//#endregion


  await this.getIntervalFilter(activeFilterIndex, selectedDefaultLapseOfTime);

  //#region Comentario para ser analizado luegos
    // let startDateEndArray = this.dateFormatter.DateArrayFormatter(this.startDateBegin);

    // let startDateBegin = new Date(startDateEndArray[2], startDateEndArray[1], 1);

    // //console.log(this.maxDate);

    // this.startDateBegin = startDateBegin;
    // this.filterStartTime = startDateBegin;


    // this.datePickersForms.setValue({
    //   startDate: startDateBegin,
    //   endDate: this.startDateEnd
    // });




    // await this.httpService.getPIWebAPI_ConsArch_P('datos').then(
    //   data => {
    //     console.log(data);
    //     if ((data !== null) && (data.error == null)) {

    //       [...this.dataTableValues] = data.items.map((item, index) => {

    //         const endDate: string = this.dateFormatter.ISODateSplitFormatter(item.endTime)
    //         let endDateYear: string = item.endTime;
    //         //console.log(endDateYear);

    //         if (endDate.split('-')[0] === '9999') {
    //           endDateYear = null
    //         } else {

    //         }
    //         return ({
    //           beginDate: item.startTime, endDate: endDateYear, id: index + 1
    //         });
    //       });
    //     }
    //     else {

    //       this.ShowUnAuthorizeToast(data);

    //     }
    //   }
    // );
    // await this.getEventSpecial(this.dateFormatter.IsoFormatter(startDateBegin), this.dateFormatter.IsoFormatter(this.startDateEnd));
    //#endregion

  this.isLoadingResults = false; //Si esto está en true, comentado o no puesto lo que pasará es que la página se estará recargando

  // #region Obtener y guardar el stado del filtro de la tabla
    this.setFilterState();
    setTimeout(() => {
      this.setColumnFilterResetButtonState(this.columnFilterinputText);
    }, 10);

    this.HandleOnFilter('');
    //console.log(this.columnFilterinputText);
  }
  //#endregion

  // #region Obtener el filtro de intervalo - este define un selec con las 5 opciones
  async getIntervalFilter(activeFilterIndex: number, selectedDefaultLapseOfTime: any) {

    let endDate = new Date();
    let beginDate = this.dateCalculations.getFirstDayOfMonth(endDate);
    let today = new Date();


    if (activeFilterIndex >= 0) {
      if (selectedDefaultLapseOfTime.id !== undefined) {

        switch (selectedDefaultLapseOfTime.code) {
          case 'lastMonth': //Último mes o mes pasado
            let lastMonth: Date = new Date();
            const actualMonth: number[] = this.dateFormatter.DateArrayFormatter(lastMonth);
            lastMonth = new Date(actualMonth[2], actualMonth[1] - 1, actualMonth[0]);
            beginDate = this.dateCalculations.getFirstDayOfMonth(lastMonth);
            endDate = this.dateCalculations.getLastDayOfMonth(lastMonth);
          break;

          //Mes actual
          case 'actualMonth':
            endDate = new Date();
            beginDate = this.dateCalculations.getFirstDayOfMonth(endDate);
            this.SetDatePickersValue(beginDate, endDate);
          break;

          // Ayer
          case 'yesterday':
            today = new Date();
            beginDate = this.dateCalculations.getYesterdayLapseOfTime(today)[0];
            endDate = this.dateCalculations.getYesterdayLapseOfTime(today)[1];
            //this.SetDatePickersValue(beginDate, endDate);
          break;

          // Hoy
          case 'today':
            today = new Date();
            beginDate = this.dateCalculations.getTodayLapseOfTime(today)[0];
            endDate = this.dateCalculations.getTodayLapseOfTime(today)[1];

            //this.SetDatePickersValue(beginDate, endDate);
          break;

          // Últimas ocho horas
          case 'last8hs':
            today = new Date();
            beginDate = this.dateCalculations.getLast8hs(today);
            endDate = today;
            //this.SetDatePickersValue(beginDate, endDate);
            break;

          // Últimos sietes días o semana anterior
          case 'last7Days':
            beginDate = this.dateCalculations.getlastDaysLapseOfTime(7)[0];
            endDate = this.dateCalculations.getlastDaysLapseOfTime(7)[1];
            //this.SetDatePickersValue(beginDate, endDate);
          break;

          // Últimos 30 días
          case 'last30Days':
            beginDate = this.dateCalculations.getlastDaysLapseOfTime(30)[0];
            endDate = this.dateCalculations.getlastDaysLapseOfTime(30)[1];

            //this.SetDatePickersValue(beginDate, endDate);
          break;

        }

        this.selectedDefaultLapseOfTime = selectedDefaultLapseOfTime;
      }
    }

    this.startDateBegin = beginDate;
    this.startDateEnd = endDate;

    this.filterStartTime = this.startDateBegin;


    await this.getEventSpecial(this.dateFormatter.IsoFormatter(beginDate), this.dateFormatter.IsoFormatter(endDate));

    this.dataTable.sortField = 'beginDate';
    this.dataTable.sortMode = 'single';
    this.dataTable.sortOrder = -1;
    this.dataTable.sortSingle();
  }
// #endregion

  // #region Colocar los filtros de estados
  setFilterState() {
    const keys: string[] = Object.getOwnPropertyNames(this.dataTable.filters);
    const filterState: any = this.dataTable.filters;

    // console.log(keys, filterState);

    this.ReApplyFilters(keys, filterState);
    ////////////////////////////////////////////////////////////

    //Get and Set Filter values
    this.columnFilterinputText = this.getFilterValues();

    //console.log(this.columnFilterinputText);

    keys.forEach(key => {

      if ((key !== 'durationSeconds') && (key !== 'state')) {
        const filter: number = this.columnFilterinputText.findIndex(item => item.id === key);
        this.columnFilterinputText[filter].value = filterState[key].value;
        //console.log(this.columnFilterinputText[filter].value);
      }

      if (key === 'state') {
        this.imgStateSource = filterState[key].value;
      }

      if (key === 'durationSeconds') {

        const filter: number = this.columnFilterinputText.findIndex(item => item.id === key);

        const activeFilter: any = this.dataViewValues.find(item => item.active === true);

        let constant: number = this.selectedDurationUOM.constant;

        if (activeFilter !== undefined) {

          const durationFilterUOM: any = JSON.parse(activeFilter.value).durationFilterUOM;
          this.selectedDurationUOM = durationFilterUOM;
          constant = durationFilterUOM.constant;
        }


        this.durationSliderValue = filterState[key].value / constant;

        //console.log(constant);

        this.columnFilterinputText[filter].value = filterState[key].value / constant;
        //this.dataTable.filter(filterState[key].value * constant, key, 'gte');

      }

    });

    if (keys.find(item => item === 'durationSeconds') === undefined) {
      const filter: number = this.columnFilterinputText.findIndex(item => item.id === 'durationSeconds');
      this.durationSliderValue = 0;
      this.selectedDurationUOM = this.uomsDuration[1];
      this.columnFilterinputText[filter].value = 0;
    }

    if (keys.find(item => item === 'state') === undefined) {
      this.imgStateSource = '';
    }
  }

  //#endregion

  columnFilterinputText: any[] = [{}];
  isColumnFilterButtonDisabled: any[] = [{}];

  // #region Obtener los valores de algo en un array
  getFilterValues(): any[] {

    let filterInputText: any[] = [{}];

    filterInputText = this.filterInputText.map(function (item, index) {
      return item.nativeElement;
    });

    //console.log(filterInputText);

    // return (
    //   filterInputText.map((item, index) => {
    //     return {
    //       value: item.value,
    //       column: item.id
    //     };
    //   }))

    return filterInputText;
  }
  // #endregion

  // #region - Este método es para restablecer el estado de filtrado de la columna
  setColumnFilterResetButtonState(filterInputText: any) {

    //console.log(filterInputText);
    let filterResetButton = this.filterResetButton.map(function (item, index) {
      return item.nativeElement;
    });

    filterResetButton.forEach(function (item, index) {

      if (filterInputText[index].id === 'durationSeconds') {
        if (filterInputText[index].value == 0) {
          item.disabled = true;

        } else {
          item.disabled = false;
        }
      } else {
        if (filterInputText[index].value === '') {
          item.disabled = true;

        } else {
          item.disabled = false;
        }
      }

    }.bind(this));

  }
//#endregion

  //#region - Este método es para actualizar los valores de la columna por filtro
  updateColumnFilterValues(e) {
    this.columnFilterinputText = this.getFilterValues();
  }
  //#endregion

  // #region - Este método se encargar de obtener los datos del dom de la fila de la tabla
  getTableRowDomData() {
    let bodyTableRow: any[] = [{}];


    // console.log(this.bodyTableRow);
    setTimeout(() => {
      bodyTableRow = this.bodyTableRow.map((item, index) => {
        return item.nativeElement;
      });
      //console.log(bodyTableRow);
    }, (2));

    //actionContextMenu.show($event); $event.stopPropagation()
  }
  //#endregion

  declareIndex: number = this.actionMenuItems.findIndex(item => item.label === 'Declarar');
  copyDeclaration: number = this.actionMenuItems.findIndex(item => item.label === 'Copiar declaración');
  pasteDeclaration: number = this.actionMenuItems.findIndex(item => item.label === 'Pegar declaración');

  declarationStorage: string = "";

  rightClickRowData: any = null;

  isRigthClickPressed: boolean = false;

  // #region - Este método es para el manejo del mouse de la fila hacia abajo
  HandleRowMouseDown(e, rowData) {
    //console.log(e, rowData);


    if (e.which === 3) {

      this.isRigthClickPressed = true;

      this.rightClickRowData = rowData;
      console.log(rowData);
      // if (rowData.state === states.NFINISHED) {

      //   this.actionMenuItems[this.declareIndex].disabled = true;
      // }
      // console.log(this.selectedRows.length);

      // if (this.selectedRows !== null) {
      //   if (this.selectedRows.length === 0) {

      //     this.actionMenuItems[this.pasteDeclaration].disabled = true;
      //   } else {
      //     this.actionMenuItems[this.pasteDeclaration].disabled = false;
      //   }
      // } else {
      //   this.actionMenuItems[this.pasteDeclaration].disabled = true;
      // }

      if (this.declarationStorage !== '') {

        if (this.selectedRows !== null) {

          if (this.selectedRows.length > 0) {
            console.log('si')
            this.actionMenuItems[this.pasteDeclaration].disabled = false;
          } else {
            console.log('no')
            this.actionMenuItems[this.pasteDeclaration].disabled = true;
          }

        }


      }


      // setTimeout(() => {
      //   this.actionContextMenu.show(e);
      //   e.stopPropagation();
      // }, 200);
    } else {
      this.isRigthClickPressed = false;
    }

  }
  //#endregion

  ngAfterViewInit() {

  }

  // #region - Este método es para manejar la selección de fila
  HandleRowSelect(e) {

    let copyButton: any = this.toolBarButtons.find(item => item.name === actions.COPY);
    let declareButton: any = this.toolBarButtons.find(item => item.name === actions.DECLARE);
    let splitButton: any = this.toolBarButtons.find(item => item.name === actions.SPLIT);
    let deleteButton: any = this.toolBarButtons.find(item => item.name === actions.DELETE);
    let joinButton: any = this.toolBarButtons.find(item => item.name === actions.JOIN);

    if (this.selectedRows.length === 1) {

      copyButton.disabled = false;
      splitButton.disabled = false;
      declareButton.disabled = false;

    } else {

      copyButton.disabled = true;
      splitButton.disabled = true;
      declareButton.disabled = true;
    }

    if (this.selectedRows.length >= 1) {
      deleteButton.disabled = false;
    }

    if (this.selectedRows.length === 0) {
      deleteButton.disabled = true;
    }

    if (this.selectedRows.length > 1) {
      joinButton.disabled = false;
    } else {
      joinButton.disabled = true;
    }

  }


  HandleRowUnSelect(e) {

    this.HandleRowSelect(e);

  }
  //#endregion

  // #region - Este método se encarga de gestionar la autenticación de selectores de flecha
  HandleDatePickersAuth(startDate, endDate) {

    this.isFilterButtonDisabled = this.datePickersValidation.HandleDatePickersAuth(startDate, endDate);

    if (this.isFilterButtonDisabled) {
      this.messageService.add({ key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Configuración de fechas inválida!' });
    }
  }
  //#endregion

  //#region - Este método maneja el botón del filtro de la fecha
  async HandleFilterDateButton(startDate, endDate) {

    //console.log(startDate, endDate);
    this.isLoadingResults = true;

    // let startDateIso: string = this.dateFormatter.StringIsoFormatter(startDate);
    // let endDateIso: string = this.dateFormatter.StringIsoFormatter(endDate);

    let startDateIso: string = this.dateFormatter.IsoFormatter(this.startDateBegin);
    let endDateIso: string = this.dateFormatter.IsoFormatter(this.startDateEnd);

    console.log(startDateIso, endDateIso);
    console.log(this.dataTable.filters);
    console.log(this.dataTable.filteredValue);

    this.filterStartTime = this.startDateBegin;

    //console.log(endDateIso);
    //localStorage.setItem('metTestBeginDate', startDate);
    //localStorage.setItem('metTestEndDate', endDate);

    await this.getEventSpecial(startDateIso, endDateIso);

    //Reset Table Filtered values if there is no filters actives.
    if (Object.getOwnPropertyNames(this.dataTable.filters).length === 0) {
      this.dataTable.filteredValue = this.dataTableValues;
    }

    this.dataTable.sortField = 'beginDate';
    this.dataTable.sortMode = 'single';
    this.dataTable.sortOrder = -1;
    this.dataTable.sortSingle();

    this.isLoadingResults = false;

  }
  //#endregion

  //#region - Este método maneja el cambio de lapso de tiempo por defecto
  async HandleChangeDefaultLapseOfTime() {

    this.isLoadingResults = true;

    let beginDate: Date;
    let endDate: Date;
    let today: Date;

    switch (this.selectedDefaultLapseOfTime.code) {
      case 'lastMonth':

        let lastMonth: Date = new Date();

        const actualMonth: number[] = this.dateFormatter.DateArrayFormatter(lastMonth);

        lastMonth = new Date(actualMonth[2], actualMonth[1] - 1, actualMonth[0]);

        beginDate = this.dateCalculations.getFirstDayOfMonth(lastMonth);
        endDate = this.dateCalculations.getLastDayOfMonth(lastMonth);

        //console.log(beginDate, endDate);


        //this.SetDatePickersValue(beginDate, endDate);

        break;
      case 'actualMonth':

        endDate = new Date();
        beginDate = this.dateCalculations.getFirstDayOfMonth(endDate);


        //this.SetDatePickersValue(beginDate, endDate);

        break;
      case 'yesterday':

        today = new Date();
        beginDate = this.dateCalculations.getYesterdayLapseOfTime(today)[0];
        endDate = this.dateCalculations.getYesterdayLapseOfTime(today)[1];

        //this.SetDatePickersValue(beginDate, endDate);
        break;
      case 'today':
        today = new Date();
        beginDate = this.dateCalculations.getTodayLapseOfTime(today)[0];
        endDate = this.dateCalculations.getTodayLapseOfTime(today)[1];

        //this.SetDatePickersValue(beginDate, endDate);
        break;
      case 'last8hs':
        today = new Date();

        beginDate = this.dateCalculations.getLast8hs(today);
        endDate = today;

        //this.SetDatePickersValue(beginDate, endDate);
        break;

      case 'last7Days':

        beginDate = this.dateCalculations.getlastDaysLapseOfTime(7)[0];
        endDate = this.dateCalculations.getlastDaysLapseOfTime(7)[1];

        //this.SetDatePickersValue(beginDate, endDate);

        break;
      case 'last30Days':
        beginDate = this.dateCalculations.getlastDaysLapseOfTime(30)[0];
        endDate = this.dateCalculations.getlastDaysLapseOfTime(30)[1];

        //this.SetDatePickersValue(beginDate, endDate);
        break;

    }


    this.startDateBegin = beginDate;
    this.startDateEnd = endDate;

    this.filterStartTime = this.startDateBegin;

    await this.getEventSpecial(this.dateFormatter.IsoFormatter(beginDate), this.dateFormatter.IsoFormatter(endDate));

    this.dataTable.sortField = 'beginDate';
    this.dataTable.sortMode = 'single';
    this.dataTable.sortOrder = -1;
    this.dataTable.sortSingle();


    this.isLoadingResults = false;


  }


  SetDatePickersValue(beginDate, endDate) {
    this.datePickersForms.setValue({
      startDate: beginDate,
      endDate: endDate
    });
  }
  //#endregion

  // #region - Falta hacer este método sobre el filtrado en la configuración del botón
  HandleFilterConfigurationButton() {
  }
  //#endregion

  // #region - Este método es sobre el manejo de editar un item
  HandleEditItem(dataValue, rowIdex) {

    //console.log(rowIdex);
    this.dataViewValues.find(item => {
      return item.id === dataValue.id;
    }).isEditionMode = true;



    let keyInputText: any[] = [{}];

    setTimeout(() => {

      //document.getElementById('keyInputText' + rowIdex).focus();

      keyInputText = this.keyInputText.map(function (cell, index) {
        return cell.nativeElement;
      });

      //console.log(keyInputText);

      keyInputText.forEach((item) => {
        if (item.id === ('keyInputText' + rowIdex)) {
          item.focus();
        }
      });

      this.isButtonsDisabled = true;
      this.isAddFilterConfigDisabled = true;

    }, 25)

  }
  //#endregion

  // #region - Este método es sobre el manejo de eliminar item
  async HandleDeleteItem(dataValue) {

    const dataValueRow: number = this.dataViewValues.findIndex(item => {
      return item.id === dataValue.id;
    });

    const data: number[] = [dataValue.id]

    await this.httpService.postDeleteUserTablePropertyValue(data).then(
      data => {
        console.log(data);

        this.DisplayToastAndUpdateTable(data);
      }
    );

    if (!this.isHttpError) {
      this.dataViewValues.splice(dataValueRow, 1);

      this.dataViewValues = [...this.dataViewValues];
    }


  }
  //#endregion

  // #region - Este método es sobre el manejo de agregar el articulo
  async HandleAddItem() {
    //console.log(this.dataTable.filters);

    const data: any = {
      userId: this.userDataService.userData.userId,
      value: JSON.stringify(
        {
          intervalFilter: this.selectedDefaultLapseOfTime,
          tableFilters: this.dataTable.filters,
          durationFilterUOM: this.selectedDurationUOM
        }),
      tablePropertyName: 'Event Filter',
      tablePropertyValueDescription: 'Nuevo Filtro'
    }

    await this.httpService.postAddUserTablePropertyValueClass(data).then(
      data => {
        console.log(data);
        this.DisplayToastAndUpdateTable(data);
      }
    );

    if (!this.isHttpError) {
      await this.getUserTableProperty();
    }
  }
  //#endregion

  // #region - Este método se encarga de manejar la entrada clave
  HandleKeyInput(e, dataValue) {

    if (e.key === "Escape") {

      this.isButtonsDisabled = false;
      this.isAddFilterConfigDisabled = false;

      this.dataViewValues.find(item => {
        return item.id === dataValue.id;
      }).isEditionMode = false;

    }

    if (this.dataViewValues.find(item => {
      return item.id === dataValue.id;
    }).key.length < 1) {
      this.isKeyConfirmButtonDisabled = true;
    }
    else {
      this.isKeyConfirmButtonDisabled = false;
    }

  }
  //#endregion

  // #region - Este método manejar el cancelar de editar
  HandleCancelEdit(dataValue) {

    this.isButtonsDisabled = false;
    this.isAddFilterConfigDisabled = false;

    this.dataViewValues.find(item => {
      return item.id === dataValue.id;
    }).isEditionMode = false;
  }
  //#endregion

  // #region - Este método es para no autorizarle
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
  //#endregion

  // #region - Este método se encargar de obtener un evento en especial
  async getEventSpecial(startDate: string, endDate: string) {
    await this.httpService.getEventSpecial(startDate, endDate).then(
      data => {
        console.log(data);
        if ((data !== null) && (data.error == null)) {

          //this.totalReports = data.length;

          this.dataTableValues = data.map((item, index) => {

            const endDate: string = this.dateFormatter.ISODateSplitFormatter(item.endTime)
            let endDateYear: string = item.endTime;
            //console.log(endDateYear);
            let durationFormat: string = '-';
            if (item.duration) {
              durationFormat = this.dateCalculations.getHourTimeBySeconds(item.duration);
            }


            let state: string = "";

            if (item.eventClassName !== 'NO DECLARADO' && endDate.split('-')[0] === '9999') {
              endDateYear = null;
              state = states.DECLARED;
            } else {
              if ((endDate.split('-')[0] === '9999')) {
					endDateYear = null;
					state = states.NFINISHED;
              } else {
				if((item.eventClassName === 'NO DECLARADO')) {
					state = states.NDECLARED;
				}else{
					state =states.DECLARED;
				}
              }

            }

            //const eventClassType: string = item.name ? item.name.split('>')[0] : '';
            const eventClassType: string = item.eventClassTypeName;
            const startDate: Date = this.dateFormatter.ISODateObjectFormatter(item.startTime)
            //console.log(startDate);
            return ({
              beginDate: item.startTime,
              endDate: endDateYear,
              id: item.eventId,
              duration: durationFormat,
              durationSeconds: item.duration ? item.duration : 0,
              area: item.areaName ? item.areaName : '',
              eventCondition: item.eventCondition,
              // eventType: item.eventTypeName ? item.eventTypeName : '-',
              eventType: eventClassType,
              equipment: item.equipmentName ? item.equipmentName : '-',
              state: state,
              eventTypeName: item.eventTypeName,
              eventClassId: item.eventClassId,
              eventClassName: item.eventClassName,
              shift:item.shiftName,
              crew:item.crewName,
              comments: item.comments,
              mainElement: item.mainElementName,
              mainElementId: item.mainElementId
            });
          });

          this.dataTableValues = [...this.dataTableValues];
          this.filteredDataTableValues = this.dataTableValues;
          if (this.dataTableValues.length === 0) {
            //this.dataTable.filteredValue = [];
            //this.dataTableValues = [...this.dataTableValues];
            this.dataTable.reset();
          }
        }
        else {

          this.ShowUnAuthorizeToast(data);

        }
      }

    );

    // this.dataTableValues = [
    //   { beginDate: '2021-01-01T12:11:02', endDate: '2021-01-02T14:11:02', id: new Date().getTime(), }
    // ]

  }
  //#endregion

  // #region - Este método se encargar de manejar la duración del filtro
  HandleDurationFilter(event, field) {
    console.log(event);
    // if (event.value === 0) {
    //   this.dataTable.filteredValue = this.dataTableValues;
    //   this.filteredDataTableValues = this.dataTableValues;
    // } else {
    //   this.dataTable.filter(event.value * constant, 'durationSeconds', 'gte')
    // }
    const constant: number = this.selectedDurationUOM.constant;
    this.dataTable.filter(event.value * constant, field, 'gte');

    //this.dataTable.filter()
    //this.dataTable.filteredValue
  }
  //#endregion

  // #region - Este método se encargar de manejar un cambio de duración UOM
  HandleChangeDurationUOM(field) {

    let index: number = this.uomsDuration.findIndex(item => {
      return item.label === this.selectedDurationUOM.label;
    });

    if ((index + 1) === this.uomsDuration.length) {
      index = 0;
    } else {
      index += 1;
    }

    this.selectedDurationUOM = this.uomsDuration[index];

    const duration: any = this.listOfColumns.find(item => {
      return item.field === "duration";
    });

    const filterEvent: any = {
      value: this.durationSliderValue
    }

    this.HandleDurationFilter(filterEvent, field);

  }
  //#endregion

  //#region - Este método se encarga de mostrar informe de parámetros
  async showParamReportOP(event, header, field) {
    //console.log(event);
    event.preventDefault();
    event.stopPropagation();
    this.reportParameter = header;

    let paramValues: string[] = [];

    this.filteredDataTableValues.forEach(
      function (element) {
        paramValues.push(element[field]);
      }
    );

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    const uniqueValues: string[] = paramValues.filter(onlyUnique);

    //console.log(uniqueValues);

    const dataViewValues: any[] = uniqueValues.map(item => {

      const dataTablesValuesFiltered: any[] = this.filteredDataTableValues.filter(row => {
        return row[field] === item;
      });

      //console.log(dataTablesValuesFiltered);
      return ({
        field: field,
        label: item,
        quantity: dataTablesValuesFiltered.length
      });

    })


    let paramReportScrollPanel: any[] = [{}];


    if (!this.isOverlayDisplay) {
      this.isClickAnotherFilter = false;

      if (this.paramReportOverlayPanel.target === null || this.paramReportOverlayPanel.target === undefined) {

        this.paramReportDataViewValues = [...dataViewValues];


        this.paramReportOverlayPanel.show(event);


      }
      this.isOverlayDisplay = true;

      this.setScrollPanelHeight(paramReportScrollPanel);

    } else {

      this.isClickAnotherFilter = true;
      this.paramReportOverlayPanel.hide();

      // if (this.paramReportOverlayPanel.target === null || this.paramReportOverlayPanel.target === undefined) {
      //   this.isOverlayDisplay = true;
      //   this.paramReportOverlayPanel.show(event);
      // }
      setTimeout(() => {

        this.paramReportDataViewValues = [...dataViewValues];
        this.paramReportOverlayPanel.show(event);

        this.setScrollPanelHeight(paramReportScrollPanel);




      }, 150);

    }

    // this.paramReportDataViewValues = [
    //   { label: '1', quantity: 10 },
    //   { label: '1', quantity: 10 },
    //   { label: '1', quantity: 10 },
    //   { label: '1', quantity: 10 },
    //   { label: '1', quantity: 10 },
    //   { label: '1', quantity: 10 },
    //   { label: '1', quantity: 10 },
    //   { label: '1', quantity: 10 },
    //   { label: '1', quantity: 10 },
    //   { label: '1', quantity: 10 },
    //   { label: '1', quantity: 10 },
    //   { label: '1', quantity: 10 }
    // ];

  }
  //#endregion

  //#region - Este método se encarga de establecer la altura del panel de desplazamiento
  setScrollPanelHeight(paramReportScrollPanel: any) {
    setTimeout(() => {
      paramReportScrollPanel = this.paramReportScrollPanel.map(function (item, index) {
        return item.nativeElement;
      });

      let length: number = 0;
      if (this.paramReportDataViewValues.length === 0) {
        length = 1;
      } else {
        length = this.paramReportDataViewValues.length;
      }

      const PxRemConst: number = 42.61 / 16;
      let dynamicHeight: number = PxRemConst * length * 1.5;

      if (dynamicHeight >= 26) {
        dynamicHeight = 26;
      }
      const scrollpanelHeight: string = dynamicHeight.toString() + 'rem';


      paramReportScrollPanel[0].firstChild.style.height = scrollpanelHeight;


      console.log(length, PxRemConst, dynamicHeight, scrollpanelHeight);
      //console.log(paramReportScrollPanel[0]);
    }, 20);
  }
  //#endregion

  // #region - Este método oculta el informe de parámetros
  hideParamReportOP(event) {
    //console.log(event)
    event.preventDefault();
    event.stopPropagation();
    if (this.isOverlayDisplay) {
      this.isOverlayDisplay = false;
      this.paramReportOverlayPanel.hide();
    }
  }
  //#endregion

  //#region - Este método se encarga de ocultar informe de parámtros
  onHideParamReportOP() {
    if (!this.isClickAnotherFilter) {
      this.isOverlayDisplay = false;
    }

  }
  //#endregion

  imgStateSource: string = "";

  //#region - Este método hacer el informe de filtro de parámetros
  HandleReportParamFilter(value, field) {

    console.log(value, field);
    // console.log(this.dataTable);
    if (field === 'state') {
      this.dataTable.filter(value, field, 'equals');
    } else {
      this.dataTable.filter(value, field, 'contains');
    }

    this.isOverlayDisplay = false;
    this.paramReportOverlayPanel.hide();

    setTimeout(() => {
      this.columnFilterinputText = this.getFilterValues();
      if (field === 'state') {
        this.imgStateSource = value;
      } else {
        this.imgStateSource = '';
      }

      //console.log(this.columnFilterinputText);

      this.setColumnFilterResetButtonState(this.columnFilterinputText);
    }, 20);
  }
  //#endregion

  //#region - Este método es para seleccionar el inicio de la fecha
  HandleSelectStartDate(e) {
    //console.log(e);
    //console.log(this.filterStartDate, this.filterStartTime)

    if ((this.filterStartTime !== null)) {

      this.ApplyDateTimeFilter('beginDate', this.filterStartTime);

    } else {

      delete this.dataTable.filters['beginDate'];
      const keys: string[] = Object.getOwnPropertyNames(this.dataTable.filters)
      //console.log(keys);

      //console.log(this.dataTable.filters);
      const filterState: any = this.dataTable.filters;

      this.ReApplyFilters(keys, filterState);
    }

    // if ((this.filterStartDate !== null) && (this.filterStartTime !== null)) {

    //   this.ApplyStartDateTimeFilter();


    // } else {

    //   if ((this.filterStartTime === null) && (this.isFilterStartTimeDisabled)) {
    //     this.isFilterStartTimeDisabled = false;

    //     this.filterStartTime = new Date(2021, 0, 1, 0, 0, 0);

    //     this.ApplyStartDateTimeFilter();

    //   } else {

    //     delete this.dataTable.filters['beginDate'];
    //     const keys: string[] = Object.getOwnPropertyNames(this.dataTable.filters)
    //     //console.log(keys);

    //     //console.log(this.dataTable.filters);
    //     const filterState: any = this.dataTable.filters;

    //     this.ReApplyFilters(keys, filterState);
    //   }



    // }

  }
  //#endregion

  //#region - Este método es para seleccionar la fecha final
  HandleSelectEndDate(e) {

    //console.log(e);
    //console.log(this.filterEndDate, this.filterEndTime)

    if ((this.filterEndTime !== null)) {

      this.ApplyDateTimeFilter('endDate', this.filterEndTime);

    } else {

      delete this.dataTable.filters['endDate'];
      const keys: string[] = Object.getOwnPropertyNames(this.dataTable.filters)
      //console.log(keys);

      //console.log(this.dataTable.filters);
      const filterState: any = this.dataTable.filters;

      this.ReApplyFilters(keys, filterState);
    }

    // if ((this.filterEndDate !== null) && (this.filterEndTime !== null)) {


    //   this.ApplyEndDateTimeFilter();

    // } else {

    //   if ((this.filterEndTime === null) && (this.isFilterEndTimeDisabled)) {
    //     this.isFilterEndTimeDisabled = false;
    //     this.filterEndTime = new Date(2020, 0, 1, 0, 0, 0);
    //     this.ApplyEndDateTimeFilter();
    //   } else {
    //     delete this.dataTable.filters['endDate'];
    //     const keys: string[] = Object.getOwnPropertyNames(this.dataTable.filters)
    //     //console.log(keys);

    //     //console.log(this.dataTable.filters);
    //     const filterState: any = this.dataTable.filters;

    //     this.ReApplyFilters(keys, filterState);
    //   }
    // }

  }
  //#endregion

  //#region - Este método es para aplicar el filtro del tiempo de la fecha
  ApplyDateTimeFilter(dateTimeFilter: string, date: Date) {

    // const filterStartDateISO: string = this.dateFormatter.IsoFormatter(this.filterStartDate);
    // const filterStartTimeISO: string = this.dateFormatter.IsoFormatter(this.filterStartTime);

    // const filterStartDate: string = this.dateFormatter.ISODateSplitFormatter(filterStartDateISO);
    // const filterStartTime: string = this.dateFormatter.ISOTimeSplitFormatter(filterStartTimeISO);



    // const filterDate: string = filterStartDate + 'T' + filterStartTime;

    const filterTimeISO: string = this.dateFormatter.IsoFormatter(date);

    //console.log(filterDate);
    if (dateTimeFilter === 'beginDate') {


      this.dataTable.filter(filterTimeISO, dateTimeFilter, 'gte');
    }
    if (dateTimeFilter === 'endDate') {
      this.dataTable.filter(filterTimeISO, dateTimeFilter, 'lte');
    }
  }
  //#endregion

  //#region - Este método es para aplicar el tiempo de fecha final en el filtro
  ApplyEndDateTimeFilter() {


    const filterEndDateISO: string = this.dateFormatter.IsoFormatter(this.filterEndDate);
    const filterEndTimeISO: string = this.dateFormatter.IsoFormatter(this.filterEndTime);

    const filterEndDate: string = this.dateFormatter.ISODateSplitFormatter(filterEndDateISO);
    const filterEndTime: string = this.dateFormatter.ISOTimeSplitFormatter(filterEndTimeISO);

    const filterDate: string = filterEndDate + 'T' + filterEndTime;
    //console.log(filterDate);
    //console.log(this.dataTable.filters);

    this.dataTable.filter(filterDate, 'endDate', 'lte');

  }
  ReApplyFilters(keys: string[], state: any) {

    //this.dataTable.reset();
    if (keys.length > 0) {
      this.dataTable.filters = {};
      //console.log(state);

      keys.forEach(key => {
        this.dataTable.filter(state[key].value, key, state[key].matchMode);
      });
    } else {
      this.dataTable.filteredValue = this.dataTableValues;
      this.dataTable.totalRecords = this.dataTableValues.length;
    }
  }
  //#endregion

  //#region - Este método es para restablecer el filtro de la columna
  HandleResetColumnFilter(column) {
    //console.log(column, this.dataTable.filters[column.field]['value']);

    //console.log(this.dataTable.filteredValue);
    let durationColumn: string = "";

    if (column.field === 'duration') {
      durationColumn = 'durationSeconds';
      delete this.dataTable.filters[durationColumn];
      const filter: number = this.columnFilterinputText.findIndex(item => item.id === 'durationSeconds');
      this.durationSliderValue = 0;
      this.selectedDurationUOM = this.uomsDuration[1];
      this.columnFilterinputText[filter].value = 0;
    }
    //console.log(column);
    delete this.dataTable.filters[column.field];
    const keys: string[] = Object.getOwnPropertyNames(this.dataTable.filters);
    const filterState: any = this.dataTable.filters;

    this.ReApplyFilters(keys, filterState);

    setTimeout(() => {
      this.columnFilterinputText = this.getFilterValues();
      //console.log(this.columnFilterinputText);

      this.setColumnFilterResetButtonState(this.columnFilterinputText);

      //this.HandleOnFilter('e');
      //console.log(this.dataTable.filters);

      const keys: string[] = Object.getOwnPropertyNames(this.dataTable.filters);

      const durationKey: any = keys.find(item => item === 'durationSeconds')

      //console.log(keys);
      if (keys.length === 0) {
        this.filteredDataTableValues = this.dataTableValues;
      }
      if ((durationKey !== undefined) && (this.dataTable.filters['durationSeconds']['value'] === 0)) {
        this.filteredDataTableValues = this.dataTableValues;
      }
    }, 20);
  }
  //#endregion

  //#region - Este método es para manejar el filtrado
  HandleOnFilter(event) {

    //this.totalReports = this.metallographicTestListTable.filteredValue.length;

    //console.log(event);

    if ((this.dataTable.filteredValue != null) && (this.dataTable.filteredValue != undefined)) {
      if (this.dataTable.filteredValue.length > 0) {
        this.filteredDataTableValues = this.dataTable.filteredValue;
      }
      else {
        this.filteredDataTableValues = this.dataTableValues;
      }
    }


  }
  //#endregion

  // #region - Este método es para resolver la validación en el/los calendario/s
  HandleCalendarsValidation() {

    if ((this.startDateBegin === null) || (this.startDateEnd === null)) {
      this.isFilterButtonDisabled = true;
    } else {
      this.isFilterButtonDisabled = false;
    }

  }
  // #endregion

  // #region - Este método es para mostrar la columna al hacer click en el botón
  HandleShowColumnButtonClick() {
    this.isDisplayCollumnFilters = !this.isDisplayCollumnFilters;
    //console.log(this.isDisplayCollumnFilters);
    if (this.isDisplayCollumnFilters) {
      $(".filterTablerow").hide();
      $(".filterTablerow").each(function (index) {
        $(this).show(500);
      });


    } else {
      $(".filterTablerow").delay(50).hide(350);
      //$("#filterTr2").delay(50).hide(350);
    }

  }
  //#endregion

  // #region - Este método es para seleccionar la columna al hacer filtro por fecha
  HandleSelectColumnFilterDate() {
    //console.log(this.columnFilterStartDate);
    this.dataTable.filter(this.columnFilterStartDate, 'beginDate', 'gte');
  }
  // #endregion

  //#region - Este método es para el doble click al seleccionar cada fila en la tabla
  async HandleDoubleClickRow(e, rowData) {
    //console.log(rowData);
	this.selectedRows = [];
	this.selectedRows = [rowData, ...this.selectedRows];
	await this.HandleClickEventActionToolbar("DECLARE-EVENT");
  }
  //#endregion

  // #region - Este método asincrono son para hacer click en el radio button
  async HandleRadioButtonClick(e) {
    //console.log(e);

    const activeFilterIndex: number = this.dataViewValues.findIndex(item => item.name === this.activeFilter);
    this.dataViewValues[activeFilterIndex].active = true;

    this.dataViewValues.forEach((item, index) => {
      if (index !== activeFilterIndex) {
        this.dataViewValues[index].active = false;
      }
    });

    const activeFilter: any = this.dataViewValues.find(item => item.name === this.activeFilter);

    //console.log(activeFilter);
    if (activeFilter !== undefined) {

      await this.postUpdateUserTablePropertyValue(activeFilter);
    }
    console.log(JSON.parse(this.dataViewValues[activeFilterIndex].value));

    const selectedDefaultLapseOfTime: any = JSON.parse(this.dataViewValues[activeFilterIndex].value).intervalFilter;

    await this.getIntervalFilter(activeFilterIndex, selectedDefaultLapseOfTime);

    this.dataTable.filters = JSON.parse(this.dataViewValues[activeFilterIndex].value).tableFilters;

    this.selectedDurationUOM = JSON.parse(this.dataViewValues[activeFilterIndex].value).durationFilterUOM ? JSON.parse(this.dataViewValues[activeFilterIndex].value).durationFilterUOM : this.selectedDurationUOM;


    //Get and Saved Filters Table State
    this.setFilterState();
    setTimeout(() => {
      this.setColumnFilterResetButtonState(this.columnFilterinputText);
      this.HandleOnFilter('');
    }, 15);

    //console.log(this.columnFilterinputText);
    ////////////////////////////////////////////////////////////
    this.overlayPanel.hide();

  }
  //#endregion

  // #region - Este método asincrono es para confirmar el nombre al hacer el filtro
  async HandleConfirmFilterName(dataValue: any) {

    //console.log(dataValue);
    const selectedFilter: any = this.dataViewValues.find(item => item.name === dataValue.name);
    await this.postUpdateUserTablePropertyValue(selectedFilter);

    this.isButtonsDisabled = false;
    this.isAddFilterConfigDisabled = false;

    this.dataViewValues.find(item => {
      return item.id === dataValue.id;
    }).isEditionMode = false;
  }
  //#endregion

  // #region - Este método asincrono es para actualizar los valores de la propiedad del usuario de la tabla
  async postUpdateUserTablePropertyValue(activeFilter: any) {

    const data: any = {
      userTablePropertyValueId: activeFilter.id,
      userId: this.userDataService.userData.userId,
      isActive: activeFilter.active,
      isPublic: activeFilter.public,
      tablePropertyValueDescription: activeFilter.key,
      tablePropertyValueName: activeFilter.name,
      tablePropertyValueId: activeFilter.tablePropertyValueId
    };

    //console.log(activeFilter);
    //console.log(data);

    await this.httpService.postUpdateUserTablePropertyValue(data).then(
      data => {
        console.log(data);
      }
    );

  }
  //#endregion

  isHttpError: boolean = false;

  //#region - Este método asincrono es para mostrar y actualizar datos en la tabla
  async DisplayToastAndUpdateTable(data: any) {
    if (data !== null) {
      if (data.deleteRecords !== undefined) {
        if (((data.deleteRecords !== 0) || (data.newRecords !== 0) || (data.updateRecords !== 0))
          && (data.deleteRecords !== -1)) {

          //await this.getTablesData();


          this.isLoadingResults = false;

          this.messageService.add({
            life: 6000, key: 'operationStatusInfo',
            severity: 'success', summary: 'Completado',
            detail: 'Se han actualizado los datos correctamente'
          });
          this.isHttpError = false;

        } else {

          this.isLoadingResults = false;
          // if (data === 0) {
          //   this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
          // }

          if (data.deleteRecords === -1) {
            this.messageService.add({
              life: 6000, key: 'operationStatusInfo',
              severity: 'error', summary: 'Error',
              detail: 'No se ha completado la operación. Filtro está activo!'
            });

          } else {
            this.ShowUnAuthorizeToast(data);
          }

          this.isHttpError = true;

        }
      } else {
        this.isHttpError = true;
        this.isLoadingResults = false;
        this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
      }



    } else {
      this.isLoadingResults = false;
      this.isHttpError = true;
      this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
    }



  }
  //#endregion

  tableFilterState: any = null; //El estado de filtrado en la tabla lo declaro vacío

  // #region - Este método asincrono es para obtener la propiedad deol usuario en la tabla

  async getUserTableProperty() {
    await this.httpService.getUserTableProperty(this.userDataService.userData.userId, 'Event Filter').then(
      data => {
        if ((data !== null) && (data.error == null)) {



          //console.log(data);
          this.dataViewValues = data.map(item => {
            return {
              id: item.userTablePropertyValueId,
              tablePropertyValueId: item.tablePropertyValueId,
              name: item.tablePropertyValueName,
              key: item.tablePropertyValueDescription,
              public: item.isPublic,
              active: item.isActive,
              isEditionMode: false,
              value: item.value
            }
          });

          const activeFilter: any = this.dataViewValues.find(item => item.active === true);

          //console.log(activeFilter);

          if (activeFilter !== undefined) {
            this.activeFilter = activeFilter.name;
            this.tableFilterState = JSON.parse(activeFilter.value).tableFilters;

            //console.log(this.tableFilterState);
            this.dataTable.filters = this.tableFilterState;
          }

          //console.log(this.dataTable.filters);
        }

      }
    );

    //console.log(this.dataViewValues);
  }
  //#endregion

  // #region - Este método asincrono es para guardar el filtrado
  async HandleSaveFilterState() {

    const activeFilterIndex: number = this.dataViewValues.findIndex(item => item.name === this.activeFilter);

    this.dataViewValues[activeFilterIndex].value = JSON.stringify({
      intervalFilter: this.selectedDefaultLapseOfTime,
      tableFilters: this.dataTable.filters,
      durationFilterUOM: this.selectedDurationUOM
    });
    console.log(this.dataViewValues[activeFilterIndex]);

    const data: any = {
      userTablePropertyValueId: this.dataViewValues[activeFilterIndex].id,
      userId: this.userDataService.userData.userId,
      isActive: this.dataViewValues[activeFilterIndex].active,
      isPublic: this.dataViewValues[activeFilterIndex].public,
      tablePropertyValueDescription: this.dataViewValues[activeFilterIndex].key,
      tablePropertyValueName: this.dataViewValues[activeFilterIndex].name,
      tablePropertyValueId: this.dataViewValues[activeFilterIndex].tablePropertyValueId,
      value: JSON.stringify(
        {
          intervalFilter: this.selectedDefaultLapseOfTime,
          tableFilters: this.dataTable.filters,
          durationFilterUOM: this.selectedDurationUOM
        })
    };

    //console.log(activeFilter);
    //console.log(data);

    await this.httpService.postUpdateUserTablePropertyValue(data).then(
      data => {
        console.log(data);
        this.DisplayToastAndUpdateTable(data);
      }
    );

    // if (!this.isHttpError)

  }
  //#endregion

  // #region - Este método es para restablecer los valores en el filtrado
  HandleResetTableFilters() {
    this.dataTable.filters = {};
    this.dataTable.filteredValue = this.dataTableValues;

    this.columnFilterinputText.forEach(item => {
      if (item.id === 'durationSeconds') {
        item.value = 0;
        this.durationSliderValue = 0;
        this.imgStateSource = '';
      } else {
        item.value = '';
      }
    });

    this.filterStartTime = this.startDateBegin;
    this.filterEndTime = null;

    console.log(this.columnFilterinputText);

    this.setColumnFilterResetButtonState(this.columnFilterinputText);
  }
  // #endregion

  // #region - Este método asincrono es para cuando se hace click en algún evento de la barra de herramientas
  async HandleClickEventActionToolbar(id) {

    //console.log(id);
    if (this.selectedRows !== null) {

    }

    let eventClassType: DropdownItem[] = [];
    let equipmentTreeNode: any[] = [];
    let eventClassTreeNode: any[] = [];

    if ((id !== actions.DELETE) && (id !== actions.COPY) && (id !== actions.PASTE)) {
      this.isLoadingResults = true;

      await this.httpCrudService.getEquipmentByType('MAQ').then(
        data => {
          //console.log(data);
          if (data !== null) {
            this.equipmentOptions = data;
          }
        }
      );

      await this.httpCrudService.getEquipmentByType('AREA').then(
        data => {
          //console.log(data);
          if (data !== null) {
            this.areaOptions = data;
          }
        }
      );

      await this.httpCrudService.getEventClassType().then(data => {
        if (data !== null) {
          eventClassType = data.map(item => {
            return {
              id: item.eventClassTypeId,
              label: item.eventClassTypeDescription,
              code: item.eventClassTypeName
            }
          });
        }

      });

      await this.httpService.getEquipmentTreeByName('Tablada').then(data => {
        if (data !== null) {
          equipmentTreeNode.push(data);
        }
      });

      searchTreeNullNodes(equipmentTreeNode[0]);

      function searchTreeNullNodes(element) {
        if (element.nodes !== null) {
          let result = null;
          for (let i = 0; result == null && i < element.nodes.length; i++) {
            result = searchTreeNullNodes(element.nodes[i])
          }
          return result;
        } else {
          delete element.nodes;
        }
      }

      await this.httpService.getEventClassTree('Parada').then(data => {
        if (data !== null) {
          eventClassTreeNode.push(data);
        }
      });

      searchTreeNullNodes(eventClassTreeNode[0]);
    }

    let data: any = {
      action: id,
      elements: []
    }

    let headerTitleLabel: string = '';
    let confirmButtonLabel: string = '';
    let elements: any[] = [];

    //console.log(this.selectedRows);
    switch (id) { //Este switch es para recorrer cada id
      case actions.ADD:

        headerTitleLabel = 'Añadir evento'; //La cabecera
        confirmButtonLabel = 'Crear';

        elements = [
          {
            label: 'Área',
            type: inputTypes.DROPDOWN,
            disabled: false,
            value:
            {
              id: 0,
              code: 'noSelection',
              label: 'Área'
            },
            configuration: {
              options: [
                {
                  id: 0,
                  code: 'noSelection',
                  label: 'Área'
                }, ...this.areaOptions
              ]
            }
          },
          {
            label: 'Máquina',
            type: inputTypes.DROPDOWN,
            disabled: false,
            value:
            {
              id: 0,
              code: 'noSelection',
              label: 'Máquina'
            },
            configuration: {
              options: [
                {
                  id: 0,
                  code: 'noSelection',
                  label: 'Máquina'
                }, ...this.equipmentOptions
              ]
            }
          },
          {
            label: 'Inicio',
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
            type: inputTypes.CALENDAR,
            disabled: false,
            value: null,
            isNulleable: false,
            configuration: {
              maxDate: new Date(),
            }
          },
          {
            label: 'Causa',
            type: inputTypes.CASCADE,
            disabled: false,
            value: {
              text: 'elemento',
              code: 'noSelection'
            },
            configuration: {
              placeholder: 'Causa',
              treeOptions: eventClassTreeNode
            }
          },
          {
            label: 'Elemento Principal',
            type: inputTypes.CASCADE,
            disabled: false,
            value: {
              text: 'elemento',
              code: 'noSelection'
            },
            configuration: {
              placeholder: 'Elemento',
              treeOptions: equipmentTreeNode
            }
          },
          {
            label: 'Producto',
            type: inputTypes.DROPDOWN,
            disabled: false,
            value:
            {
              id: 0,
              code: 'noSelection',
              label: 'Producto'
            },
            configuration: {
              options: [
                {
                  id: 0,
                  code: 'noSelection',
                  label: 'Producto'
                },
                {
                  id: 1,
                  code: 'product1',
                  label: 'Producto 1'
                },
                {
                  id: 2,
                  code: 'product2',
                  label: 'Producto 2'
                }
              ]
            }
          },
          {
            label: 'Tipo',
            type: inputTypes.DROPDOWN,
            disabled: false,
            value:
            {
              id: 0,
              code: 'noSelection',
              label: 'Tipo'
            },
            configuration: {
              options: [{
                id: 0,
                code: 'noSelection',
                label: 'Tipo'
              }, ...eventClassType]
            }
          },
          {
            label: 'Observaciones',
            type: inputTypes.TEXT_AREA,
            disabled: false,
            value: '',
            configuration: {
              placeholder: 'Observaciones'
            }
          },


        ];
        break;

      case actions.DECLARE:

        this.isLoadingResults = true;

        data['eventId'] = this.selectedRows[0].id;
        headerTitleLabel = 'Declarar evento';
        confirmButtonLabel = 'Declarar';

        elements = [
          { //Área
            label: 'Área',
            type: inputTypes.INPUT_TEXT,
            disabled: true,
            value: this.selectedRows[0].area,
            configuration: {
              options: [
                {
                  id: 1,
                  code: this.selectedRows[0].area,
                  label: this.selectedRows[0].area
                },
              ]
            }
          },
          {//Máquina
            label: 'Máquina',
            type: inputTypes.INPUT_TEXT,
            disabled: true,
            value: this.selectedRows[0].equipment,
            configuration: {
              options: [
                {
                  id: 0,
                  code: 'noSelection',
                  label: 'Máquina'
                }
              ]
            }
          },
          {//Inicio
            label: 'Inicio',
            type: inputTypes.CALENDAR,
            disabled: true,
            value: this.selectedRows[0].beginDate,
            configuration: {
              maxDate: new Date(),
            }
          },
          {//Fin
            label: 'Fin',
            type: inputTypes.CALENDAR,
            disabled: true,
            value: this.selectedRows[0].endDate ? this.selectedRows[0].endDate : null,
            configuration: {
              maxDate: new Date(),
            }
          },
          {//Causa
            label: 'Causa',
            type: inputTypes.CASCADE,
            disabled: false,
            value: {
              text: this.selectedRows[0].eventClassName,
              code: 'noSelection',
              ref_:this.selectedRows[0].eventClassId
            },
            configuration: {
              placeholder: this.selectedRows[0].eventClassName,
              treeOptions: eventClassTreeNode
            }
          },
          {//Elemento principal
            label: 'Elemento Principal',
            type: inputTypes.CASCADE,
            disabled: false,
            value: {
              text: this.selectedRows[0].mainElment,
          		ref_: this.selectedRows[0].mainElementId,
              code: 'noSelection'
            },
            configuration: {
              placeholder: this.selectedRows[0].mainElement,
              treeOptions: equipmentTreeNode
            }
          },
          {//Producto
            label: 'Producto',
            type: inputTypes.DROPDOWN,
            disabled: true,
            value:
            {
              id: 0,
              code: 'noSelection',
              label: 'Producto'
            },
            configuration: {
              options: [
                {
                  id: 0,
                  code: 'noSelection',
                  label: 'Producto'
                }
              ]
            }
          },
          {//Tipo
            label: 'Tipo',
            type: inputTypes.INPUT_TEXT,
            disabled: true,
            value: this.selectedRows[0].eventTypeName,
            configuration: {
              options: [{
                id: 0,
                code: 'noSelection',
                label: 'Tipo'
              }, ...eventClassType]
            }
          },
          {//Observaciones
            label: 'Observaciones',
            type: inputTypes.TEXT_AREA,
            disabled: false,
            value: this.selectedRows[0].comments,
            configuration: {
              placeholder: 'Observaciones'
            }
          },
        ];

        break;

      case actions.JOIN:
        headerTitleLabel = 'Unir eventos'
        break;

      case actions.SPLIT:

        this.isLoadingResults = true;

        headerTitleLabel = 'Dividir evento';
        data['eventId'] = this.selectedRows[0].id;
        confirmButtonLabel = 'Dividir';

        elements = [
          {//Área
            label: 'Área',
            type: inputTypes.INPUT_TEXT,
            disabled: true,
            value: this.selectedRows[0].area,
            configuration: {
              options: [
                {
                  id: 1,
                  code: this.selectedRows[0].area,
                  label: this.selectedRows[0].area
                },
              ]
            }
          },
          {//Máquina
            label: 'Máquina',
            type: inputTypes.DROPDOWN,
            disabled: true,
            value:this.selectedRows[0].equipment,
            // {
            //   id: 0,
            //   code: 'noSelection',
            //   label: 'Máquina'
            // },
            configuration: {
              options: [
                {
                  id: 0,
                  code: 'noSelection',
                  label: 'Máquina'
                }, ...this.equipmentOptions
              ]
            }
          },
          {//Inicio
            label: 'Inicio',
            type: inputTypes.CALENDAR,
            disabled: false,
            value: this.selectedRows[0].beginDate,
            configuration: {
              maxDate: new Date(),
              // isNulleable: false
            }
          },
          {//Fin
            label: 'Fin',
            type: inputTypes.CALENDAR,
            disabled: false,
            value: this.selectedRows[0].endDate,
            isNulleable: false,
            configuration: {
              maxDate: new Date(),
            }
          },
          {//Causa
            label: 'Causa',
            type: inputTypes.CASCADE,
            disabled: true,
            value: {
              text: this.selectedRows[0].eventClassName,
              code: 'noSelection',
              ref_:this.selectedRows[0].eventClassId
            },
            configuration: {
              placeholder: this.selectedRows[0].eventClassName,
              treeOptions: eventClassTreeNode
            }
          },
          {//Elemento Principal
            label: 'Elemento Principal',
            type: inputTypes.CASCADE,
            disabled: true,
            value: {
              text: this.selectedRows[0].mainElment,
          		ref_: this.selectedRows[0].mainElementId,
              code: 'noSelection'
            },
            configuration: {
              placeholder: this.selectedRows[0].mainElement,
              treeOptions: equipmentTreeNode
            }
          },
          {//Producto
            label: 'Producto',
            type: inputTypes.DROPDOWN,
            disabled: true,
            value:
            {
              id: 0,
              code: 'noSelection',
              label: 'Producto'
            },
            configuration: {
              options: [
                {
                  id: 0,
                  code: 'noSelection',
                  label: 'Producto'
                },
                {
                  id: 1,
                  code: 'product1',
                  label: 'Producto 1'
                },
                {
                  id: 2,
                  code: 'product2',
                  label: 'Producto 2'
                }
              ]
            }
          },
          {//Tipo
            label: 'Tipo',
            type: inputTypes.DROPDOWN,
            disabled: true,
            value:this.selectedRows[0].eventTypeName,
            // {
            //   id: 0,
            //   code: 'noSelection',
            //   label: 'Tipo'
            // },
            configuration: {
              options: [{
                id: 0,
                code: 'noSelection',
                label: 'Tipo'
              }, ...eventClassType]
            }
          },
          {//Observaciones
            label: 'Observaciones',
            type: inputTypes.TEXT_AREA,
            disabled: true,
            value: this.selectedRows[0].comments,
            configuration: {
              placeholder: 'Observaciones'
            }
          },
        ];
        break;

      case actions.DELETE:

        break;

      default:
        break;
    }

    data['headerTitleLabel'] = headerTitleLabel;
    data['confirmButtonLabel'] = confirmButtonLabel;
    data.elements = elements;

    this.isLoadingResults = false;

    if ((id !== actions.DELETE) && (id !== actions.COPY) && (id !== actions.PASTE)) {
      this.router.navigate(['/init-menu/vision-cut'], { queryParams: { data: JSON.stringify(data) } });
    }

  }
  // #endregion

  // #region - Este método es para eliminar el evento
  HandleDeleteEvents() {

    this.confirmationService.confirm({
      message: 'Está seguro que desea eliminar el/los evento/s seleccionado/s?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: async () => {

        let data: number[] = [];

        this.selectedRows.forEach(element => {
          data.push(element.id);
        });

        //console.log(data);

        this.isLoadingResults = true;

        await this.httpCrudService.postDeleteManualEvents(data).then(async data => {
          //console.log(data);
          if ((data.deleteRecords > 0) || (data.newRecords > 0) || (data.updateRecords > 0)) {

            this.messageService.add({
              life: 6000, key: 'operationStatusInfo',
              severity: 'success', summary: 'Completado',
              detail: 'Se han eliminado los datos correctamente'
            });

            await this.getEventSpecial(this.dateFormatter.IsoFormatter(this.startDateBegin), this.dateFormatter.IsoFormatter(this.startDateEnd));
			this.HandleResetTableFilters();
          } else {
            if (data.deleteRecords === -1) {
              this.messageService.add({
                life: 6000, key: 'operationStatusInfo',
                severity: 'error', summary: 'Error',
                detail: 'No se ha completado la operación. Evento/s seleccionados/s no son "manuales"'
              });
            }
          }
        });
        this.isLoadingResults = false;
        //this.messageService.add({ key: "operationStatusInfo", severity: 'info', summary: 'Confirmado', detail: 'Se ha eliminado el evento.' });
        this.selectedRows = [];
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ key: "operationStatusInfo", severity: 'error', summary: 'Rechazado', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ key: "operationStatusInfo", severity: 'warn', summary: 'Cancelado', detail: 'You have cancelled' });
            break;
        }

      }
    });

  }
 //#endregion
  clipboardData: any = null;

  // #region - Este método es para copiar la declaración
  HandleCopyDeclaration() {

    this.declarationStorage = this.selectedRows[0];
    let pasteButton: any = this.toolBarButtons.find(item => item.name === actions.PASTE);
    pasteButton.disabled = false;

    this.clipboardData = this.selectedRows[0];

    console.log(this.clipboardData);
    this.selectedRows = [];
    this.HandleRowSelect('');

    this.messageService.add(
      {
        key: "operationStatusInfo",
        life: 6000, severity: 'info',
        summary: 'Aviso',
        detail: 'Declaración copiada. Causa: ' + this.clipboardData.eventClassName
      });

    //console.log(this.declarationStorage)
  }
  // #endregion

  // #region - Este método asincrono es pegar la declaración
  async HandlePasteDeclaration() {

    let eventId: number[] = [];

    this.selectedRows.forEach(element => {
      eventId.push(element.id);
    });

    const data: any = {
      eventClass: this.clipboardData,
      eventId: eventId
    }

    this.isLoadingResults = true;


    await this.httpCrudService.postPasteDeclareEvents(data).then(async data => {
      console.log(data);

      if ((data.deleteRecords > 0) || (data.newRecords > 0) || (data.updateRecords > 0)) {

        this.messageService.add({
          life: 6000, key: 'operationStatusInfo',
          severity: 'success', summary: 'Completado',
          detail: 'Se han copiado y pegado los datos correctamente'
        });

        await this.getEventSpecial(this.dateFormatter.IsoFormatter(this.startDateBegin), this.dateFormatter.IsoFormatter(this.startDateEnd));

      } else {
        if (data.deleteRecords === -1) {
          this.messageService.add({
            life: 6000, key: 'operationStatusInfo',
            severity: 'error', summary: 'Error',
            detail: 'No se ha completado la operación. Evento/s seleccionados/s no son "manuales"'
          });
        } else {
          this.messageService.add({
            life: 6000, key: 'operationStatusInfo',
            severity: 'error', summary: 'Error',
            detail: 'No se ha completado la operación.'
          });
        }

      }
    });

    let pasteButton: any = this.toolBarButtons.find(item => item.name === actions.PASTE);
    pasteButton.disabled = true;

    this.isLoadingResults = false;
  }
  // #endregion

  // #region - Este método es asincrono es para dividir la declaración

  //#endregion
}
