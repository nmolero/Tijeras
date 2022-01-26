import { Injectable } from '@angular/core';

//#region  - Este Injectable se encarga de el formato de fecha
@Injectable()
export class DateFormatter {

    constructor() {}

    //#region - InPut: Date Object - Output "YYYY-mm-ddT:HH:mm:dd" - Esta hecho así para que la salida sea con ese formato
    IsoFormatter(date: Date): string {
        // Declaro variables de fecha
        let year = date.getFullYear();//obtener el año cmpleto
        let month = date.getMonth() + 1;//obtener el mes y sumarlo de uno en uno
        let day = date.getDate();//obtener el día

        // Declaro variables de horario
        let hours = date.getHours();//obtener las horas
        let minutes = date.getMinutes();//obtener los minutos
        let seconds = date.getSeconds();//obtener los secundos

        // Al día y al mes lo paso a cadena
        let monthString = month.toString();
        let dayString = day.toString();

        if (monthString.length == 1) {
            monthString = '0' + monthString;
        }

        if (dayString.length == 1) {
            dayString = '0' + dayString;
        }

        // Al horario también los paso a cadena
        let hoursString = hours.toString();
        let minutesString = minutes.toString();
        let secondsString = seconds.toString();

        if (hoursString.length == 1) {
            hoursString = '0' + hoursString;
        }

        if (minutesString.length == 1) {
            minutesString = '0' + minutesString;
        }

        if (secondsString.length == 1) {
            secondsString = '0' + secondsString;
        }

        // Retorno todo el dato
        return (year + '-' + monthString + '-' + dayString + 'T' + hoursString + ':' + minutesString + ':' + secondsString);

    }
    //#endregion

    //Input : String(dd/MM/yyyy) OutPut : ISO Format
    StringIsoFormatter(date: string): string {
        let dateSplit: string[] = date.split('/');

        let day: string = dateSplit[0];
        let month: string = dateSplit[1];
        let year: string = dateSplit[2];

        if (day.length < 2) {
            day = '0' + day;
        }

        let monthNumber: number = parseInt(month);

        month = monthNumber.toString();

        if (month.length < 2) {
            month = '0' + month;
        }



        return year + '-' + month + '-' + day + 'T00:00:00';


    }


    //#region - Input : ISO - Output: 'yyyy-mm-dd' - Para que la salida sea de año - mes - día. Tanto para fecha y horario
    ISODateSplitFormatter(date: string): string {
        return date.split('T')[0];
    }
    ISOTimeSplitFormatter(date: string): string {
        return date.split('T')[1];
    }
    //#endregion

    //#region - Input: ISO - OutPut: 'dd/mm/yyyy' - Este es para dividir la fecha y cambiar el formato a string
    ISODateSplitAndStringFormatter(date: string): string {
        let dateSplit: string[] = date.split('T')[0].split('-');

        return dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0];
    }
    //#endregion

    //#region - Input : Date Object - Output:number []: [dd,mm,yyyy], es decir, que es el formato de matríz de fecha y la salida sea number y los guarda en un array
    DateArrayFormatter(date: Date): number[] {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        return [day, month, year];
    }
    //#endregion

    //#region - Input : Date Object -  Output:number []: [hh,mm,ss], lo mismo para este, para que la salidad sea de tipo number y también lo guarda en un array
    TimeArrayFormatter(date: Date): number[] {
        const hour = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return [hour, minutes, seconds];
    }
    //#endregion

    // Input String(dd/MM/yyyy) Output: Date Object

    StringDateObjectFormatter(date: string): Date {

        let dateSplit = date.split('/');

        return new Date(parseInt(dateSplit[2]), parseInt(dateSplit[1]) - 1, parseInt(dateSplit[0]));
    }


    //Input ISO  OutPut: Date Object

    ISODateObjectFormatter(date: string): Date {

        const dateIso: string = this.ISODateSplitFormatter(date);
        const timeIso: string = this.ISOTimeSplitFormatter(date);

        const dateIsoSplit: string[] = dateIso.split('-');
        const timeIsoSplit: string[] = timeIso.split(':');


        return new Date(parseInt(dateIsoSplit[0]), parseInt(dateIsoSplit[1]) - 1,
            parseInt(dateIsoSplit[2]), parseInt(timeIsoSplit[0]), parseInt(timeIsoSplit[1])
            , parseInt(timeIsoSplit[2]));
    }


}
