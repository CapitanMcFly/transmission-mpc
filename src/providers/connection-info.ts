import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class ConnectionInfo {

  host_dir: string = "";
  listen_port: number = 9091;
  api_path: string = "/transmission/rpc";
  userpass_b64: string = "";
  user: string = "";
  pass: string = "";

  constructor(public storage: Storage) { }

  // Recover data from secondary memory to primary one
  load_data(){
    this.storage.get('settings_saved').then( settings_saved => {
      if(settings_saved){
        this.storage.get('host_dir').then( host_dir => this.host_dir = host_dir);
        this.storage.get('listen_port').then( listen_port => this.listen_port = listen_port);
        this.storage.get('api_path').then( api_path => this.api_path = api_path);
        this.storage.get('userpass_b64').then( userpass_b64 => {
          this.userpass_b64 = userpass_b64;
          this.user = atob(userpass_b64).split(':')[0];
          this.pass = atob(userpass_b64).split(':')[1];
        });
      }
    });
  }

}
