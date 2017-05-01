import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ConnectionInfo } from '../../providers/connection-info';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public storage: Storage, public connectionInfo: ConnectionInfo) {

  }

  ionViewDidLeave(){
    this.connectionInfo.userpass_b64 = btoa(this.connectionInfo.user+":"+this.connectionInfo.pass);
    // Store connection data on secondary memory
    this.storage.set('settings_saved', true);
    this.storage.set('host_dir', this.connectionInfo.host_dir);
    this.storage.set('listen_port', this.connectionInfo.listen_port);
    this.storage.set('api_path', this.connectionInfo.api_path);
    this.storage.set('userpass_b64', this.connectionInfo.userpass_b64);
  }

}
