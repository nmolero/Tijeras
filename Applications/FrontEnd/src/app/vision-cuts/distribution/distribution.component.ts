import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css']
})
export class DistributionComponent implements OnInit {

   data: any;

  constructor() {
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Despunte',
          data: [10, 39, 70, 81, 38, 26, 15],
          backgroundColor: '#FC551B'
        }
      ]
    }
   }

  ngOnInit(): void {
  }

}
