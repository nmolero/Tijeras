import { Component, OnInit } from '@angular/core';

// Interface & Services
import { ProductsService } from '../services/product.service';

@Component({
  selector: 'app-register-table',
  templateUrl: './register-table.component.html',
  styleUrls: ['./register-table.component.css']
})
export class RegisterTableComponent implements OnInit {

  pruebas: any;
  constructor(private product: ProductsService) { }

  getPrueba(){
    this.product.getPruebas().subscribe((result: any) => {
      this.pruebas = result;
      console.log(result);
    });
  }

  ngOnInit(): void {
    this.getPrueba();
  }

}
