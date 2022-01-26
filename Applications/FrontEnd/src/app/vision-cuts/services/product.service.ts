import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ProductsService {

  url: string = 'http://test-pc:5000/api/Pruebas/getPruebas';

  constructor(private http: HttpClient) { }

   getPruebas() : Observable<any>{
    return this.http.get(this.url);
  }
}
