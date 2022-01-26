import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable()
export class AuthGuardService implements CanActivate {


  // you would usually put this in it's own service and not access it directly!
  // this is just for the sake of the demo.
  //isLoggedIn: boolean = false;



  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private router: Router
  ) { }



  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    // Digo que si este almacenamiento obtenido está registrado
    if (this.storage.get('isLoggedIn') == true) {
      return true; //Entonces que me devuelva verdadero
    }
    else {
      return false; //De lo contrario no existe
    }

  }



}
