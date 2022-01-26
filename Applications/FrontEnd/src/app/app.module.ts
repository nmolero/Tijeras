import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Estas importanciones son la para poner iconos
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

/////////////////////////////////////////////////////////////////////////////
//Estos modulos Mat son para los formularios

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

///////////////////////////////////////////////////////////////////////
//PrimeNg Modules



import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { BlockUIModule } from 'primeng/blockui';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';
import { FieldsetModule } from 'primeng/fieldset';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ListboxModule } from 'primeng/listbox';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { MegaMenuModule } from 'primeng/megamenu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { PickListModule } from 'primeng/picklist';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { SpinnerModule } from 'primeng/spinner';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { KeyFilterModule } from 'primeng/keyfilter';
//import { EditorModule } from 'primeng/editor';
import { StepsModule } from 'primeng/steps';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { PasswordModule } from 'primeng/password';
import { FocusTrapModule } from 'primeng/focustrap';
import { ToolbarModule } from 'primeng/toolbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SliderModule } from 'primeng/slider';
import { RippleModule } from 'primeng/ripple';
import { DragDropModule } from 'primeng/dragdrop';
import { TreeModule } from 'primeng/tree';
import { SplitterModule } from 'primeng/splitter';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CascadeSelectModule } from 'primeng/cascadeselect';


//Ng zorro Module
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';


import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';
import { SettingOutline, EditOutline, LogoutOutline } from '@ant-design/icons-angular/icons';
const icons: IconDefinition[] = [SettingOutline, EditOutline, LogoutOutline];


//Full-Calendar

import { FullCalendarModule } from '@fullcalendar/angular';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

//Module PrimeNG



//Custom Services

import { AuthGuardService } from './auth-guard.service';



//Components
// Desde acá importo todos los componentes de que se encuentran en cada una de la carpetas, es decir,
// Luego del import pongo el nombre como quiero que se llame del from especifico el ruta donde se encuentra dicho file

import { UserLoginComponent } from './user-login/user-login.component';
import { UsersCrudComponent } from './modules/configuration/users-crud/users-crud.component';
import { SystemSettingsComponent } from './modules/configuration/system-settings/system-settings.component';
import { EventsManagmentComponent } from './modules/events-managment/events-managment.component';
import { SystemModulesComponent } from './modules/configuration/sytems-modules/system-modules.component';
import { PermissionsComponent } from './modules/configuration/permissions/permissions.component';
import { ProfilesComponent } from './modules/configuration/profiles/profiles.component';

//Shared - Lo mismo para esta carpeta, se encuentran dos mas, una llamada components y otra init-menu
import { BlockUiComponent } from './shared/components/block-ui/block-ui.component';
import { InitMenuComponent } from './shared/init-menu/init-menu.component';

//Special Components - Por si no encuentra la página
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';



import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { AssetsTreeComponent } from './modules/assets-tree/assets-tree.component';
import { EventClassComponent } from './modules/configuration/event-class/event-class.component';


//Crud Components - son lo que están para la tabla donde se muestran los datos
import { CrudPanelComponent } from './modules/configuration/crud-components/crud-panel/crud-panel.component';
import { CrudTableComponent } from './modules/configuration/crud-components/crud-table/crud-table.component';
import { CrudAddEditDialogComponent } from './modules/configuration/crud-components/crud-add-edit-dialog/crud-add-edit-dialog.component';
import { CrudDeleteDialogComponent } from './modules/configuration/crud-components/crud-delete-dialog/crud-delete-dialog.component';
import { SharedService } from './services/shared-service';
import { EventFormComponent } from './modules/event-form/event-form.component';
import { WorkSchemeComponent } from './modules/configuration/work-scheme/work-scheme.component';
import { WschemeAddDialogComponent } from './modules/configuration/work-scheme/wscheme-add-dialog/wscheme-add-dialog.component';
import { WorkScheduleComponent } from './modules/work-schedule/work-schedule.component';
import { EventualScheduleComponent } from './modules/eventual-schedule/eventual-schedule.component';
// Recuerda que al importar algo, lo haces en general


