import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-range-grafic',
  templateUrl: './range-grafic.component.html',
  styleUrls: ['./range-grafic.component.css']
})
export class RangeGraficComponent implements OnInit {

  data: any;

  constructor() {
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Despunte',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: '#FC551B'
        },
        {
          label: 'Descole',
          data: [28, 48, 40, 19, 86, 27, 90],
          backgroundColor: 'grey'
        }
      ]
    }
   }

  ngOnInit(): void {
  }

}
