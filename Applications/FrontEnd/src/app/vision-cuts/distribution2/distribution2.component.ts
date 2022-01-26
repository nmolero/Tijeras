import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-distribution2',
  templateUrl: './distribution2.component.html',
  styleUrls: ['./distribution2.component.css']
})
export class Distribution2Component implements OnInit {

  data: any;
  constructor() {
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Descole',
          data: [10, 39, 70, 1, 38, 36, 45],
          backgroundColor: 'lightGrey'
        }
      ]
    }
  }

  ngOnInit(): void {
  }

}
