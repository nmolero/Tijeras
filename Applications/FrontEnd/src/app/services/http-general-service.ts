import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

//Services
import { UserConfigurationData } from '../services/user-configuration';

@Injectable()
export class HttpService {

    constructor(
        private httpClient: HttpClient, @Inject(SESSION_STORAGE) private storage: StorageService,
        private userConfigurationData: UserConfigurationData,
    ) {


    }


    //token
    token: string = this.storage.get('token');

    //Url getItem

    hostUrl: string = sessionStorage.getItem('url');


    //Headears

    headersGet = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8')
        .set('sessionToken', this.token)
        .set('userName', this.userConfigurationData.userData.userName);

    headersPost = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8')
        .set('sessionToken', this.token)
        .set('userName', this.userConfigurationData.userData.userName);


    //GET

    async getInfoApp(): Promise<any> {
        let url = this.hostUrl + '/InfoSystem/getInfoApp';

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                } else {
                    requestData = null;
                }

            },
            error => {
                console.log(error);
                requestData = null;
            }
        );

        return requestData;
    }


    async getPruebas(): Promise<boolean> {
        let url = this.hostUrl + '/Pruebas/getPruebas';

        let requestData: boolean = null;

        await this.httpClient.get<boolean>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                } else {
                    requestData = null;
                }

            },
            error => {
                // console.log(error);
                requestData = null;
            }
        );

        return requestData;
    }



    /////////////////////////////////////////////////////////77
    //Test  PI Web TXT Files
    async getPIWebAPI_P(): Promise<boolean> {
        let url = this.hostUrl + '/Pruebas/getPIWebAPI_P';

        let requestData: boolean = null;

        await this.httpClient.get<boolean>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                } else {
                    requestData = null;
                }

            },
            error => {
                // console.log(error);
                requestData = null;
            }
        );

        return requestData;
    }


    async getPIWebAPI_ConsArch_P(nameFile: string): Promise<any> {

        let url = "";

        if (nameFile != "") {
            url = this.hostUrl + '/Pruebas/getPIWebAPI_ConsArch_P' + '?nameFile=' + nameFile;
        } else {
            url = this.hostUrl + '/Pruebas/getPIWebAPI_ConsArch_P';
        }

        //console.log(url);
        let requestData: boolean = null;

        await this.httpClient.get<boolean>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                } else {
                    requestData = null;
                }

            },
            error => {
                // console.log(error);
                requestData = null;
            }
        );

        return requestData;
    }

    async getPIWebAPI_ConsultasII_P(nameFile: string): Promise<any> {

        let url = "";

        if (nameFile != "") {
            url = this.hostUrl + '/Pruebas/getPIWebAPI_ConsultasII_P' + '?Link=' + nameFile;
        } else {
            url = this.hostUrl + '/Pruebas/getPIWebAPI_ConsultasII_P';
        }

        //console.log(url);
        let requestData: boolean = null;

        await this.httpClient.get<boolean>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                } else {
                    requestData = null;
                }

            },
            error => {
                // console.log(error);
                requestData = null;
            }
        );

        return requestData;
    }

    ///////////////////////////////////////////////////////////////////7
    //PI Web API


    async getQueryPIWebAPI(link: string): Promise<any> {

        let url = "";

        if (link != "") {
            url = this.hostUrl + '/queryPIWebAPI/getQueryPIWebAPI' + '?Link=' + link;
        } else {
            url = this.hostUrl + '/queryPIWebAPI/getQueryPIWebAPI';
        }

        //console.log(url);
        let requestData: boolean = null;

        await this.httpClient.get<boolean>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                } else {
                    requestData = null;
                }

            },
            error => {
                // console.log(error);
                requestData = null;
            }
        );

        return requestData;
    }

    //////////////////////////////////////////////////////////7
    //System Parameter

    async getSystemParameter(nameSystemModule: string): Promise<any> {

        let url = this.hostUrl + '/TableQuery/getSystemParameter' + '?nameSystemModule=' + nameSystemModule;

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                } else {
                    requestData = null;
                }

            },
            error => {
                // console.log(error);
                requestData = null;
            }
        );

        return requestData;
    }

    ////////////////////////////////////////////////////////////////////////////7
    //Events

    async getEventBDD(date: string): Promise<any> {

        let url = this.hostUrl + '/TableQuery/getEventBDD' + '?startDate=' + date;

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                } else {
                    requestData = null;
                }

            },
            error => {
                // console.log(error);
                requestData = null;
            }
        );

        return requestData;
    }

    async getEventSpecial(startDate: string, endDate: string): Promise<any> {

        let url = this.hostUrl + '/TableQuery/getEventSpecial' + '?startDate=' + startDate + '&endDate= ' + endDate;

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                } else {
                    requestData = null;
                }

            },
            error => {
                // console.log(error);
                requestData = null;
            }
        );

        return requestData;
    }


    async getUserTableProperty(userId: number, tablePropertyName: string): Promise<any> {

        let url = this.hostUrl + '/TableQuery/getUserTableProperty' + '?userId=' + userId
            + '&tablePropertyName= ' + tablePropertyName;

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                } else {
                    requestData = null;
                }

            },
            error => {
                // console.log(error);
                requestData = null;
            }
        );

        return requestData;
    }


    getManualEventReImport

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Tree Nodes - Equipment

    async getEquipmentTreeById(id: number): Promise<any> {

        let url = this.hostUrl + '/TableQuery/getEquipmentTree' + '?equipmentId=' + id;

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                } else {
                    requestData = null;
                }

            },
            error => {
                // console.log(error);
                requestData = null;
            }
        );

        return requestData;
    }


    async getEquipmentTreeByName(name: string = ""): Promise<any> {

        let url = this.hostUrl + '/TableQuery/getEquipmentTree' + '?equipmentName=' + name;

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                } else {
                    requestData = null;
                }

            },
            error => {
                // console.log(error);
                requestData = null;
            }
        );

        return requestData;
    }


    //Event Class


    async getEventClassTree(name: string = ""): Promise<any> {

        let url = this.hostUrl + '/TableQuery/getEventClassTree' + '?eventClassName=' + name;

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                } else {
                    requestData = null;
                }

            },
            error => {
                // console.log(error);
                requestData = null;
            }
        );

        return requestData;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////

    //POST


    async postSystemParameter_Save(data: any): Promise<any> {

        let url = this.hostUrl + "/TableSave/postSystemParameter_Save";


        var parameters = JSON.stringify(

            data
        );

        let httpResult: number = 0;

        await this.httpClient.post<any>(url, parameters, { headers: this.headersPost }).toPromise().then(
            data => {

                //console.log(data);

                if ((data != undefined) || (data != null)) {


                    httpResult = data;


                } else {
                    //Corrupted or Null Data
                    httpResult = null;
                }
            },
            error => {
                if (error.status === 401) {
                    httpResult = error;
                }
            }
        );

        return httpResult;



    }

    /////////////////////////////////////////////7
    //UserTableProperty

    async postAddUserTablePropertyValueClass(data: any): Promise<any> {

        let url = this.hostUrl + "/TableSave/postAddUserTablePropertyValueClass";


        var parameters = JSON.stringify(

            data
        );

        let httpResult: number = 0;

        await this.httpClient.post<any>(url, parameters, { headers: this.headersPost }).toPromise().then(
            data => {

                //console.log(data);

                if ((data != undefined) || (data != null)) {


                    httpResult = data;


                } else {
                    //Corrupted or Null Data
                    httpResult = null;
                }
            },
            error => {
                if (error.status === 401) {
                    httpResult = error;
                }
            }
        );

        return httpResult;



    }

    async postUpdateUserTablePropertyValue(data: any): Promise<any> {

        let url = this.hostUrl + "/TableSave/postUpdateUserTablePropertyValue";


        var parameters = JSON.stringify(

            data
        );

        let httpResult: number = 0;

        await this.httpClient.post<any>(url, parameters, { headers: this.headersPost }).toPromise().then(
            data => {

                //console.log(data);

                if ((data != undefined) || (data != null)) {


                    httpResult = data;


                } else {
                    //Corrupted or Null Data
                    httpResult = null;
                }
            },
            error => {
                if (error.status === 401) {
                    httpResult = error;
                }
            }
        );

        return httpResult;



    }

    async postDeleteUserTablePropertyValue(data: any): Promise<any> {

        let url = this.hostUrl + "/TableDelete/postDeleteUserTablePropertyValue";


        var parameters = JSON.stringify(

            data
        );

        let httpResult: number = 0;

        await this.httpClient.post<any>(url, parameters, { headers: this.headersPost }).toPromise().then(
            data => {

                //console.log(data);

                if ((data != undefined) || (data != null)) {


                    httpResult = data;


                } else {
                    //Corrupted or Null Data
                    httpResult = null;
                }
            },
            error => {
                if (error.status === 401) {
                    httpResult = error;
                }
            }
        );

        return httpResult;



    }










}
