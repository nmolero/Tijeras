import { Injectable } from '@angular/core';
import { DateFormatter } from './date-formatter';


@Injectable()
export class DateCalculations {



    constructor(private dateFormatter: DateFormatter) {


    }

    //Calculate First Day of Month
    //Input Date - OutPut Date
    getFirstDayOfMonth(date: Date): Date {
        let dateSplitArray: number[] = this.dateFormatter.DateArrayFormatter(date);


        return new Date(dateSplitArray[2], dateSplitArray[1], 1);
    }

    //Calculate Last Day of Month
    //Input Date - OutPut Date
    getLastDayOfMonth(date: Date): Date {
        let dateSplitArray: number[] = this.dateFormatter.DateArrayFormatter(date);


        return new Date(dateSplitArray[2], dateSplitArray[1] + 1, 0, 23, 59, 59);
    }


    //Calculate Monday of current week
    //Input : Date - Output : Date
    getMondayOfWeek(date: Date): Date {

        let dateSplitArray: number[] = this.dateFormatter.DateArrayFormatter(date);

        let dayOfWeek: number = date.getDay() || 7;

        let monday: number = date.getDate() - dayOfWeek + 1;

        if (monday <= 0) {

            date.getMonth() - 1;

        }



        return new Date(dateSplitArray[2], dateSplitArray[1], monday);



    }


    getWeekOfYear(date: Date): number {

        var dateTime = date.getTime();
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        var week1 = new Date(date.getFullYear(), 0, 1);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
            - 3 + (week1.getDay() + 6) % 7) / 7);

    }


    //Calculate Yesterday Lapse of Time
    //Input Date - OutPut Date [begin,end]

    getYesterdayLapseOfTime(date: Date): Date[] {

        const dateSplitArray: number[] = this.dateFormatter.DateArrayFormatter(date);

        const beginDate: Date = new Date(dateSplitArray[2], dateSplitArray[1], dateSplitArray[0] - 1, 0, 0, 0);
        const endDate: Date = new Date(dateSplitArray[2], dateSplitArray[1], dateSplitArray[0] - 1, 23, 59, 59);


        return [beginDate, endDate];
    }


    //Calculate Yesterday Lapse of Time
    //Input Date - OutPut Date [begin,end]

    getTodayLapseOfTime(date: Date): Date[] {

        const dateSplitArray: number[] = this.dateFormatter.DateArrayFormatter(date);

        const beginDate: Date = new Date(dateSplitArray[2], dateSplitArray[1], dateSplitArray[0], 0, 0, 0);
        const endDate: Date = new Date(dateSplitArray[2], dateSplitArray[1], dateSplitArray[0], 23, 59, 59);


        return [beginDate, endDate];
    }

    //Calculate Last N Days Lapse of Time
    //Input number - OutPut Date [begin,end]
    getlastDaysLapseOfTime(days: number): Date[] {

        const today: Date = new Date();

        const dateSplitArray: number[] = this.dateFormatter.DateArrayFormatter(today);

        return [new Date(dateSplitArray[2], dateSplitArray[1], dateSplitArray[0] - days, 0, 0, 0), new Date(dateSplitArray[2], dateSplitArray[1], dateSplitArray[0], 23, 59, 59)];

    }


    //Calculate Last N Days Lapse of Time
    //Input number - OutPut Date [begin,end]
    getlastMonthLapseOfTime(month: number): Date[] {

        const today: Date = new Date();

        const dateSplitArray: number[] = this.dateFormatter.DateArrayFormatter(today);

        return [new Date(dateSplitArray[2], dateSplitArray[1] - month, dateSplitArray[0], 0, 0, 0), new Date(dateSplitArray[2], dateSplitArray[1], dateSplitArray[0], 23, 59, 59)];

    }


    //////////////////////////////////////////////////////////

    getLast8hs(date: Date): Date {


        const dateArray: number[] = this.dateFormatter.DateArrayFormatter(date);
        const timeArray: number[] = this.dateFormatter.TimeArrayFormatter(date);




        return new Date(dateArray[2], dateArray[1], dateArray[0], timeArray[0] - 8, timeArray[1], timeArray[2]);
    }





    ////////////////////////////////////////////////////////

    //Input seconds: number - Output dd días, hh:mm:ss
    getTimeBySeconds(seconds: number): string {

        const days: number = Math.trunc((seconds / 3600) / 24);

        const hour: number = (seconds / 3600);

        const minutes: number = (hour - Math.trunc(hour)) * 60;

        const secondsRemain: number = (minutes - Math.trunc(minutes)) * 60;

        return days + ' días, ' + Math.trunc(hour).toString().padStart(2, '0') + ':' + Math.trunc(minutes).toString().padStart(2, '0') + ':' + Math.trunc(secondsRemain).toString().padStart(2, '0');
    }
    ////////////////////////////////////////////////////////////


    //Input seconds: number - Output hh:mm:ss
    getHourTimeBySeconds(seconds: number): string {

        // const days: number = Math.trunc((seconds / 3600) / 24);

        const hour: number = (seconds / 3600);

        const minutes: number = (hour - Math.trunc(hour)) * 60;

        const secondsRemain: number = (minutes - Math.trunc(minutes)) * 60;

        return Math.trunc(hour).toString().padStart(2, '0') + ':' + Math.trunc(minutes).toString().padStart(2, '0') + ':' + Math.trunc(secondsRemain).toString().padStart(2, '0');
    }

}
