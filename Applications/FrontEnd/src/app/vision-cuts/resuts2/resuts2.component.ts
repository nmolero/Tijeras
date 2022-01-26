import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resuts2',
  templateUrl: './resuts2.component.html',
  styleUrls: ['./resuts2.component.css']
})
export class Resuts2Component implements OnInit {

  Setup: number = 450;
  Medido: number = 170;
  MS: number = 10;
  Receta: number = 210;

  constructor() { }

  ngOnInit(): void {
  }

}
