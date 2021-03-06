import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Table } from 'primeng/table';


//#region - Acá estan las importaciones

import { ReportSnackBar } from '../../shared/components/report-snack-bar/report-snack-bar';
import { UserConfigurationData } from '../../services/user-configuration';
import { HttpService } from '../../services/http-general-service';
import { HttpCrudService } from '../../services/http-crud-service';
import { SharedService } from '../../services/shared-service';
import { ActivatedRoute, Router } from '@angular/router';
import { inputTypes } from 'src/app/constants/crud.const';
import { DateFormatter } from 'src/app/services/date-formatter';
import { ValidateForm } from '../../services/validate-form';
import { actions } from 'src/app/constants/events.const';
//#endregion


@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
  providers: [
    MessageService,
    ReportSnackBar,
    UserConfigurationData,
    HttpService,
    HttpCrudService,
    ValidateForm
  ]
})
export class EventFormComponent implements OnInit {

  //#region - Este es el contructor para que se inicie solo sin ser instanciado
  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService, private router: Router,
    private route: ActivatedRoute, private dateFormatter: DateFormatter,
    private messageService: MessageService, private httpService: HttpService,
    private httpCrudService: HttpCrudService, public sharedService: SharedService,
    private reportSnackBar: ReportSnackBar, private userDataService: UserConfigurationData,
    private validateForm: ValidateForm
  ) { }
  //#endregion

  //#region - BlockUi - para la pantalla
  isLoadingResults: boolean = false;

  headerTitleLabel: string = "";
  confirmButtonLabel: string = "";
  collapsed: boolean = true;

  formData: any = null;

  inputTypes = inputTypes;

  isConfirmButtonDisabled: boolean = true;
  //#endregion

  //#region - Este ngOnInit recibe los datos de la validación del formulario
  ngOnInit() {
    let data: string = "";

    this.route
    	.queryParams
    	.subscribe(params => {
    	// Defaults to 0 if no query param provided.
        data = params['data']
      });

    this.formData = JSON.parse(data);

    this.formData.elements.forEach(element => {//Hago un recorrido para cada elemento de la fecha

      if (element.type === inputTypes.CALENDAR) { //Di el tipo de elemento es igual a lo que está en el calendario, entonces que sea true
        if (element.value !== null) {//Ahora, si el valor es nulo entonces la fecha sea un formato aleatorio
          element.value = this.dateFormatter.ISODateObjectFormatter(element.value);
        }
      }
    });

    this.headerTitleLabel = this.formData.headerTitleLabel;
    this.confirmButtonLabel = this.formData.confirmButtonLabel;

    console.log(this.formData);
    this.HandleValidateForm();
  }
  //#endregion

  // #region - Método que se ocupa de revisar la validación de los campos en el formulario
  HandleValidateForm() {

    const isValidState: boolean = this.validateForm.FormInputsValidation(this.formData.elements);

    if (isValidState) {
      this.isConfirmButtonDisabled = false;
    } else {
      this.isConfirmButtonDisabled = true;
    }

  }
  //#endregion

  //#region - Método asincrono que se encarga de confirmar los datos ya declarados o por si también hay algún cambio
  async HandleConfirmButton() {

    this.isLoadingResults = true;
    let data: any = {};
    switch (this.formData.action) {
      // Acción para añadir
      case actions.ADD:
        data = {
          EventClassId: parseInt(this.formData.elements.find(item => item.label === 'Causa').value.ref_),
          StartTime: this.dateFormatter.IsoFormatter(this.formData.elements.find(item => item.label === 'Inicio').value),
          EndTime: this.dateFormatter.IsoFormatter(this.formData.elements.find(item => item.label === 'Fin').value),
          Area: this.formData.elements.find(item => item.label === 'Área').value.id,
          Equipmentid: this.formData.elements.find(item => item.label === 'Máquina').value.id,
          MainElementId: parseInt(this.formData.elements.find(item => item.label === 'Elemento Principal').value.ref_),
          Product: this.formData.elements.find(item => item.label === 'Producto').value.id,
          Comments: this.formData.elements.find(item => item.label === 'Observaciones').value,
        }

        await this.httpCrudService.postAddManualEvent(data).then(data => {
          console.log(data);
          this.DisplayToastAndUpdateTable(data);
        });
      break;

      // Acción para declarar
      case actions.DECLARE:
        if(this.formData.elements.find(item => item.label === 'Elemento Principal').value.ref_ === undefined){
          data = {
            eventId: this.formData.eventId,
            EventClassId: parseInt(this.formData.elements.find(item => item.label === 'Causa').value.ref_),
            Comments: this.formData.elements.find(item => item.label === 'Observaciones').value
          }
        }
        else{
          //console.log('******Con valor******0);
          data = {
            eventId: this.formData.eventId,
            EventClassId: parseInt(this.formData.elements.find(item => item.label === 'Causa').value.ref_),
            MainElementId: parseInt(this.formData.elements.find(item => item.label === 'Elemento Principal').value.ref_),
            Coments: this.formData.elements.find(item => item.label === 'Observaciones').value
          }
        }
        console.log(data);

        await this.httpCrudService.postDeclareManualEvent(data).then(data => {
          //console.log("DECLARE");
          this.DisplayToastAndUpdateTable(data);
        });
      break;

      // Acción para dividir
      case actions.SPLIT:
        data = {
          EventClassId: parseInt(this.formData.elements.find(item => item.label === 'Causa').value.ref_),
          StartTime: this.dateFormatter.IsoFormatter(this.formData.elements.find(item => item.label === 'Inicio').value),
          EndTime: this.dateFormatter.IsoFormatter(this.formData.elements.find(item => item.label === 'Fin').value),
          Area: this.formData.elements.find(item => item.label === 'Área').value.id,
          Equipmentid: this.formData.elements.find(item => item.label === 'Máquina').value.id,
          MainElementId: parseInt(this.formData.elements.find(item => item.label === 'Elemento Principal').value.ref_),
          Product: this.formData.elements.find(item => item.label === 'Producto').value.id,
          Comments: this.formData.elements.find(item => item.label === 'Observaciones').value,
        }

        // await this.httpCrudService.postDividerManualEvents(data).then(data => {
        //   console.log(data);
        //   this.DisplayToastAndUpdateTable(data);
        // });
      break;

      default:
      break;
    }

    this.isLoadingResults = false;
  }
  //#endregion

  //#region - Método que muestra los resultados de los datos y los actualiza

  // Con este regreso al menú principal
  async HandleCancelButton() {
     this.router.navigate(['/init-menu/events-managment']);
    }

  async DisplayToastAndUpdateTable(data: any) {
    if (data !== null) {
      if (((data.deleteRecords > 0) || (data.newRecords > 0) || (data.updateRecords > 0))) {
        // await this.getUsers();

        this.isLoadingResults = false;

        this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'success', summary: 'Completado', detail: 'Se han declarado los datos correctamente' });
        this.router.navigate(['../init-menu/events-managment']);

      } else {

        this.isLoadingResults = false;
        if (data.newRecords === -1) {
          this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'La máquina especificada no posee eventos registrados.' });
        }

        if (data.newRecords === -2) {
          this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'No se puede agregar el evento (solapamiento temporal). Verifique el rango temporal y vuelva a intentar.' });
        }

        this.ShowUnAuthorizeToast(data);

      }


    } else {
      this.isLoadingResults = false;

      this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
    }
  }
  //#endregion

  // #region - Método que se encargar de mostrar los toast no autorizadas
  ShowUnAuthorizeToast(data: any) {

    if (data !== null) {
      if ((data.error !== undefined) && (data.error !== null)) {
        if (data.status === 401) {
          this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Operación Denegada. Consulte por los permisos adecuados para realizar la siguiente acción.' });
        }
      }
    } else {
      this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
    }


  }
  //#endregion
  // -------------------------------------------------------------------------------------------------------------

  // Esta sección es para mostrar la tabla en los eventos

}
