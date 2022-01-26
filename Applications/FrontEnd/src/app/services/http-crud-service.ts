import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

//Services
import { UserConfigurationData } from '../services/user-configuration';

@Injectable()
export class HttpCrudService {

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
    //UsersController

    async getUsers(): Promise<any> {
        let url = this.hostUrl + '/Users/getUsers';

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
                //console.log(error);
                if (error.status === 401) {
                    requestData = error;
                }
            }
        );

        return requestData;
    }


    //Profiles Controller
    async getProfiles(): Promise<any> {
        let url = this.hostUrl + '/Profiles/getProfiles';

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }

    async getProfilesData(): Promise<any> {
        let url = this.hostUrl + '/Profiles/getProfilesData';

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }


    ///////////////////////////////////////////////////////////////////
    //SystemSettings Controller

    async getSystemSettings(): Promise<any> {
        let url = this.hostUrl + '/SystemSettings/getSystemSettings';

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
                //console.log(error);
                if (error.status === 401) {
                    requestData = error;
                }
            }
        );

        return requestData;
    }

    /////////////////////////////////////////////////////////////////////
    //System Modules Controller
    async getSystemModulesDropDown(): Promise<any> {
        let url = this.hostUrl + '/SystemModules/getSystemModulesDropDown';

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }

    async getSystemModules(): Promise<any> {
        let url = this.hostUrl + '/SystemModules/getSystemModules';

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }


    async getSystemModulesByProfileId(profileId: number): Promise<any> {
        let url = this.hostUrl + '/SystemModules/getSystemModulesByProfileId'
            + '?profileId=' + profileId;

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }


    /////////////////////////////////////////////////////////////////////
    //Event- Class Controller

    async getEventParentClass(): Promise<any> {
        let url = this.hostUrl + '/TableQuery/getEventClass';

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }

    async getAllSubCauseEventClass(): Promise<any> {
        let url = this.hostUrl + '/TableQuery/getSubCauseEventClass';

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }

    async getSubCauseEventClass(eventParentClass: string): Promise<any> {
        let url = this.hostUrl + '/TableQuery/getEventClass' + '?eventParentClass=' + eventParentClass;

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }


    ///////////////////////////////////////////////
    //Event Class Type


    async getEventClassType(): Promise<any> {
        let url = this.hostUrl + '/TableQuery/getEventClassType';

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }


    ///////////////////////////////////////////////
    //Equipment


    async getEquipmentByType(type: string): Promise<any> {
        let url = this.hostUrl + '/TableQuery/getEquipmentByType' + '?type=' + type;

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }


    ///////////////////////////////////////////////
    //WorkScheme


    async getWorkScheme(): Promise<any> {
        let url = this.hostUrl + '/TableQuery/getWorkScheme';

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }

    ////////////////////////////////////////////////////77
    //Work Schedule

    async getWorkSchedule(): Promise<any> {
        let url = this.hostUrl + '/TableQuery/getWorkSchedule';

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }

    ////////////////////////////////////////////////////77
    //Rotation

    async getRotation(): Promise<any> {
        let url = this.hostUrl + '/TableQuery/getRotation';

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }


    ////////////////////////////////////////////////////77
    //Event Schedule

    async getEventualSchedule(): Promise<any> {
        let url = this.hostUrl + '/TableQuery/getEventualSchedule';

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }



    ///////////////////////////////////////////////////////////////
    //getWorkSchemeEquipmentEventClass


    async getWorkSchemeEquipmentEventClass(): Promise<any> {
        let url = this.hostUrl + '/TableQuery/getWorkSchemeEquipmentEventClass';

        let requestData: any = null;

        await this.httpClient.get<any>(url, { headers: this.headersGet }).toPromise().then(
            data => {
                //console.log(data);
                if (data != null) {
                    requestData = data;
                }

            },
            error => {

                //console.log(error);

                if (error.status === 401) {
                    requestData = error;
                }

            }
        );

        return requestData;
    }



    //////////////////////////////////////////////////////////////////////////////////////////////

    //POST

    //Users Controller

    async postAddUser(userData: any): Promise<any> {

        let url = this.hostUrl + "/Users/postAddUser";


        var parameters = JSON.stringify(

            userData
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


    async postDeleteUser(ids: number[]): Promise<any> {

        let url = this.hostUrl + "/Users/postDeleteUser";


        var parameters = JSON.stringify(

            ids
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


    async postEditUser(userData: any): Promise<any> {

        let url = this.hostUrl + "/Users/postEditUser";


        var parameters = JSON.stringify(

            userData
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

    /////////////////////////////////////////////////////

    //Profiles Controller


    async postAddProfile(data: any): Promise<any> {

        let url = this.hostUrl + "/Profiles/postAddProfile";


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


    async postDeleteProfiles(data: any): Promise<any> {

        let url = this.hostUrl + "/Profiles/postDeleteProfiles";


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


    async postEditProfile(data: any): Promise<any> {

        let url = this.hostUrl + "/Profiles/postEditProfile";


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

    /////////////////////////////////////////////////////////

    //System Settings Controller


    async postAddSystemKey(data: any): Promise<any> {

        let url = this.hostUrl + "/SystemSettings/postAddSystemKey";


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


    async postEditSystemSetting(data: any): Promise<any> {

        let url = this.hostUrl + "/SystemSettings/postEditSystemSetting";


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


    async postDeleteSystemSettings(data: any): Promise<any> {

        let url = this.hostUrl + "/SystemSettings/postDeleteSystemSettings";


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

    /////////////////////////////////////////////////
    //System Modules Controller


    async postAddSystemModule(data: any): Promise<any> {

        let url = this.hostUrl + "/SystemModules/postAddSystemModule";


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


    async postEditSystemModule(data: any): Promise<any> {

        let url = this.hostUrl + "/SystemModules/postEditSystemModule";


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


    async postDeleteSystemModules(data: any): Promise<any> {

        let url = this.hostUrl + "/SystemModules/postDeleteSystemModules";


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


    //Permissions

    async postAddPermission(data: any): Promise<any> {

        let url = this.hostUrl + "/TableSave/postAddPermission";


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

    async postDeletePermissions(data: any): Promise<any> {

        let url = this.hostUrl + "/TableDelete/postDeletePermissions";


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




    async postAddProfileWithPermission(data: any): Promise<any> {

        let url = this.hostUrl + "/Profiles/postAddProfileWithPermission";


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

    ///////////////////////////////////////////////////
    //EventClass

    async postEventClass_Save(data: any): Promise<any> {

        let url = this.hostUrl + "/TableSave/postEventClass_Save";


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

    async postDeleteEventClass(data: any): Promise<any> {

        let url = this.hostUrl + "/TableSave/postDeleteEventClass";


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

    ///////////////////////////////////////////////////////
    //WorkScheme

    async postAddWorkScheme(data: any): Promise<any> {

        let url = this.hostUrl + "/TableSave/postAddWorkScheme";


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




    async postDeleteWorkSchemes(data: any): Promise<any> {

        let url = this.hostUrl + "/TableDelete/postDeleteWorkSchemes";


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


    ///////////////////////////////////////////////////////////
    //Work Schedule


    async postAddWorkSchedule(data: any): Promise<any> {

        let url = this.hostUrl + "/TableSave/postAddWorkSchedule";


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


    async postDeleteWorkShedules(data: any): Promise<any> {

        let url = this.hostUrl + "/TableDelete/postDeleteWorkShedules";


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

    async postAddEventualSchedule(data: any): Promise<any> {

        let url = this.hostUrl + "/TableSave/postAddEventualSchedule";


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


    async postDeleteEventualShedules(data: any): Promise<any> {

        let url = this.hostUrl + "/TableDelete/postDeleteEventualShedules";


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


    //////////////////////////////////////////////////////////////////////////
    //Event Form

    async postAddManualEvent(data: any): Promise<any> {

        let url = this.hostUrl + "/TableSave/postAddManualEvent";


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

    async postDeclareManualEvent(data: any): Promise<any> {

        let url = this.hostUrl + "/TableSave/postDeclareManualEvent";


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

    async postDeleteManualEvents(data: any): Promise<any> {

        let url = this.hostUrl + "/TableDelete/postDeleteManualEvents";


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

    async postPasteDeclareEvents(data: any): Promise<any> {

        let url = this.hostUrl + "/TableSave/postPasteDeclareEvents";

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

    //#region - Este es un nuevo método. El de dividir
    // async postDividerManualEvents(data: any): Promise<any>{
    //     let url = this.hostUrl + "/TableSave/postDividerManualEvents";

    //     var parameters = JSON.stringify(
    //         data
    //     );
    //     await this.httpClient.post<any>(url, parameters, { headers: this.headersPost }).toPromise().then(
    //         data => {
    //             if((data != undefined) || (data != null)){
    //                 httpResult = data;
    //             }else{
    //                 httpResult = null;
    //             }
    //         },
    //         error => {
    //             if(error.status === 401){
    //                 httpResult = error;
    //             }
    //         }
    //     );
    //     return httpResult;
    // }
    //#endregion

    async postAddWorkSchemeMachine(data: any): Promise<any> {

        let url = this.hostUrl + "/TableSave/postAddWorkSchemeMachine";


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
