import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-crud-panel',
  templateUrl: './crud-panel.component.html',
  styleUrls: ['./crud-panel.component.css']
})
export class CrudPanelComponent implements OnInit {

  constructor() { }


  @Input() header: string = "";
  @Input() collapsed: boolean = false;

  ngOnInit(): void {
  }

}
