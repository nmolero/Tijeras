import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService {



    private dialogData$ = new BehaviorSubject({});//Hago una instancia
    dialogDataSharedMessage = this.dialogData$.asObservable();

    private saveDialogData$ = new BehaviorSubject({});
    saveDialogDataSharedMessage = this.saveDialogData$.asObservable();

    private deleteDialogData$ = new BehaviorSubject({});
    deleteDataSharedMessage = this.deleteDialogData$.asObservable();


    //Work Scheme

    private visbleAddDialog$ = new BehaviorSubject(false);
    visibleDialogSharedMessage = this.visbleAddDialog$.asObservable();


    //Eventual Schedule


    private deleteDialogDataEs$ = new BehaviorSubject({});
    deleteDataSharedMessageEs = this.deleteDialogDataEs$.asObservable();


    constructor() { }



    dialogDataValuesChange(message: any) {
        this.dialogData$.next(message)
    }

    saveDialogDataValuesChange(message: any) {
        this.saveDialogData$.next(message)
    }

    deleteDialogDataValuesChange(message: any) {
        this.deleteDialogData$.next(message)
    }

    //Work Scheme

    visibleAddDialogChange(message: any) {
        this.visbleAddDialog$.next(message)
    }

    //Eventual Schedule

    deleteDialogDataEsValuesChange(message: any) {
        this.deleteDialogDataEs$.next(message)
    }
}
