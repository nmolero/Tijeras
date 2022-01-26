import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ImpactService {

  url: string = 'http://test-pc:5000/api/Pruebas/getPruebasImpactos';

  constructor(private http: HttpClient) { }

   getImpactos() : Observable<any>{
    return this.http.get(this.url);
  }
}
