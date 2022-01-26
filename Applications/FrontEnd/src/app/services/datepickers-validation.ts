import { Injectable } from '@angular/core';
import { DateFormatter } from './date-formatter'


@Injectable()
export class DatePickersValidation {


    constructor(private dateFormatter: DateFormatter) {


    }


    //Two datepickers

    //Input : (dd/mm/yyyy) Output boolean - true : button disabled - false: button enabled

    HandleDatePickersAuth(beginDate, endDate): boolean {

        let beginDateObject = this.dateFormatter.StringDateObjectFormatter(beginDate);
        let endDateObject = this.dateFormatter.StringDateObjectFormatter(endDate);

        let beginDateSplit = beginDate.split('/');
        let endDateSplit = endDate.split('/');

        let NaNFlag = false;


        if ((beginDateSplit.length != 3) || (endDateSplit.length != 3)) {

            return true;


        } else {


            if ((beginDateSplit[0] == "") || (beginDateSplit[1] == "") || (beginDateSplit[2] == "") || (endDateSplit[0] == "") || (endDateSplit[1] == "") || (endDateSplit[2] == "")) {
                return true;

            } else {

                if ((isNaN(parseInt(beginDateSplit[0]))) || (isNaN(parseInt(beginDateSplit[1]))) || (isNaN(parseInt(beginDateSplit[2])))
                    || (isNaN(parseInt(endDateSplit[0]))) || (isNaN(parseInt(endDateSplit[1]))) || (isNaN(parseInt(endDateSplit[2])))) {
                    return true;
                } else {




                    if (beginDateObject.getTime() <= endDateObject.getTime()) {



                        if (!NaNFlag) {
                            return false;

                        } else {

                            return true;
                        }



                    }
                    else {

                        return true;
                    }




                }



            }

        }


    }


    //One datepickers

    //Input : (dd/mm/yyyy) Output boolean - true : button disabled - false: button enabled

    HandleOneDatePickersAuth(date): boolean {

        let dateObject = this.dateFormatter.StringDateObjectFormatter(date);


        let dateSplit = date.split('/');


        let NaNFlag = false;


        if ((dateSplit.length != 3)) {

            return true;


        } else {


            if ((dateSplit[0] == "") || (dateSplit[1] == "") || (dateSplit[2] == "")) {
                return true;

            } else {

                if ((isNaN(parseInt(dateSplit[0]))) || (isNaN(parseInt(dateSplit[1]))) || (isNaN(parseInt(dateSplit[2])))) {
                    return true;
                } else {




                    return false;



                }



            }

        }


    }


}
