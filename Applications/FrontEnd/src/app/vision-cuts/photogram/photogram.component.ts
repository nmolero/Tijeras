import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-photogram',
  templateUrl: './photogram.component.html',
  styleUrls: ['./photogram.component.css']
})
export class PhotogramComponent implements OnInit {

  Despunte: string;
  Descole: string;

  constructor() { }

  ngOnInit(): void {
  }

}
