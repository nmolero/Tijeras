import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resuts',
  templateUrl: './resuts.component.html',
  styleUrls: ['./resuts.component.css']
})
export class ResutsComponent implements OnInit {

  A: number = 74;
  Setup: number = 150;
  Medido: number = 370;
  MS: number = 40;
  Receta: number = 410;


  constructor() { }

  ngOnInit(): void {
  }

}
