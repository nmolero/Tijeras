import { Injectable } from '@angular/core';
import { inputTypes } from '../constants/crud.const';

@Injectable()
export class ValidateForm { //Exporta la clase para validar el formulario


    constructor() {//Para que este se inicialice sin siquiera instanciarlo
    }

    //Input array{value} - Output bool
    FormInputsValidation(data: any[]): boolean {//Se crea un objeto para validar las cajas de textos
        //console.log(data);
        let isValidState: boolean = true;
        if (data) {
            data.forEach(element => {
                if (element.disabled === false) {//Si cada elemento está disable, entonces que confirme cada caso, de lo contrario no funciona
                    switch (element.type) {
                        case inputTypes.INPUT_TEXT:
                            if ((element.value === '') || (element.value === null)) {
                                isValidState = false;
                                // En caso de que la caja este estrictamente vacía o nula, entonces va a ser igual a falso
                            }
                            break;

                        case inputTypes.DROPDOWN:
                            if ((element.value === null) || (element.value.id === 0)) {
                                isValidState = false;
                            }
                            break;

                        case inputTypes.CHECKBOX:
                            if ((element.value === "") || (element.value === null)) {
                                isValidState = false;
                            }
                            break;

                        case inputTypes.TEXT_AREA:
                            if ((element.value === "") || (element.value === null)) {
                                isValidState = false;
                            }
                            break;

                        case inputTypes.CASCADE:
                            if ((element.value === null) || (element.value.code === 'noSelection')) {
                                isValidState = false;
                            }
                        break;

                        case inputTypes.CALENDAR:
                            if (element.configuration.isNulleable !== undefined) {
                                if (!element.configuration.isNulleable) {
                                    if ((element.value === null)) {
                                        isValidState = false;
                                    }
                                }
                            }


                            break;

                        case inputTypes.CALENDAR:
                            if (element.configuration.isNulleable !== undefined) {
                                if (!element.configuration.isNulleable) {
                                    if ((element.value === null) || (element.value === '')) {
                                        isValidState = false;
                                    }
                                }
                            }
                            break;

                        default:
                            break;
                    }
                }
            });
        } else {
            isValidState = false;
        }


        return isValidState; //Por si todo es correcto
    }

}
