import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { inputTypes } from 'src/app/constants/crud.const';

//Services
import { HttpService } from '../../../../services/http-general-service';
import { HttpCrudService } from '../../../../services/http-crud-service';
import { SharedService } from '../../../../services/shared-service';
import { DateFormatter } from '../../../../services/date-formatter';
import { ValidateForm } from '../../../../services/validate-form';
import { DateCalculations } from 'src/app/services/date-calculations';



@Component({
  selector: 'app-wscheme-add-dialog',
  templateUrl: './wscheme-add-dialog.component.html',
  styleUrls: ['./wscheme-add-dialog.component.css'],
  providers: [ValidateForm]

})
export class WschemeAddDialogComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private httpCrudService: HttpCrudService,
    private validateForm: ValidateForm,
    public sharedService: SharedService,
    private dateFormatter: DateFormatter,
    private dateCalculations: DateCalculations
  ) { }

  @Input() header: string = "";
  // @Input() visible: boolean = false;
  @Input() data: any = null;
  @Input() weekDays: any = null;

  @Output() onHide = new EventEmitter<boolean>();


  private _visible: boolean = false;
  get visible(): any {
    return this._visible;
  }


  isConfirmButton: boolean = true;


  @Input()
  set visible(val: any) {
    //console.log('previous item = ', this._visible);
    //console.log('currently selected item=', val);
    this._visible = val;
    // this._visible = false;
  }

  //DayTime Selector
  days: any[] = [
    { label: 'Lunes', code: 'monday', weekDay: 1, value: false },
    { label: 'Martes', code: 'tuesday', weekDay: 2, value: false },
    { label: 'Miércoles', code: 'wednesday', weekDay: 3, value: false },
    { label: 'Jueves', code: 'thrusday', weekDay: 4, value: false },
    { label: 'Viernes', code: 'friday', weekDay: 5, value: false },
    { label: 'Sábado', code: 'saturday', weekDay: 6, value: false },
    { label: 'Domingo', code: 'sunday', weekDay: 7, value: false },
  ];

  //Calendars

  startTime: Date = null;
  endTime: Date = null;


  inputTypes: any = inputTypes;

  ngOnInit(): void {


    // this.sharedService.visibleDialogSharedMessage.subscribe(async message => {
    // console.log(message);
    // });

    const today: Date = new Date();

    const dateArray: number[] = this.dateFormatter.DateArrayFormatter(today);


    this.startTime = new Date(dateArray[2], dateArray[1], dateArray[1], 0, 0, 0);
    this.endTime = new Date(dateArray[2], dateArray[1], dateArray[1], 23, 59, 59);

  }


  ////////////////////////////////////////////////////////

  HandleDialogHide(e) {
    this.data.weekDays = []
    this.onHide.emit(true);
  }


  //////////////////////////////////////////////////////

  async HandleConfirmButton() {

    let data: any = {
      weekDays: []
    }



    console.log(this.daysDataConfig);


    this.data.formData.forEach(item => {
      switch (item.type) {
        case inputTypes.INPUT_TEXT:
          data[item.dbName] = item.value;
          break;
        case inputTypes.DROPDOWN:
          data[item.dbName] = item.value.id;
          break;
        case inputTypes.CASCADE:
          data[item.dbName] = item.value.text;
          break;
        default:
          break;
      }

    });

    if (this.data.workSchemeId !== 0) {
      data['workSchemeId'] = this.data.workSchemeId;
    }


    if (!this.data.noWeekDays) {

      let weekDays: any[] = [];

      this.daysDataConfig.forEach(dConfig => {

        const days: any[] = dConfig.weekDays.filter(item => item.value === true);


        days.forEach(item => {
          weekDays = [
            {
              weekDay: item.weekDay,
              endTime: this.dateFormatter.IsoFormatter(dConfig.endTime),
              startTime: this.dateFormatter.IsoFormatter(dConfig.startTime)
            },
            ...weekDays
          ]
        });


      });

      data.weekDays = weekDays;
      // data.weekDays = this.days.filter(item => item.value === true).map(item => {
      //   return {
      //     startTime: this.dateFormatter.IsoFormatter(this.startTime),
      //     endTime: this.dateFormatter.IsoFormatter(this.endTime),
      //     weekDay: item.weekDay,
      //   }
      // });

      console.log(data);

      this.sharedService.saveDialogDataValuesChange(data);
      this.sharedService.saveDialogDataValuesChange({});

    } else {

      this.httpCrudService.postAddWorkSchemeMachine(data);

    }



    //console.log(data);

    // console.log(dataArray);
    // await this.httpCrudService.postEventClass_Save(dataArray).then(
    //   data => {
    //     //console.log(data);
    //   }
    // );



  }

  //////////////////////////////////////////////

  HandleValidateForm() {

    const isValidState: boolean = this.validateForm.FormInputsValidation(this.data.formData);

    if (isValidState) {
      this.isConfirmButton = false;
    } else {
      this.isConfirmButton = true;
    }

    this.HandleValidateCalendars();

  }

  GetObjectProperties(data: any) {

    data.map(item => ({

    }));
    const keys: string[] = Object.getOwnPropertyNames(data);

  }

  ///////////////////////////////////////////////////

  daysDataConfig: any[] = []

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    const currentItem: SimpleChange = changes.visible;
    //console.log('prev value: ', currentItem.previousValue);
    //console.log('got item: ', currentItem.currentValue);
    if (currentItem.currentValue === true) {


      let startTimeArray: string[] = [];
      let endTimeArray: string[] = [];

      this.data.weekDays.forEach(
        (element) => {
          startTimeArray.push(element.startTime);
          endTimeArray.push(element.endTime);
        }
      );

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      const uniqueST = startTimeArray.filter(onlyUnique);
      const uniqueET = endTimeArray.filter(onlyUnique);

      //console.log(uniqueST, uniqueET);

      if (uniqueST.length >= uniqueET.length) {

        uniqueST.forEach(uST => {

          uniqueET.forEach(uET => {
            const weekDays = this.data.weekDays.filter(wday => {

              return ((wday.startTime === uST) && (wday.endTime === uET))
            });
            //console.log(weekDays);

            if (weekDays.length > 0) {
              let days = [
                { label: 'Lunes', code: 'monday', weekDay: 1, value: false },
                { label: 'Martes', code: 'tuesday', weekDay: 2, value: false },
                { label: 'Miércoles', code: 'wednesday', weekDay: 3, value: false },
                { label: 'Jueves', code: 'thrusday', weekDay: 4, value: false },
                { label: 'Viernes', code: 'friday', weekDay: 5, value: false },
                { label: 'Sábado', code: 'saturday', weekDay: 6, value: false },
                { label: 'Domingo', code: 'sunday', weekDay: 7, value: false },
              ];

              days.forEach(dayItem => {

                if (weekDays.find(wDayitem => wDayitem.weekDay === dayItem.weekDay) !== undefined) {

                  dayItem.value = true;


                } else {
                  dayItem.value = false;
                }

              });

              this.daysDataConfig = [
                {
                  weekDays: days,
                  startTime: this.dateFormatter.ISODateObjectFormatter(uST),
                  endTime: this.dateFormatter.ISODateObjectFormatter(uET)
                },
                ...this.daysDataConfig
              ]
            }
          });

        });
      } else {

      }

      console.log(this.daysDataConfig);

      this.days.forEach(dayItem => {

        if (this.data.weekDays.find(wDayitem => wDayitem.weekDay === dayItem.weekDay) !== undefined) {

          dayItem.value = true;


        } else {
          dayItem.value = false;
        }

      });

      if (this.data.weekDays.length > 0) {
        this.startTime = this.data.weekDays[0].startTime ? this.dateFormatter.ISODateObjectFormatter(this.data.weekDays[0].startTime) : new Date;
        this.endTime = this.data.weekDays[0].endTime ? this.dateFormatter.ISODateObjectFormatter(this.data.weekDays[0].endTime) : new Date;
      }

      if (this.data.noWeekDays) {
        this.HandleValidateMachineForm();
      } else {
        this.HandleValidateForm();
      }


    } else {
      this.daysDataConfig = []
    }

  }

  //////////////////////////////////

  HandleValidateCalendars() {
    if ((this.startTime !== null) && (this.endTime !== null)) {
      const startTime: string = this.dateFormatter.ISOTimeSplitFormatter(this.dateFormatter.IsoFormatter(this.startTime));
      const endTime: string = this.dateFormatter.ISOTimeSplitFormatter(this.dateFormatter.IsoFormatter(this.endTime));
      if (startTime >= endTime) {
        this.isConfirmButton = true;
      } else {
        this.isConfirmButton = false;
      }

    } else {
      this.isConfirmButton = true;
    }


  }


  //////////////////////////////////////

  HandleValidateMachineForm() {

    const isValidState: boolean = this.validateForm.FormInputsValidation(this.data.formData);

    if (isValidState) {
      this.isConfirmButton = false;
    } else {
      this.isConfirmButton = true;
    }

  }

  /////////////////////////////////////////////

  HandleAddConfigWeek() {

    const today: Date[] = this.dateCalculations.getTodayLapseOfTime(new Date());
    this.daysDataConfig = [
      {
        weekDays: [
          { label: 'Lunes', code: 'monday', weekDay: 1, value: false },
          { label: 'Martes', code: 'tuesday', weekDay: 2, value: false },
          { label: 'Miércoles', code: 'wednesday', weekDay: 3, value: false },
          { label: 'Jueves', code: 'thrusday', weekDay: 4, value: false },
          { label: 'Viernes', code: 'friday', weekDay: 5, value: false },
          { label: 'Sábado', code: 'saturday', weekDay: 6, value: false },
          { label: 'Domingo', code: 'sunday', weekDay: 7, value: false },
        ],
        startTime: today[0],
        endTime: today[1]
      }
      , ...this.daysDataConfig
    ]
  }


}
