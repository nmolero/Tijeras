import { ErrorStateMatcher } from '@angular/material/core';
import { Injectable } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Injectable()
export class DateErrorStateMatcher implements ErrorStateMatcher {


    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control && control.invalid);
        const invalidParent = !!(control && control.parent && control.parent.invalid);

        return (invalidCtrl || invalidParent);
    }

}
