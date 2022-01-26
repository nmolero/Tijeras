import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef, ViewEncapsulation, Renderer2 } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { slideInAnimation } from '../../animations';
import { AuthGuardService } from '../../auth-guard.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';


//#region - Services
import { HttpService } from '../../services/http-general-service';
import { UserConfigurationData } from '../../services/user-configuration';
import { ReportSnackBar } from '../components/report-snack-bar/report-snack-bar';
import { IDropDownItems } from 'src/app/interfaces/components/dropdown';
import { BoundElementProperty } from '@angular/compiler';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DateFormatter } from '../../services/date-formatter';
import { DatePickersValidation } from '../../services/datepickers-validation'
import { DateCalculations } from '../../services/date-calculations'
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
//#endregion


@Component({
  selector: 'app-init-menu',
  templateUrl: './init-menu.component.html',
  styleUrls: ['./init-menu.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [slideInAnimation],
  providers: [DateFormatter, HttpService, UserConfigurationData, ReportSnackBar,
    MessageService, ConfirmationService, DateCalculations, NzContextMenuService]
})
export class InitMenuComponent implements OnInit {

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService, private router: Router,
    private piWebApiUserFormBuilder: FormBuilder, private nzContextMenuService: NzContextMenuService,
    private authGuardService: AuthGuardService, private httpGeneralService: HttpService,
    private reportSnackBar: ReportSnackBar, private messageService: MessageService,
    private httpLogin: HttpClient, private dateFormatter: DateFormatter,
    public userDataService: UserConfigurationData, private dateCalculations: DateCalculations,
    private renderer: Renderer2,
    private confirmationService: ConfirmationService
  ) {


  }

  @ViewChild('menu') nzDropDownMenu: NzDropdownMenuComponent;
  @ViewChild('nzDropDownMenuList', { read: ElementRef }) nzDropDownMenuList: ElementRef;
  @ViewChild('criticalEventSliderOverlay') criticalEventSliderOverlay: OverlayPanel;
  @ViewChild('aboutOverlay') aboutOverlay: OverlayPanel;




  //App Versions
  frontEndVersion = "STA2 FE version 0.0.2.8";
  backEndVersion = "";

  //Panel Menu
  menuSideBarVisible: boolean = true; //Declaro esta varaible para que se vea el menú

  //Log Flag
  isLogged: boolean = true; //Esta varaible dirá si el usuario es correcto


  //Block Ui
  isLoadingResults: boolean = false; //Para que la página no se recargue

  //Menu Items
  panelMenuItems: MenuItem[];

  userLoginMenuItems: MegaMenuItem[];

  backEndTimer: any = null;


  //Dialog - Para mostrar los dialogos de la barra de navegación

  dialogHeader: string = "Configuración PI Web Api";
  displayDialog: boolean = false; //A falso para que no se muetre el dialogo

  reImportManualDialogHeader: string = "Re-Importación - Automática | Manual";
  reImportManualDisplayDialog: boolean = false;

  isReImportManualConfirmButton: boolean = true;

  //DropDown

  afServersOptions: IDropDownItems[] = [];
  dataBaseOptions: IDropDownItems[] = [];
  elementOptions: IDropDownItems[] = [];

  selectedAFServer: IDropDownItems = { id: 0, label: 'No data', code: 'No data' };
  selectedDataBase: IDropDownItems = { id: 0, label: 'No data', code: 'No data' };
  selectedElement: IDropDownItems = { id: 0, label: 'No data', code: 'No data' };

  isElementDDDisabled: boolean = true;
  isDataBaseDDDisabled: boolean = true;


  //Pi Web Api

  afServersData: any = {};
  dataBasesData: any = {};
  elementsData: any = {};

  PIWebAPIConfig: any[] = [];

  //InputSwitch

  autoImportEnabled: boolean = false;

  //Sliders

  autoImportSampledPeriod: number = 1;
  autoImportSampledPeriodMin: number = 1;
  autoImportSampledPeriodMax: number = 60;

  autoImportTimeRange: number = 1;
  autoImportTimeRangeMin: number = 1;
  autoImportTimeRangeMax: number = 24;

  autoImportMaxCount: number = 1000;
  maxCountMin: number = 1000;
  maxCountMax: number = 10000;

  //User, PassWord && Category

  piWebApiUserName: string = "";
  piWebApiPass: string = "";
  eventsCategory: string = "";

  isUserNameInputDisabled: boolean = true;
  isPassWordInputDisabled: boolean = true;
  isEventsCategoryInputDisabled: boolean = true;

  //Toast
  toastZIndex: number = 0;

  //FormGroup

  piWebUserFormGroup: FormGroup;

  //Critical Events SideBar - Es el que está en la barra lateral con la flecha naranja

  criticalEventsSideBarVisible: boolean = false;
  isCriticalEventsSideBarDisabled: boolean = false; //Es el botón que se muestra en como barra lateral, es mejor para el responsive movíl
  isPiWebConfigButtonDisabled: boolean = false; //Este es el botón de los tres puntos y abre un modal con la configuarión PI

  isReImportManualButtonDisabled: boolean = false;


  onGoingEventsData: any[] = [];
  unDeclaredEventsData: any[] = [];


  //Select Button

  importActionOptions: any[] = [
    { label: 'Imp. Automática', value: 'reimport' },
    // { label: 'Imp. Manual', value: 'manual' },
  ];

  selectedImportAction: any = null;

  //Calendar

  importRangeDates: Date[];
  maxDate: Date = new Date();

  importStartRangeDate: Date;

  importEndRangeDate: Date;


  async ngOnInit() {

  //Esta es la estrutura inicial del menú
	console.log(this.storage.get('isLoggedIn'));
    this.setPanelMenuItemExpanded(false);

    const propertyNames: string[] = Object.getOwnPropertyNames(this.PIWebConfigKey);

    this.piWebUserFormGroup = this.piWebApiUserFormBuilder.group({
      'piWebApiFormUserName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'piWebApiFormPassWord': new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    this.piWebUserFormGroup.controls['piWebApiFormUserName'].disable();
    this.piWebUserFormGroup.controls['piWebApiFormPassWord'].disable();

    this.isUserNameInputDisabled = true;

    //console.log(propertyNames);

    this.selectedImportAction = this.importActionOptions[0].value;

    this.userLoginMenuItems =
      [
        {
          label: 'Usuario: ' + this.userDataService.userData.userName,
          icon: 'pi pi-fw pi-cog',
          items:
            [
              [
                {
                  label: 'Configuración',
                  icon: 'pi pi-fw pi-circle-on',
                  //routerLink: ['test-report']
                }
              ],
              [
                {
                  label: 'Cerrar sesión',
                  icon: 'pi pi-fw pi-sign-out',
                  //routerLink: ['test-report']
                }
              ]

            ]
        }
      ];


    await this.httpGeneralService.getInfoApp().then(
      data => {
        if (data != null) {
          //console.log(data);
          this.backEndVersion = "STA2 BE version " + data.verApp;
        }
        else {
          // console.log(data);
          this.backEndVersion = "STA2 BE version -----"
        }
      }
    );


    /*

  if (sessionStorage.getItem('isBEVersionTimerInitalize') !== undefined) {

    this.backEndTimer = window.setInterval(async function () {

      sessionStorage.setItem('isBEVersionTimerInitalize', 'true');

      await this.httpGeneralService.getInfoApp().then(
        data => {
          if (data != null) {
            //console.log(data);
            this.backEndVersion = "STA2 BE version " + data.verApp;
          }
          else {
            // console.log(data);
            this.backEndVersion = "STA2 BE version -----"
          }
        }
      );


    }.bind(this), 15000);

  }*/


    /*
    await this.httpGeneralService.getPruebas().then(
      data => {
        console.log(data);
      });*/

  }

  async ngAfterViewInit() {

    let backEndVersion: Promise<string>;

    if (this.storage.get('isPreviousPageLogin') == true) {
      this.menuSideBarVisible = true;
    } else {
      this.menuSideBarVisible = false;
    }


    //console.log(this.nzDropDownMenu);

    //await (backEndVersion = this.httpService.GetVersionBackEnd());

    //this.backEndVersion = (await backEndVersion).valueOf();
    //console.log(this.nzDropDownMenu);

    //let nzDropDownMenuNative = this.nzDropDownMenu.nativeElement;

    //console.log(nzDropDownMenuNative.getBoundingClientRect());

    //let nzDropDownMenuListNative = this.nzDropDownMenuList.nativeElement;

    //console.log(nzDropDownMenuListNative)
    //console.log(this.nzDropDownMenuList)


    // this.getMenuPosition();

    //console.log(this.menuX, this.menuY);
  }

  HandleClickEvent(e) {

    //this.router.navigate(['events-managment']);
    console.log(e);
  }

  menuX: number = 0;
  menuY: number = 0;

  // getMenuPosition() {
  //   let nzDropDownMenuNative = this.nzDropDownMenu.nativeElement;
  //   let nzDropDownMenuListNative = this.nzDropDownMenuList.nativeElement;


  //   const menuDimensions = nzDropDownMenuNative.getBoundingClientRect();
  //   const menuX = menuDimensions.x;
  //   const menuY = menuDimensions.y;

  //   this.menuX = menuX;
  //   this.menuY = menuY;

  //   const menuListDimensions = nzDropDownMenuListNative.getBoundingClientRect();
  //   const menuListX = menuListDimensions.x;
  //   const menuListY = menuListDimensions.y;

  // }

  setMenuListPosition() {

    let nzDropDownMenuListNative = this.nzDropDownMenuList.nativeElement;

    const menuListDimensions = nzDropDownMenuListNative.getBoundingClientRect();
    const menuListX = menuListDimensions.x;
    const menuListY = menuListDimensions.y;
    console.log(menuListX, menuListY);

    // this.renderer.setAttribute(nzDropDownMenuListNative, 'x', menuX);
    // this.renderer.setAttribute(nzDropDownMenuListNative, 'y', menuY);
    //console.log(nzDropDownMenuListNative.clientLeft, nzDropDownMenuListNative.clientTop, nzDropDownMenuListNative.offsetLeft)
    //Hardcoded data
    let offSetX: number = 0;
    let offSetY: number = 0;



    nzDropDownMenuListNative.style.position = 'relative';
    nzDropDownMenuListNative.style.left = (0).toString() + 'px';
    nzDropDownMenuListNative.style.top = (offSetY).toString() + 'px';


  }

  mouseoverNzDropDown(event) {
    //console.log(event);
    // setTimeout(() => {
    //   this.setMenuListPosition();
    // }, 10);

  }

  mouseoutNzDropDown(event) {
    //console.log(event);
    //this.setMenuListPosition();

  }


  dataBaseLink: string = "";
  elementsLink: string = "";
  eventFramesLink: string = "";

  // Desde este setPanel es donde mando a llamar de los los enlaces que se encuentran en el manú de la barra lateral
  setPanelMenuItemExpanded(expanded: boolean) {
    this.panelMenuItems = [
      { //Para la importación de eventos
        label: 'Importación de Eventos',
        icon: 'pi pi-pw pi-download',
        visible: false,
        expanded: false,
        items: [
          // {
          //   label: 'Importación Automática',
          //   icon: 'pi pi-fw pi-circle-on',
          //   expanded: false
          // },
          {
            label: 'Re-importación Período - Manual',
            icon: 'pi pi-fw pi-circle-on',
            expanded: false,
            command: () => {

              this.isReImportManualConfirmButton = true;
              this.importRangeDates = undefined;
              this.reImportManualDisplayDialog = true;
            }
          },
          // {
          //   label: 'Importación Manual',
          //   icon: 'pi pi-fw pi-circle-on',
          //   disabled: false,
          //   expanded: false
          // },
        ]

      },
      {//Para el árbol de activos
        label: 'Árbol de Activos',
        visible: true,
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['assets-tree']
      },
      {//Para la gestión de eventos
        label: 'Visión Tijeras',
        visible: true,
        icon: 'pi pi-fw pi-book',
        routerLink: ['events-managment']
      },
      {//Para la programación
        label: 'Programación',
        visible: false,
        icon: 'pi pi-fw pi-pencil',
        expanded: false,
        items: [
          {
            label: 'Esquemas',
            icon: 'pi pi-fw pi-circle-on',
            expanded: false,
            routerLink: ['work-scheme']
          },
          {
            label: 'Períodica',
            icon: 'pi pi-fw pi-circle-on',
            expanded: false,
            routerLink: ['work-schedule']

          },
          {
            label: 'Eventual',
            icon: 'pi pi-fw pi-circle-on',
            expanded: false,
            routerLink: ['eventual-schedule']
          },
        ]
      },
      {//Para los reportes
        label: 'Reportes',
        icon: 'pi pi-fw pi-chart-line',
        visible: false,
        styleClass: "icon"
      },
      {//Para la configuración
        label: 'Configuración',
        icon: 'pi pi-fw pi-cog',
        expanded: false,
        visible: false,
        items: [
          {//Lis desplegable ABM
            label: 'ABM',
            icon: 'pi pi-fw pi-pencil',
            expanded: false,
            items: [
              {//Causa - subcausa
                label: 'Causa - Subcausa',
                icon: 'pi pi-fw pi-circle-on',
                expanded: false,
                routerLink: ['event-class'],
              },
              {//Módulos
                label: 'Módulos',
                icon: 'pi pi-fw pi-circle-on',
                expanded: false,
                routerLink: ['system-modules']
              },
              {//Parámetros de sistema
                label: 'Parámetros de Sistema',
                icon: 'pi pi-fw pi-circle-on',
                expanded: false,
                routerLink: ['system-settings'],
              },
              {//Permisos
                label: 'Permisos',
                icon: 'pi pi-fw pi-circle-on',
                expanded: false,
                routerLink: ['permissions']
              },
              {//Perfiles
                label: 'Perfiles',
                icon: 'pi pi-fw pi-circle-on',
                expanded: false,
                routerLink: ['profiles']
              },
              {//Usuarios
                label: 'Usuarios',
                icon: 'pi pi-fw pi-circle-on',
                expanded: false,
                routerLink: ['users-crud']
              }
            ]
          },
          {//Configuración PI
            label: 'Configuración PI',
            icon: 'pi pi-fw pi-circle-on',
            expanded: false,
            command: async () => {

              this.isLoadingResults = true;

              await this.GetAllPiWebConfiguration();

              this.isLoadingResults = false;
              this.displayDialog = true;
            }
            //routerLink: ['system-settings'],
          },
          {//Acerca de
            label: 'Acerca de',
            icon: 'pi pi-fw pi-circle-on',
            expanded: false,
            command: async (e) => {

              console.log(e.originalEvent);

              this.aboutOverlay.toggle(e.originalEvent);

              // this.isLoadingResults = true;

              // await this.GetAllPiWebConfiguration();

              // this.isLoadingResults = false;
              // this.displayDialog = true;
            }
            //routerLink: ['system-settings'],
          },
        ]

      },
       {//Bonelli
        label: 'Bonelli',
        visible: true,
        expanded: false,
        items: [
          {
            label: 'Tijera 4',
            icon: 'pi pi-fw pi pi-circle-on',
            routerLink: ['vision-tijera'],
          },
          {
            label: 'Tijera 9',
            icon: 'pi pi-fw pi pi-circle-on',
            routerLink: ['vision-tijera'],
          }
        ]
      },
      {//Fenicsa
        label: 'Fenicsa',
        visible: true,
        expanded: false,
        items: [
          {
            label: 'Futuro',
            icon: 'pi pi-fw pi-circle-on'
          }
        ]
      },
      {//Tren 1
        label: 'Tren 1',
        visible: true,
        expanded: false,
        items: [
          {
            label: 'Tijera 6',
            icon: 'pi pi-fw pi pi-circle-on',
            routerLink: ['vision-tijera'],
          }
        ]
      },
      {//Tren 2
        label: 'Tren 2',
        visible: true,
        expanded: false,
        items: [
          {
            label: 'Futuro',
            icon: 'pi pi-fw pi-circle-on',
            routerLink: ['vision-tijera']
          }
        ]
      },
      {//Tren 3
        label: 'Tren 3',
        visible: true,
        expanded: false,
        items: [
          {
            label: 'Tijera 6',
            icon: 'pi pi-fw pi-circle-on',
            routerLink: ['vision-tijera']
          }
        ]
      },
      {//Rango de fechas
        label: 'Reportes',
        visible: true,
        expanded: false,
        items: [
          {
            label: 'Reporte 1',
            icon: 'pi pi-fw pi-circle-on',
            routerLink: ['vision-tijera']
          },
          {
            label: 'Reporte 2',
            icon: 'pi pi-fw pi-circle-on',
            routerLink: ['vision-tijera']
          }
        ]
      },
      {//Configuración
        label: 'Configuración',
        expanded: false,
        items: [
          {
            label: 'Rango',
            icon: 'pi pi-fw pi-circle-on',
            routerLink: ['rango']
          },
          {
            label: 'Distribución',
            icon: 'pi pi-fw pi-circle-on'
          },
          {
            label: 'Tabla',
            icon: 'pi pi-fw pi-circle-on'
          },
          {
            label: 'Fotograma',
            icon: 'pi pi-fw pi-circle-on',
          },
          {
            label: 'Rendimiento metálico',
            icon: 'pi pi-fw pi-circle-on',
          }
        ]
      }
    ];

  }

  // PIWebConfigKey = {
  //   assetServersWedId: ["AssetServersWedId", 'webId', this.afServersData, this.selectedAFServer],
  //   assetServersName: ["AssetServersName", 'name', this.afServersData, this.selectedAFServer],
  //   assetServersID: ["AssetServersId", 'id', this.afServersData, this.selectedAFServer],
  //   dataBasesNameWebId: ["DataBasesNameWebId", 'webId', this.afServersData, this.selectedAFServer],
  //   dataBasesName: ["DataBasesName", 'name', this.afServersData, this.selectedAFServer],
  //   dataBasesId: ["DataBasesId", 'id', this.afServersData, this.selectedAFServer],
  //   elementsWebId: ["ElementsWebId", 'webId', this.afServersData, this.selectedAFServer],
  //   elementsName: ["ElementsName", 'name', this.afServersData, this.selectedAFServer],
  //   elementsId: ["ElementsId", 'id', this.afServersData, this.selectedAFServer],
  //   userName: ['User', this.piWebApiUserName],
  //   pass: ['Pass', this.piWebApiPass],
  //   autoImport: ["AutoImport", this.autoImportEnabled.toString()],
  //   autoImporperiod: ["AutoImporperiod", this.autoImportSampledPeriod.toString()],
  //   autoImportRankOfTime: ["AutoImportRankOfTime", this.autoImportTimeRange]

  // };




  SetItemData(item: string, data: any, selectedItem: IDropDownItems, value: string) {

    if (this.PIWebConfigKey[item].length === 4) {
      this.PIWebConfigKey[item][2] = data;
      this.PIWebConfigKey[item][3] = selectedItem
    }
    if (this.PIWebConfigKey[item].length === 2) {
      this.PIWebConfigKey[item][1] = value
    }


  }




  GetItemValue(itemKey: string): string {

    return this.PIWebAPIConfig.find(item => {
      return item.systemParameterKey === itemKey;
    }).systemParameterValue;
  }

  GetSelectedItem(itemKey: string, options: IDropDownItems[]): IDropDownItems {
    const seletedAfServerItem = this.PIWebAPIConfig.find(
      item => {
        return item.systemParameterKey === itemKey;
      }
    ).systemParameterValue;

    let seletedAfServerName: string = '';

    if (seletedAfServerItem != undefined) {
      seletedAfServerName = seletedAfServerItem.systemParameterValue;

      const selectedItem: IDropDownItems = options.find(
        item => {
          return item.label === seletedAfServerItem;
        }
      );
      return selectedItem;
    }
    else {
      return null;
    }


  }

  GetPIConfigItem(item: string) {



  }

  //////////////////////////////////////////////////////////////////////////////////////

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

  ////////////////////////////////////////////////////////////////////////////////////////
  //iniciar animación para routing

  getAnimationData(outlet: RouterOutlet) {
    //console.log("animation");
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  //Evento click boton cerrar sesión

  handleEndSessionButton() {
    //this.authGuardService.isLoggedIn = false;

    this.isLogged = false;
    this.storage.set('isLoggedIn', false); //Cierro sesión


    //User Configuration

    this.storage.remove('username');
    this.storage.remove('login');
    this.storage.remove('profileid');
    this.storage.remove('token');
    this.storage.remove('userid');
    this.storage.remove('profileName');

    sessionStorage.removeItem('isBEVersionTimerInitalize');

    window.clearInterval(this.backEndTimer);
    this.router.navigate(['/']);



  }

  //////////////////////////////////////////////////////////////////////////////////////////

  HandleToggleSideNav(event) {
    //console.log(event.target.textContent);

    if
      ((event.target.textContent === 'Usuarios') || (event.target.textContent === 'Parámetros de Sistema')
      || (event.target.textContent === 'Gestión de Eventos') || (event.target.textContent === 'Configuración PI')
      || (event.target.textContent === 'Módulos') || (event.target.textContent === 'Permisos')
      || (event.target.textContent === 'Perfiles') || (event.target.textContent === 'Árbol de Activos')
      || (event.target.textContent === 'Re-importación Período - Manual')
      || (event.target.textContent === 'Causa - Subcausa') || (event.target.textContent === 'Esquemas')
      || (event.target.textContent === 'Períodica') || (event.target.textContent === 'Eventual')
    ) {
      this.menuSideBarVisible = false;
    }

  }

  ////////////////////////////////////////////////////////////////////


  HandleSideBarButton() {

    this.setPanelMenuItemExpanded(false);
    //console.log(this.menuItemExpanded);
    if (this.menuItemExpanded !== null) {
      let expandedItemIndex: number = -1;

      expandedItemIndex = this.panelMenuItems.findIndex(
        item => {
          return item.label === this.menuItemExpanded.label;
        }
      );

      if (expandedItemIndex >= 0) {

        this.panelMenuItems[expandedItemIndex].expanded = true;
      }

    } else {

      this.panelMenuItems.forEach(item => {
        item.expanded = false;
      });

    }


  }

  //////////////////////////////////////////////////////////////////

  menuItemExpanded: any = null;

  HandleHideSideBar() {
    this.menuItemExpanded = this.panelMenuItems.find(
      item => {
        return item.expanded === true;
      }
    );

    if (this.menuItemExpanded == undefined) {
      this.menuItemExpanded = null;
    }
  }


  ////////////////////////////////////////////////////////////////////

  isConfirmButton: boolean = true;

  //#region - Método que se encargar de manejar el botón de confirmación
  async HandleConfirmButton() {

    this.isLoadingResults = true;


    const propertyNames: string[] = Object.getOwnPropertyNames(this.PIWebConfigKey);



    const { webId: afServerWebId, id: afServerId } = this.afServersData.items.find(item => {
      return item.id === this.selectedAFServer.code;
    });

    const { webId: dataBaseWebId, id: dataBaseId } = this.dataBasesData.items.find(item => {
      return item.id === this.selectedDataBase.code;
    });
    const { webId: elementWebId, id: elementId } = this.elementsData.items.find(item => {
      return item.id === this.selectedElement.code;
    });

    /*
    const data: any =
    {
      tSystemParameter: [
        { systemParameterKey: this.PIWebConfigKey.assetServersWedId, systemParameterValue: afServerWebId },
        { systemParameterKey: this.PIWebConfigKey.assetServersName, systemParameterValue: this.selectedAFServer.label },
        { systemParameterKey: this.PIWebConfigKey.assetServersID, systemParameterValue: afServerId },
        { systemParameterKey: this.PIWebConfigKey.dataBasesNameWebId, systemParameterValue: dataBaseWebId },
        { systemParameterKey: this.PIWebConfigKey.dataBasesName, systemParameterValue: this.selectedDataBase.label },
        { systemParameterKey: this.PIWebConfigKey.dataBasesId, systemParameterValue: dataBaseId },
        { systemParameterKey: this.PIWebConfigKey.elementsWebId, systemParameterValue: elementWebId },
        { systemParameterKey: this.PIWebConfigKey.elementsName, systemParameterValue: this.selectedElement.label },
        { systemParameterKey: this.PIWebConfigKey.elementsId, systemParameterValue: elementId },
        { systemParameterKey: this.PIWebConfigKey.userName, systemParameterValue: this.piWebApiUserName },
        { systemParameterKey: this.PIWebConfigKey.pass, systemParameterValue: this.piWebApiPass },
        { systemParameterKey: this.PIWebConfigKey.autoImport, systemParameterValue: this.autoImportEnabled.toString() },
        { systemParameterKey: this.PIWebConfigKey.autoImporperiod, systemParameterValue: this.autoImportSampledPeriod.toString() },
        { systemParameterKey: this.PIWebConfigKey.sutoImportRankOfTime, systemParameterValue: this.autoImportTimeRange.toString() }
      ],
      parameterSystemModule: 'PIWebAPI'
    };*/

    const data: any =
    {
      tSystemParameter: this.CreateParametersObjects(propertyNames),
      parameterSystemModule: 'PIWebAPI'

    }

    console.log(data);

    await this.httpGeneralService.postSystemParameter_Save(data).then(
      async data => {
        console.log(data);
        if ((data !== null) && (data.error == null)) {

          if ((data.newRecords + data.deleteRecords + data.updateRecords) > 0) {
            this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'success', summary: 'Completado', detail: 'Se han actualizado los datos correctamente' });
          } else {
            this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'No se han actualizado los registros' });
          }

        }
        else {

          this.ShowUnAuthorizeToast(data);

        }
      }
    );

    this.isLoadingResults = false;
  }
  //#endregion

  CreateParametersObjects(propertyNames: string[]): any[] {

    console.log(this.PIWebConfigKey);
    console.log(propertyNames);
    return propertyNames.map(item => {

      if (this.PIWebConfigKey[item].length === 4) {
        console.log(this.PIWebConfigKey[item]);
        return {

          systemParameterKey: this.PIWebConfigKey[item][0],
          systemParameterValue: this.GetParameterValue(this.PIWebConfigKey[item][2], this.PIWebConfigKey[item][3], this.PIWebConfigKey[item][1])
        }
      }
      if (this.PIWebConfigKey[item].length === 2) {
        return {
          systemParameterKey: this.PIWebConfigKey[item][0],
          systemParameterValue: this.PIWebConfigKey[item][1]
        }
      }

    });
  }

  GetParameterValue(PiData: any, selectedItem: IDropDownItems, piWebConfigVariable: string): string {

    //le.log(PiData);
    if (PiData.items != undefined) {
      const { webId, id } = PiData.items.find(item => {
        return item.id === selectedItem.code;
      });

      if (piWebConfigVariable === 'webId') {
        return webId;
      }

      if (piWebConfigVariable === 'id') {
        return id;
      }

      if (piWebConfigVariable === 'name') {
        return selectedItem.label;
      }
    }


  }
  ///////////////////////////////////////////////////////////////////



  PIWebConfigKey = {
    assetServersWedId: ["AssetServersWedId", 'webId', this.afServersData, this.selectedAFServer],
    assetServersName: ["AssetServersName", 'name', this.afServersData, this.selectedAFServer],
    assetServersID: ["AssetServersId", 'id', this.afServersData, this.selectedAFServer],
    dataBasesNameWebId: ["DataBasesWebId", 'webId', this.dataBasesData, this.selectedDataBase],
    dataBasesName: ["DataBasesName", 'name', this.dataBasesData, this.selectedDataBase],
    dataBasesId: ["DataBasesId", 'id', this.dataBasesData, this.selectedDataBase],
    elementsWebId: ["ElementsWebId", 'webId', this.elementsData, this.selectedElement],
    elementsName: ["ElementsName", 'name', this.elementsData, this.selectedElement],
    elementsId: ["ElementsId", 'id', this.elementsData, this.selectedElement],
    userName: ['User', this.piWebApiUserName],
    pass: ['Pass', this.piWebApiPass],
    autoImport: ["AutoImport", this.autoImportEnabled.toString()],
    autoImporperiod: ["AutoImportperiod", this.autoImportSampledPeriod.toString()],
    autoImportRankOfTime: ["AutoImportRankOfTime", this.autoImportTimeRange.toString()],
    dataBaseLink: ['DataBaseLink', this.dataBaseLink],
    elementsLink: ['ElementsLink', this.elementsLink],
    eventFramesLink: ['EventFramesLink', this.eventFramesLink],
    autoImportMaxCount: ['AutoImportMaxCount', this.autoImportMaxCount],
    autoImportCategoryName: ['AutoImportCategoryName', this.eventsCategory]
  };

  //#region - Método asincrono que se encarga de manejar el cambio de servidor
  async HandleChangeAfServer() {

    this.isElementDDDisabled = true;
    this.isConfirmButton = true;

    const { links }: any = this.afServersData.items.find(item => {
      return item.name === this.selectedAFServer.label;
    });

    this.dataBaseLink = links.databases;

    console.log(this.dataBaseLink);//Tarigo y muestro por consola los datos del servidor

    //#region - Este es otro ejemplo
    // await this.httpGeneralService.getPIWebAPI_ConsArch_P("DataBase").then(
    //   data => {
    //     //console.log(data);

    //     if ((data !== null) && (data.error == null)) {

    //       this.dataBasesData = data;

    //       [...this.dataBaseOptions] = data.items.map((item, i) => {
    //         return { id: i + 1, label: item.name, code: item.id }
    //       });

    //       [...this.dataBaseOptions] = [{ id: 0, label: 'Sele. Base de Datos', code: 'noSelection' }, ...this.dataBaseOptions];

    //     } else {
    //       [...this.dataBaseOptions] = [{ id: 0, label: 'Sin datos', code: 'noData' }, ...this.dataBaseOptions];
    //       this.ShowUnAuthorizeToast(data);

    //     }

    //     this.selectedDataBase = this.dataBaseOptions[0];

    //   }
    // );
    //#endregion

    await this.httpGeneralService.getQueryPIWebAPI(this.dataBaseLink).then(
      data => {
        console.log(data);

        if ((data !== null) && (data.error == null)) {
          this.dataBasesData = data;
          [...this.dataBaseOptions] = data.items.map((item, i) => {
            return { id: i + 1, label: item.name, code: item.id }
          });
          [...this.dataBaseOptions] = [{ id: 0, label: 'Sele. Base de Datos', code: 'noSelection' }, ...this.dataBaseOptions];

        } else {
          [...this.dataBaseOptions] = [{ id: 0, label: 'Sin datos', code: 'noData' }, ...this.dataBaseOptions];
          this.ShowUnAuthorizeToast(data);
        }

        this.selectedDataBase = this.dataBaseOptions[0];
      }
    );
    //#endregion


    this.PIWebConfigKey['assetServersWedId'][3] = this.selectedAFServer;
    this.PIWebConfigKey['assetServersName'][3] = this.selectedAFServer;
    this.PIWebConfigKey['assetServersID'][3] = this.selectedAFServer;

    this.PIWebConfigKey['dataBasesNameWebId'][2] = this.dataBasesData;
    this.PIWebConfigKey['dataBasesName'][2] = this.dataBasesData;
    this.PIWebConfigKey['dataBasesId'][2] = this.dataBasesData;

    this.PIWebConfigKey['dataBasesNameWebId'][3] = this.selectedDataBase;
    this.PIWebConfigKey['dataBasesName'][3] = this.selectedDataBase;
    this.PIWebConfigKey['dataBasesId'][3] = this.selectedDataBase;
  }




  //#region - Método asincrono que maneja el cmambio de la base de datos
  async HandleChangeDataBase() {
    if (this.selectedDataBase.id != 0) {
      const { links }: any = this.dataBasesData.items.find(item => {
        return item.name === this.selectedDataBase.label;
      });

      this.elementsLink = links.elements;
      this.eventFramesLink = links.eventFrames;

      console.log(this.elementsLink);
      console.log(this.eventFramesLink);

      // await this.httpGeneralService.getPIWebAPI_ConsArch_P("Elements").then(
      //   data => {
      //     //console.log(data);

      //     if ((data !== null) && (data.error == null)) {

      //       this.elementsData = data;

      //       [...this.elementOptions] = data.items.map((item, i) => {
      //         return { id: i + 1, label: item.name, code: item.id }
      //       });

      //       this.isElementDDDisabled = false;

      //     } else {
      //       [...this.elementOptions, { id: 0, label: 'Sin datos', code: 'noData' }];
      //       this.ShowUnAuthorizeToast(data);

      //     }

      //     this.selectedElement = this.elementOptions[0];

      //   }
      // );

      await this.httpGeneralService.getQueryPIWebAPI(this.elementsLink).then(
        data => {
          console.log(data);

          if ((data !== null) && (data.error == null)) {

            this.elementsData = data;

            [...this.elementOptions] = data.items.map((item, i) => {
              return { id: i + 1, label: item.name, code: item.id }
            });

            this.isElementDDDisabled = false;

          } else {
            [...this.elementOptions, { id: 0, label: 'Sin datos', code: 'noData' }];
            this.ShowUnAuthorizeToast(data);

          }

          this.selectedElement = this.elementOptions[0];

        }
      );
    } else {

      this.isElementDDDisabled = true;
    }

    this.PIWebConfigKey['dataBasesNameWebId'][3] = this.selectedDataBase;
    this.PIWebConfigKey['dataBasesName'][3] = this.selectedDataBase;
    this.PIWebConfigKey['dataBasesId'][3] = this.selectedDataBase;

    this.PIWebConfigKey['elementsWebId'][2] = this.elementsData;
    this.PIWebConfigKey['elementsName'][2] = this.elementsData;
    this.PIWebConfigKey['elementsId'][2] = this.elementsData;

    this.PIWebConfigKey['elementsWebId'][3] = this.selectedElement;
    this.PIWebConfigKey['elementsName'][3] = this.selectedElement;
    this.PIWebConfigKey['elementsId'][3] = this.selectedElement;

    this.HandleConfirmForm();

  }
  //#endregion

  //#region - Método asincrono para manejar el elemento de cambio
  async HandleChangeElement() {

    this.HandleConfirmForm();



    this.PIWebConfigKey['elementsWebId'][3] = this.selectedElement;
    this.PIWebConfigKey['elementsName'][3] = this.selectedElement;
    this.PIWebConfigKey['elementsId'][3] = this.selectedElement;

  }
  //#endregion

  //#region - Método que se encarga de manejar formulario de confirmación
  HandleConfirmForm() {

    if ((this.selectedAFServer.id > 0) &&
       (this.selectedDataBase.id > 0) &&
       (this.selectedElement.id > 0) &&
       (this.piWebApiUserName.length > 3) &&
       (this.piWebApiPass.length > 3) &&
       (this.eventsCategory.length > 0)) {
      this.isConfirmButton = false;
    }
    else {
      this.isConfirmButton = true;
    }

    this.PIWebConfigKey['userName'][1] = this.piWebApiUserName;
    this.PIWebConfigKey['pass'][1] = this.piWebApiPass;
    this.PIWebConfigKey['autoImport'][1] = this.autoImportEnabled.toString();
    this.PIWebConfigKey['autoImporperiod'][1] = this.autoImportSampledPeriod.toString();
    this.PIWebConfigKey['autoImportRankOfTime'][1] = this.autoImportTimeRange.toString();
    this.PIWebConfigKey['dataBaseLink'][1] = this.dataBaseLink;
    this.PIWebConfigKey['elementsLink'][1] = this.elementsLink;
    this.PIWebConfigKey['eventFramesLink'][1] = this.eventFramesLink;
    this.PIWebConfigKey['autoImportMaxCount'][1] = this.autoImportMaxCount;
    this.PIWebConfigKey['autoImportCategoryName'][1] = this.eventsCategory;

  }
  //#endregion

  //#region - Método que muestra una notificación y actulización de la tabla
  async DisplayToastAndUpdateTable(data: number) {
    if (data !== null) {
      if (data == 1) {

        //await this.getProfiles();


        this.isLoadingResults = false;

        this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'success', summary: 'Completado', detail: 'Se han actualizado los datos correctamente' });
      } else {

        this.isLoadingResults = false;
        if (data === 0) {
          this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
        }

        if (data === 2) {
          this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'No se ha completado la operación. Perfil/es con permisos existentes!' });
        }
        this.ShowUnAuthorizeToast(data);


      }


    } else {
      this.isLoadingResults = false;

      this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
    }
  }
  //#endregion

  // #region - Método que se encargar de manejar el cambio del interruptor de entrada de importación automática
  async HandleAutoimportInputSwitchChange(event) {

    const data: any =
    {
      tSystemParameter: [

        { systemParameterKey: this.PIWebConfigKey.autoImport[0], systemParameterValue: this.autoImportEnabled.toString() }
      ],
      parameterSystemModule: 'PIWebAPI'
    };
    //console.log(data)

    await this.httpGeneralService.postSystemParameter_Save(data).then(
      async data => {
        //console.log(data);
        if ((data !== null) && (data.error == null)) {

          if ((data.newRecords + data.deleteRecords + data.updateRecords) > 0) {
            this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'success', summary: 'Completado', detail: 'Se han actualizado los datos correctamente' });
          } else {
            this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'No se han actualizado los registros' });
          }

        }
        else {

          this.ShowUnAuthorizeToast(data);

        }
      }
    );


  }
  //#endregion

  //#region - Método que se encargar de manejar el botón de configuración de Pi Web
  async HandlePiWebConfigButton() {
    this.toastZIndex = 0;
    this.isLoadingResults = true;

    await this.httpGeneralService.getSystemParameter("PIWebAPI").then(
      data => {
        //console.log(data);
        if ((data !== null) && (data.error == null)) {
          this.PIWebAPIConfig = data;

          this.piWebApiUserName = this.GetItemValue('User');
          this.piWebApiPass = this.GetItemValue('Pass');

          if (this.GetItemValue("AutoImport") === 'true') {
            this.autoImportEnabled = true;
          }
          else {
            this.autoImportEnabled = false;
          }

          this.autoImportSampledPeriod = parseInt(this.GetItemValue("AutoImportperiod"));
          this.autoImportTimeRange = parseInt(this.GetItemValue("AutoImportRankOfTime"));

          this.dataBaseLink = this.GetItemValue('DataBaseLink');
          this.elementsLink = this.GetItemValue('ElementsLink');
          this.eventFramesLink = this.GetItemValue('EventFramesLink');

          this.autoImportMaxCount = parseInt(this.GetItemValue("AutoImportMaxCount"));
          this.eventsCategory = this.GetItemValue('AutoImportCategoryName');
          //console.log(this.dataBaseLink);
          //console.log(this.elementsLink);
        }
        else {
          this.toastZIndex = 10000;
          this.ShowUnAuthorizeToast(data);
        }
      }
    );
    this.isLoadingResults = false;

    this.criticalEventsSideBarVisible = !this.criticalEventsSideBarVisible;

  }
  //#endregion

  //#region - Método que se encarga de obtener toda la confiuración de Pi Web
  async GetAllPiWebConfiguration() {

    this.toastZIndex = 0;
    await this.httpGeneralService.getSystemParameter("PIWebAPI").then(
      data => {
        //console.log(data);
        if ((data !== null) && (data.error == null)) {
          this.PIWebAPIConfig = data;

          this.piWebApiUserName = this.GetItemValue('User');
          this.piWebApiPass = this.GetItemValue('Pass');

          if (this.GetItemValue("AutoImport") === 'true') {
            this.autoImportEnabled = true;
          }
          else {
            this.autoImportEnabled = false;
          }

          this.autoImportSampledPeriod = parseInt(this.GetItemValue("AutoImportperiod"));
          this.autoImportTimeRange = parseInt(this.GetItemValue("AutoImportRankOfTime"));

          this.dataBaseLink = this.GetItemValue('DataBaseLink');
          this.elementsLink = this.GetItemValue('ElementsLink');
          this.eventFramesLink = this.GetItemValue('EventFramesLink');

          this.autoImportMaxCount = parseInt(this.GetItemValue("AutoImportMaxCount"));
          this.eventsCategory = this.GetItemValue('AutoImportCategoryName');
          //console.log(this.dataBaseLink);
          //console.log(this.elementsLink);
        }
        else {
          this.toastZIndex = 10000;
          this.ShowUnAuthorizeToast(data);
        }
      }
    );




    // await this.httpGeneralService.getPIWebAPI_ConsArch_P("").then(
    //   async data => {
    //     console.log(data);

    //     if ((data !== null) && (data.error == null) && (this.PIWebAPIConfig.length > 0)) {


    //       this.isUserNameInputDisabled = false;
    //       this.isPassWordInputDisabled = false;

    //       this.piWebUserFormGroup.controls['piWebApiFormUserName'].enable();
    //       this.piWebUserFormGroup.controls['piWebApiFormPassWord'].enable();

    //       this.afServersData = data;

    //       [...this.afServersOptions] = data.items.map((item, i) => {
    //         return { id: i + 1, label: item.name, code: item.id }
    //       });

    //       this.selectedAFServer = this.GetSelectedItem('AssetServersName', this.afServersOptions);

    //       // const dataBaseLink: string = this.PIWebAPIConfig.find(item => {
    //       //   return item.systemParameterKey === "DataBaseLink"
    //       // }).systemParameterValue;

    //       // console.log(dataBaseLink);

    //       await this.httpGeneralService.getPIWebAPI_ConsArch_P("DataBase").then(
    //         async data => {
    //           if ((data !== null) && (data.error == null)) {

    //             console.log(data);
    //             this.dataBasesData = data;

    //             [...this.dataBaseOptions] = data.items.map((item, i) => {
    //               return { id: i + 1, label: item.name, code: item.id }
    //             });

    //             this.isDataBaseDDDisabled = false;

    //             this.selectedDataBase = this.GetSelectedItem("DataBasesName", this.dataBaseOptions);

    //             // const elementsLink: string = this.PIWebAPIConfig.find(item => {
    //             //   return item.systemParameterKey === "ElementsLink"
    //             // }).systemParameterValue;

    //             // console.log(elementsLink);

    //             await this.httpGeneralService.getPIWebAPI_ConsArch_P("Elements").then(
    //               data => {
    //                 //console.log(data);

    //                 if ((data !== null) && (data.error == null)) {

    //                   this.elementsData = data;

    //                   [...this.elementOptions] = data.items.map((item, i) => {
    //                     return { id: i + 1, label: item.name, code: item.id }
    //                   });

    //                 }
    //                 this.selectedElement = this.GetSelectedItem("ElementsName", this.elementOptions);

    //                 this.isElementDDDisabled = false;

    //               }
    //             );

    //           }
    //         }
    //       );


    //     } else {

    //       this.toastZIndex = 10000;
    //       [...this.afServersOptions] = [{ id: 0, label: 'Sin datos', code: 'noData' }, ...this.afServersOptions];
    //       this.ShowUnAuthorizeToast(data);
    //       this.selectedAFServer = this.afServersOptions[0];
    //     }


    //     //console.log(this.afServersOptions);


    //   }
    // );


    await this.httpGeneralService.getQueryPIWebAPI("").then(
      async data => {
        console.log(data);

        if ((data !== null) && (data.error == null) && (this.PIWebAPIConfig.length > 0)) {


          this.isUserNameInputDisabled = false;
          this.isPassWordInputDisabled = false;
          this.isEventsCategoryInputDisabled = false;

          this.piWebUserFormGroup.controls['piWebApiFormUserName'].enable();
          this.piWebUserFormGroup.controls['piWebApiFormPassWord'].enable();

          this.afServersData = data;

          [...this.afServersOptions] = data.items.map((item, i) => {
            return { id: i + 1, label: item.name, code: item.id }
          });

          this.selectedAFServer = this.GetSelectedItem('AssetServersName', this.afServersOptions);



          await this.httpGeneralService.getQueryPIWebAPI(this.dataBaseLink).then(
            async data => {
              //console.log(data);
              if ((data !== null) && (data.error == null)) {

                this.dataBasesData = data;

                [...this.dataBaseOptions] = data.items.map((item, i) => {
                  return { id: i + 1, label: item.name, code: item.id }
                });

                this.isDataBaseDDDisabled = false;

                this.selectedDataBase = this.GetSelectedItem("DataBasesName", this.dataBaseOptions);


                await this.httpGeneralService.getQueryPIWebAPI(this.elementsLink).then(
                  data => {
                    //console.log(data);

                    if ((data !== null) && (data.error == null)) {

                      this.elementsData = data;

                      [...this.elementOptions] = data.items.map((item, i) => {
                        return { id: i + 1, label: item.name, code: item.id }
                      });

                    }
                    this.selectedElement = this.GetSelectedItem("ElementsName", this.elementOptions);

                    this.isElementDDDisabled = false;

                  }
                );

              }
            }
          );


        } else {

          this.toastZIndex = 10000;
          [...this.afServersOptions] = [{ id: 0, label: 'Sin datos', code: 'noData' }, ...this.afServersOptions];
          this.ShowUnAuthorizeToast(data);
          this.selectedAFServer = this.afServersOptions[0];
        }


        //console.log(this.afServersOptions);


      }
    );

    // this.PIWebConfigKey.assetServersWedId[2] = this.afServersData;
    // this.PIWebConfigKey.assetServersName[2] = this.afServersData;
    // this.PIWebConfigKey.assetServersName[2] = this.afServersData;


    this.SetItemData('assetServersWedId', this.afServersData, this.selectedAFServer, '');
    this.SetItemData('assetServersName', this.afServersData, this.selectedAFServer, '');
    this.SetItemData('assetServersID', this.afServersData, this.selectedAFServer, '');
    this.SetItemData('dataBasesNameWebId', this.dataBasesData, this.selectedDataBase, '');
    this.SetItemData('dataBasesName', this.dataBasesData, this.selectedDataBase, '');
    this.SetItemData('dataBasesId', this.dataBasesData, this.selectedDataBase, '');
    this.SetItemData('elementsWebId', this.elementsData, this.selectedElement, '');
    this.SetItemData('elementsName', this.elementsData, this.selectedElement, '');
    this.SetItemData('elementsId', this.elementsData, this.selectedElement, '');
    this.SetItemData('userName', {}, null, this.piWebApiUserName);
    this.SetItemData('pass', {}, null, this.piWebApiPass);
    this.SetItemData('autoImport', {}, null, this.autoImportEnabled.toString());
    this.SetItemData('autoImporperiod', {}, null, this.autoImportSampledPeriod.toString());
    this.SetItemData('autoImportRankOfTime', {}, null, this.autoImportTimeRange.toString());
    this.SetItemData('dataBaseLink', {}, null, this.dataBaseLink);
    this.SetItemData('elementsLink', {}, null, this.elementsLink);
    this.SetItemData('eventFramesLink', {}, null, this.eventFramesLink);
    this.SetItemData('autoImportMaxCount', {}, null, this.autoImportMaxCount.toString());
    this.SetItemData('autoImportCategoryName', {}, null, this.eventsCategory);

    //console.log(this.PIWebConfigKey);

  }
  //#endregion

  isEventsListMode: boolean = false; //Esta variable de lista de modo de eventos será declarada como falsa
  eventsData: any[] = []; //Esta variable de datos de eventos será una array vacío

  //#region - Método  que se encarga de manejar confirmar reimporta
  async HandleConfirmReImport() {

    this.isLoadingResults = true;


    await this.httpGeneralService.getEventSpecial(this.dateFormatter.IsoFormatter(this.importStartRangeDate), this.dateFormatter.IsoFormatter(this.importEndRangeDate)).then(
      data => {
        console.log(data);
        if ((data !== null) && (data.error == null)) {

          this.eventsData = data.map(item => {

            const endDate: string = this.dateFormatter.ISODateSplitFormatter(item.endTime)
            let endDateYear: string = item.endTime;
            //console.log(endDateYear);
            let durationFormat: string = '-';
            if (item.duration) {
              durationFormat = this.dateCalculations.getTimeBySeconds(item.duration)
            }


            let state: string = "";


            if (endDate.split('-')[0] === '9999') {
              endDateYear = null;
              state = 'notFinished';
            } else {

              if ((item.eventClassName === 'NO DECLARADO')) {

                state = 'notDeclared';
              } else {
                state = 'declared';
              }

            }

            const eventClassType: string = item.name ? item.name.split('>')[0] : '-';

            const startDate: Date = this.dateFormatter.ISODateObjectFormatter(item.startTime);
            //console.log(startDate);
            return ({
              beginDate: item.startTime,
              endDate: endDateYear,
              id: item.eventId,
              duration: durationFormat,
              durationSeconds: item.duration,
              area: item.areaName ? item.areaName : '',
              eventType: item.eventTypeName ? item.eventTypeName : '-',
              equipment: item.equipmentName ? item.equipmentName : '-',
              state: state,
              factory: item.description,
              eventClassType: eventClassType,
              eventTypeId: item.eventTypeId,
              eventClassId: item.eventClassId,
              startTime: item.startTime,
              endTime: item.endTime,
              areaId: item.area
            });
          })
          this.isEventsListMode = true;
        }
      });


    this.isLoadingResults = false;




  }
  //#endregion

  //#region - Método que se encarga de confirmar reimportar lista de eventos
  HandleConfirmReImportEventList() {

    const data: any[] = this.eventsData.map(item => {
      return {
        eventId: item.id,
        eventTypeId: item.eventTypeId,
        eventClassId: item.eventClassId,
        startTime: item.startTime,
        endTime: item.endTime,
        area: item.areaId
      }
    });

    console.log(data);

    this.confirmationService.confirm({
      message: 'Se sobreescribirán datos!. Está seguro que desea continuar?',
      accept: () => {
        // Lógica real para realizar una confirmación
      }
    });
  }
  //#endregion

  // #region - Método que selecciona el rango del calendario
  HandleSelectRangeCalendar(e) {
    //console.log(this.importRangeDates);

    if (this.importRangeDates) {

      const isRangeSelected = this.importRangeDates.find(date => {
        return date === null;
      });
      //console.log(isRangeSelected);

      if (isRangeSelected === undefined) {
        this.isReImportManualConfirmButton = false;
      } else {
        this.isReImportManualConfirmButton = true;
      }
    } else {
      this.isReImportManualConfirmButton = true;
    }

    if (this.importRangeDates[0] !== null) {
      this.importStartRangeDate = this.importRangeDates[0]
    } else {
      this.importStartRangeDate = null;
    }

    if (this.importRangeDates[1] !== null) {
      this.importEndRangeDate = this.importRangeDates[1]
    } else {
      this.importEndRangeDate = null;
    }


  }
  //#endregion

  // #region - Método que es para seleccionar el inicio o final del calendario
  HandleSelectStartEndCalendar(e, calendar) {

    switch (calendar) {
      case 'start':
        //console.log(this.importRangeDates);
        this.importRangeDates = [this.importStartRangeDate, null];
        if (this.importRangeDates === undefined) {
          this.importRangeDates = [this.importStartRangeDate, null];
        } else {
          if (this.importRangeDates.length === 2) {
          }
        }
        this.importRangeDates[0] = this.importStartRangeDate;
        break;
      case 'end':
        if (this.importRangeDates !== undefined) {
          if (this.importRangeDates.length === 2) {
            this.importRangeDates = [this.importStartRangeDate, this.importEndRangeDate];
            this.isReImportManualConfirmButton = false;
          } else {
            this.isReImportManualConfirmButton = true;
          }

        } else {
          this.isReImportManualConfirmButton = true;
        }
        //this.importRangeDates[1] = this.importEndRangeDate;
        break;
    }
  }
  //#endregion

  // #region - Método que sirve para importar datos manualmente
  HandleReImportManualButton() {

    this.isReImportManualConfirmButton = true;
    this.importRangeDates = undefined;
    this.reImportManualDisplayDialog = true;

  }
  //#endregion

  // #region - Métodos y parámetros críticos de la barra de despliegue
  isDisplayCriticalEventsPeriodSlider: boolean = false;
  criticalEventsPeriod: number = 1;

  criticalEventsData: any[] = [];

  criticalEventsPeriodOptions: any[] = [
    { value: 1, label: '1 mes', code: 'oneMonth' },
    { value: 2, label: '3 meses', code: 'threeMonths' },
    { value: 3, label: '6 meses', code: 'sixMonths' },
    { value: 4, label: '12 meses', code: 'twelveMonths' }
  ];

  selectedCriticalEventsPeriod: string = this.criticalEventsPeriodOptions[0].label;
  //#endregion

  // #region - Método para mostrar el botón de despliegue
  HandleDisplaySliderButtonClick(e) {
    this.criticalEventSliderOverlay.toggle(e);
  }
  //#endregion

  HandleHideSliderOverlay() {}

  //#region - Método asincrono para revisar el control deslizante de periodo de eventos críticos de cambio
  async HandleOnChangeCriticalEventsPeriodSlider() {
    this.selectedCriticalEventsPeriod = this.criticalEventsPeriodOptions.find(item => item.value === this.criticalEventsPeriod).label;

    await this.HandleCriticalEventsSideBarButtonClick();
  }
  //#endregion

  // #region - Método para revisar eventos críticos al hacer click en el botón de la barra de navegación
  async HandleCriticalEventsSideBarButtonClick() {

    this.isLoadingResults = true;

    let startDate: Date;
    let endDate: Date;
    let today: Date;

    switch (this.selectedCriticalEventsPeriod) {
      case '1 mes':
        startDate = this.dateCalculations.getlastMonthLapseOfTime(1)[0];
        endDate = this.dateCalculations.getlastMonthLapseOfTime(1)[1];
      break;
      case '3 meses':
        startDate = this.dateCalculations.getlastMonthLapseOfTime(3)[0];
        endDate = this.dateCalculations.getlastMonthLapseOfTime(3)[1];
      break;
      case '6 meses':
        startDate = this.dateCalculations.getlastMonthLapseOfTime(6)[0];
        endDate = this.dateCalculations.getlastMonthLapseOfTime(6)[1];
      break;
      case '12 meses':
        startDate = this.dateCalculations.getlastMonthLapseOfTime(12)[0];
        endDate = this.dateCalculations.getlastMonthLapseOfTime(12)[1];
      break;
      default:
      break;
    }

    await this.getEventSpecial(this.dateFormatter.IsoFormatter(startDate), this.dateFormatter.IsoFormatter(endDate));

    this.onGoingEventsData = this.criticalEventsData.filter(item => item.state === 'notFinished');
    this.unDeclaredEventsData = this.criticalEventsData.filter(item => item.state === 'notDeclared');

    console.log(this.onGoingEventsData, this.unDeclaredEventsData);
    this.isLoadingResults = false;


  }
  // #endregion

  // #region - Método asincrono para obtener un evento especial
  async getEventSpecial(startDate: string, endDate: string) {

    await this.httpGeneralService.getEventSpecial(startDate, endDate).then(
      data => {
        //console.log(data);
        if ((data !== null) && (data.error == null)) {

          //this.totalReports = data.length;

          this.criticalEventsData = data.map((item, index) => {

            const endDate: string = this.dateFormatter.ISODateSplitFormatter(item.endTime)
            let endDateYear: string = item.endTime;
            // console.log(endDateYear);
            let durationFormat: string = '-';
            if (item.duration) {
              durationFormat = this.dateCalculations.getTimeBySeconds(item.duration)
            }


            let state: string = "";


            if (endDate.split('-')[0] === '9999') {
              endDateYear = null;
              state = 'notFinished';
            } else {

              if ((item.eventClassName === 'NO DECLARADO')) {

                state = 'notDeclared';
              } else {
                state = 'declared';
              }

            }

            const eventClassType: string = item.name ? item.name.split('>')[0] : '-';

            const startDate: Date = this.dateFormatter.ISODateObjectFormatter(item.startTime)
            //console.log(startDate);
            return ({
              beginDate: item.startTime,
              endDate: endDateYear,
              id: item.eventId,
              duration: durationFormat,
              durationSeconds: item.duration,
              area: item.areaName ? item.areaName : '',
              eventType: item.eventTypeName ? item.eventTypeName : '-',
              equipment: item.equipmentName ? item.equipmentName : '-',
              state: state,
              factory: item.description,
              eventClassType: eventClassType

            });
          });

          console.log(this.criticalEventsData);

          // this.filteredDataTableValues = this.dataTableValues;
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

  // #region - Método que obtiene la la configuración de la PiWebApi
  async HandleGetPiWebApiConfig() {

    this.isLoadingResults = true;

    await this.GetAllPiWebConfiguration();

    this.displayDialog = true;
    this.isLoadingResults = false;

  }
  //#endregion

}
