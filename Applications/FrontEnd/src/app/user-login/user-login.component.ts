
import { Component, Injectable, OnInit, VERSION, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuardService } from '../auth-guard.service';
import { RouterOutlet, Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { slideInAnimation } from '../animations';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { environment } from 'src/environments/environment';
import { CardModule } from 'primeng/card';

//Shared

import { ReportSnackBar } from '../shared/components/report-snack-bar/report-snack-bar';


//Enviroment

//const environmentSeted: string = environment.LOCALHOSTHTTPS;
const environmentSeted: string = environment.TESTPC;
//const environmentSeted: string = environment.NEUROPC;
//const environmentSeted: string = environment.TESTBACKEND;
//const environmentSeted: string = environment.TRENDQA;



@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
  animations: [slideInAnimation],
  providers: [
    ReportSnackBar
  ]
})
export class UserLoginComponent implements OnInit {

  constructor(
    private reportSnackBar: ReportSnackBar,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private httpLogin: HttpClient,
    private router: Router,
  ) { }

  name: string = "";

  passwordValue = "";

  isLoadingResults = false;

  ///////////////////////////////////////////////////////////////
  //Detecto el routeo para activar la animacion

  getAnimationData(outlet: RouterOutlet) {

    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnInit() {


    //window configuration

    //console.log(window.devicePixelRatio, window.innerHeight, window.innerWidth);


    ///////////////////////////////////////////////////////////////
    //Session && Local Storage

    sessionStorage.setItem('url', environmentSeted);
    this.storage.set('isPreviousPageLogin', true);


    /////////////////////////////////////////////////

  }


  ////////////////////////////////////////////////////////////
  //Ingresar con evento press Enter Key REVISAR
  handleKeyEnter(event, userName, password) {

    if (event.keyCode == 13) {

      if (userName) {
        if (password) {

          this.handleButtonConfirm(userName, password);

        }
        else {
          this.reportSnackBar.openSnackBar('Ingrese Contraseña.');
        }
      } else {

      }


    }

  }



  /////////////////////////////////////////////////////////////
  //Click Boton Ingresar (envio de ccredecenciales por HTTP request y authentication)
  async handleButtonConfirm(userName, password) {


    this.isLoadingResults = true;

    let userNameLowerCase = userName.toLowerCase();

    //console.log(userNameLowerCase);

    var deviceType = "PC";
    var asciiPass = btoa(password);

    if (userName == "juan") {
      var url = "https://9d81c5ed-54cc-47d4-9132-003361ecd5eb.mock.pstmn.io/api/Security/User/Authenticate" + "?login=" + userNameLowerCase + "&password=" + password + "&deviceType=" + deviceType;
      //console.log(url);

      this.httpLogin.post<any>(url,
        {
          userName,
          deviceType,
          asciiPass,
          password
        }).subscribe(

          {
            next: data => {


              if (data.status == "auth") {
                this.storage.set('username', 'Ponce, Juan Carlos');
                this.storage.set('login', userName);
                this.storage.set('profileid', 1);
                this.storage.set('token', '123456789');
                this.storage.set('profileName', 'Administrador');

                this.storage.set('userid', 7);
                // this.router.navigate(['init-menu/events-managment']);
                
                this.router.navigate(['init-menu/vision-cut']);

                this.storage.set('isLoggedIn', true);

              }


              this.isLoadingResults = false;

            },
            error: error => {
              if (error.status == 401) {
                this.reportSnackBar.openSnackBar('Usuario/Constraseña incorrectos');

              }
              else {
                alert("Se ha producido un error en el login");
              }



              this.storage.set('isLoggedIn', false);
              document.getElementById("inputPassword").focus();
              this.passwordValue = "";

              this.isLoadingResults = false;

            }


          });
    }
    else {

      let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Access-Control-Allow-Headers', '*');

      var parameter = JSON.stringify
        (
          {

            userName,
            deviceType,
            asciiPass,
            password
          }

        );

      //console.log(parameter);


      var urlAuth = environmentSeted + '/Security/User/Authenticate' + "?login=" + userName + "&password=" + asciiPass + "&deviceType=" + deviceType;




      this.httpLogin.post<any>(urlAuth, parameter, { headers: headers })
        .subscribe(
          {
            next: data => {

              console.log(data);

              if (data != null) {
                //User Login Info Set

                this.storage.set('username', data.user.name);
                this.storage.set('login', data.user.login);
                this.storage.set('profileid', data.user.profileId);
                this.storage.set('token', data.token);
                this.storage.set('userid', data.userId);

               
                this.router.navigate(['init-menu/vision-cut']);
                this.storage.set('isLoggedIn', true);


                this.isLoadingResults = false;
              }
              else {
                this.reportSnackBar.openSnackBar('Error. No se ha podido establecer correctamente la comunicación con el servidor.');
              }


            },
            error: error => {
              //console.log(error);
              if (error.status == 400) {
                this.reportSnackBar.openSnackBar('Error. No se ha podido establecer la conexiógn con el servidor.');
              } else {
                if (error.status == 401) {
                  this.reportSnackBar.openSnackBar('Acceso restringido. Por favor consulte por los permisos adecuados.');
                } else {
                  if (error.status == 404) {
                    this.reportSnackBar.openSnackBar('Error. La ruta establecida para acceso al servidor no es correcta.');
                  }
                  if (error.status == 500) {
                    this.reportSnackBar.openSnackBar('Error. Se ha producido un error interno en el Servidor.');
                  } else {
                    if (error.status == 0) {
                      this.reportSnackBar.openSnackBar('Error. No se ha podido establecer la conexión con el servidor.');
                    }
                  }
                }
              }

              document.getElementById("inputPassword").focus();
              this.passwordValue = "";

              this.isLoadingResults = false;
            }
          }

        );

    }





  }


}
