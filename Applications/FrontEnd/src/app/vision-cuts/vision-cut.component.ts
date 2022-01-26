import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vision-cut',
  templateUrl: './vision-cut.component.html',
  styleUrls: ['./vision-cut.component.css']
})
export class VisionCutComponent implements OnInit {

  headerTitleLabel: string = "Visión Tijeras";

  Despunte: string = "Despunte";
  Descole: string = "Descole";

  constructor() { }

  ngOnInit(): void {
  }

}
