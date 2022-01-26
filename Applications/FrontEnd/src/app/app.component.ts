import { Component, OnInit } from '@angular/core';
import { slideInAnimation } from './animations';
import { RouterOutlet, Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation],
})
export class AppComponent implements OnInit {
  title = 'WebAppSTA2';

  constructor(private primengConfig: PrimeNGConfig) {

  }
  ngOnInit() {

    this.primengConfig.ripple = true;

    //#region - Estilos y muestras
    //const tabId: number = browser.tabs.getCurrent()

    //document.body.style.resize= '75%';
    //document.body.style['zoom'] = '80%';

    //document.body.style.min
    //document.body.style.fontSize = '6px';
    //document.body.style.webkitTransform = 'scale(0.8)';
    //console.log(tabId);

    // document.body.style.height = '100%';
    // document.body.style.width = '100%';

    //document.body.style.height = document.getElementById("appComponent").clientHeight + 'px';
    //document.body.style.width = document.getElementById("appComponent").clientWidth + 'px';
    //console.log(document.getElementById("body").clientHeight);
    //console.log(document.getElementById("body").clientWidth);

    //document.body.style.transform = 'scale(0.9,0.9)';
    //document.body.style. =
    //window.zo
    //#endregion

  }

  getAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