import { AppComponent } from './app.component';
import { ViewWindowComponent } from './view-window/view-window.component';
import { RangeGraficComponent } from './vision-cuts/range-grafic/range-grafic.component';
import { RegisterTableComponent } from './vision-cuts/register-table/register-table.component';
import { VisionCutComponent } from './vision-cuts/vision-cut.component';
import { ImpactsMetalicsComponent } from './vision-cuts/impact-metalic/impacts-metalics.component';
import { PhotogramComponent } from './vision-cuts/photogram/photogram.component';
import { DistributionComponent } from './vision-cuts/distribution/distribution.component';
import { ResutsComponent } from './vision-cuts/resuts/resuts.component';
import { Resuts2Component } from './vision-cuts/resuts2/resuts2.component';
import { Photogram2Component } from './vision-cuts/photogram2/photogram2.component';
import { Distribution2Component } from './vision-cuts/distribution2/distribution2.component';


registerLocaleData(es);//Se le dice que los datos del registro local va a estar en español

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin,
  listPlugin
]);

@NgModule({
  declarations: [ //Agrego todas las importaciones hechas acá en declarations
    AppComponent, UserLoginComponent, BlockUiComponent, PageNotFoundComponent, InitMenuComponent,
    UsersCrudComponent,SystemSettingsComponent,EventsManagmentComponent,SystemModulesComponent,
    PermissionsComponent,ProfilesComponent,AssetsTreeComponent,EventClassComponent,CrudPanelComponent,
    CrudTableComponent,CrudAddEditDialogComponent,CrudDeleteDialogComponent,EventFormComponent,
    WorkSchemeComponent,WschemeAddDialogComponent,WorkScheduleComponent,EventualScheduleComponent,
    ViewWindowComponent, RangeGraficComponent, RegisterTableComponent, VisionCutComponent, ImpactsMetalicsComponent, PhotogramComponent, DistributionComponent, ResutsComponent, Resuts2Component, Photogram2Component, Distribution2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, //Para las animaciones en el navegador
    FontAwesomeModule, //Para iconos

    //Material Module - para el formulario
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDividerModule,
    MatSnackBarModule,
    MatTooltipModule,

    //Prime Ng Modules
    SidebarModule,
    ButtonModule,
    PanelModule,
    PanelMenuModule,
    MenuModule,
    TableModule,
    InputTextModule,
    BlockUIModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    TooltipModule,
    PaginatorModule,
    DragDropModule,
    ChartModule,

    //ChartModule,
    FieldsetModule,
    ToggleButtonModule,
    ListboxModule,
    InputMaskModule,
    InputNumberModule,
    MegaMenuModule,
    CalendarModule,
    ContextMenuModule,
    PickListModule,
    MessagesModule,
    MessageModule,
    SpinnerModule,
    AutoCompleteModule,
    MultiSelectModule,
    KeyFilterModule,

    //EditorModule of primeng,
    StepsModule,
    CheckboxModule,
    RadioButtonModule,
    InputSwitchModule,
    ScrollPanelModule,
    DataViewModule,
    CardModule,
    FileUploadModule,
    TabViewModule,
    PasswordModule,
    FocusTrapModule,
    ToolbarModule,
    OverlayPanelModule,
    SliderModule,
    RippleModule,
    TreeModule,
    SplitterModule,
    SelectButtonModule,
    ConfirmDialogModule,
    CascadeSelectModule,

    //angular
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    //Ng Zorro Module
    NzDropDownModule,
    NzIconModule,
    NzIconModule.forRoot(icons),
    NzToolTipModule,

    //Full-Calendat
    FullCalendarModule,

    // De primeng


  ],
  providers: [
    ConfirmationService, SharedService,
    AuthGuardService, MatDatepickerModule,
    { provide: NZ_I18N, useValue: es_ES },
    { provide: NZ_ICONS, useValue: icons }],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    library.add(fas, far);
  }
}
