import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable()
export class ReportSnackBar {

    constructor(private snackBar: MatSnackBar) { }


    ///////////////////////////////////////////////////////////////
    //Configuración SnackBar , notificación de carga de informes

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    durationInSeconds = 3;
    statusMsj = "";

    openSnackBar(statusMsj) {

        this.snackBar.open(statusMsj, 'Cerrar', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }




}
