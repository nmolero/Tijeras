import { NgModule } from '@angular/core';//Traigo para que lea y acepte todos los modulos de angular - o lo hago compatible
import { RouterModule, Routes } from '@angular/router'; //Es necesario tener esta importacion sacada del node_module
// Otro dato importe de @NgModule es que son metadatos que inicializan el enrutador y los hacen escuchar los cambios de ubicación del navegador

//Componentes - porque las animaciones serán para cada uno de los archivos de las carpeta
import { UserLoginComponent } from './user-login/user-login.component';
import { InitMenuComponent } from './shared/init-menu/init-menu.component';
import { UsersCrudComponent } from './modules/configuration/users-crud/users-crud.component';
import { SystemSettingsComponent } from './modules/configuration/system-settings/system-settings.component';
import { EventsManagmentComponent } from './modules/events-managment/events-managment.component';
import { SystemModulesComponent } from './modules/configuration/sytems-modules/system-modules.component';
import { PermissionsComponent } from './modules/configuration/permissions/permissions.component';
import { ProfilesComponent } from './modules/configuration/profiles/profiles.component';
import { AssetsTreeComponent } from './modules/assets-tree/assets-tree.component';
import { EventClassComponent } from './modules/configuration/event-class/event-class.component';
import { EventFormComponent } from './modules/event-form/event-form.component';
import { WorkSchemeComponent } from './modules/configuration/work-scheme/work-scheme.component';
import { WorkScheduleComponent } from './modules/work-schedule/work-schedule.component';
import { EventualScheduleComponent } from './modules/eventual-schedule/eventual-schedule.component';
import { VisionCutComponent } from './vision-cuts/vision-cut.component';



//Componentes espciales
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

//Servicios
import { AuthGuardService } from './auth-guard.service';

// Genero la constante
const routes: Routes = [

  // Esta constante de rutas, será la llamada y muestra en general para todos componentes que sean redirigidos

  { path: '', redirectTo: '/user-login', pathMatch: 'full' },
  //{ path : 'init-menu', redirectTo:'/user-index', pathMatch: 'full'},
  { path: 'user-login', component: UserLoginComponent, data: { animation: 'userLoginPage' } },
  {
    path: 'init-menu', component: InitMenuComponent,
    canActivate: [AuthGuardService],
    data: { animation: 'initMenuPage' },
    // Este children es donde se encuentran todos los modulos, cada uno con su importación incluida
    children: [
      {
        path: 'users-crud',//Por lo general es mejor poner el mismo nombre al cual se le hace referencia al componente que importamos
        component: UsersCrudComponent, //Importamos el componente
        data: { animation: 'UsersCrudComponent' }, //Lo mismo con las animaciones
      },
      {
        path: 'system-settings',
        component: SystemSettingsComponent,
        data: { animation: 'SystemSettingsComponent' },
      },
      {
        path: 'events-managment',
        component: EventsManagmentComponent,
        data: { animation: 'EventsManagmentComponent' },
      },
      {
        path: 'system-modules',
        component: SystemModulesComponent,
        data: { animation: 'SystemModulesComponent' },
      },
      {
        path: 'permissions',
        component: PermissionsComponent,
        data: { animation: 'PermissionsComponent' },
      },
      {
        path: 'profiles',
        component: ProfilesComponent,
        data: { animation: 'ProfilesComponent' },
      },
      {
        path: 'assets-tree',
        component: AssetsTreeComponent,
        data: { animation: 'AssetsTreeComponent' },
      },
      {
        path: 'event-class',
        component: EventClassComponent,
        data: { animation: 'EventClassComponent' },
      },
      {
        path: 'event-form',
        component: EventFormComponent,
        data: { animation: 'EventFormComponent' },
      },
      {
        path: 'work-scheme',
        component: WorkSchemeComponent,
        data: { animation: 'WorkSchemeComponent' },
      },
      {
        path: 'work-schedule',
        component: WorkScheduleComponent,
        data: { animation: 'WorkScheduleComponent' },
      },
      {
        path: 'eventual-schedule',
        component: EventualScheduleComponent,
        data: { animation: 'EventualScheduleComponent' },
      },
      {
        path: 'vision-cut',
        component: VisionCutComponent,
        data: { animation: 'VisionCutComponent'}
      }





    ]
  },
  //{ path: 'denied-auth', component: DeniedAuthComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
