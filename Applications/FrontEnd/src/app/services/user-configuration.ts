import { Injectable, Inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { IUserConfigurationData } from '../interfaces/user-configuration';

@Injectable()
export class UserConfigurationData {

    constructor(@Inject(SESSION_STORAGE) private storage: StorageService) { }


    userData: IUserConfigurationData = {

        userName: this.storage.get('username'),
        login: this.storage.get('login'),
        profileId: this.storage.get('profileid'),
        token: this.storage.get('token'),
        userId: this.storage.get('userid'),
        profileName: this.storage.get('profileName')
    }

}
// Este file esta hecho para las configuraciones de usuario, traigo eso desde las interfaces donde también se encuentra el user-configuration
