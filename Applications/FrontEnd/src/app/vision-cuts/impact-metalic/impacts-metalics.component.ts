import { Component, OnInit } from '@angular/core';

// Services
import { ImpactService } from '../services/impact.service';

@Component({
  selector: 'app-impacts-metalics',
  templateUrl: './impacts-metalics.component.html',
  styleUrls: ['./impacts-metalics.component.css']
})
export class ImpactsMetalicsComponent implements OnInit {

  impacts: any;
  constructor(private impact: ImpactService) { }

  despunte1 = 345;
  descole1 = 34;
  despunte2 = 50;
  descole2 = 56;
  getImpact(){
    this.impact.getImpactos().subscribe((result: any) => {
      this.impacts = result;
      console.log(result);
    });
  }

  ngOnInit(){
    this.getImpact();
  }

}
