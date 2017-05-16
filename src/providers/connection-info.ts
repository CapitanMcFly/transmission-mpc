import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class ConnectionInfo {

  // Connection data
  host_dir: string = "";
  listen_port: number = 9091;
  api_path: string = "/transmission/rpc";
  userpass_b64: string = "";
  user: string = "";
  pass: string = "";

  // Transmission parameters
  tparams: Object;
  tstats: Object;
  tlist: Object;

  constructor(public storage: Storage, public events: Events) { }

  // Recover data from secondary memory to primary one
  load_data(){
    this.storage.get('settings_saved').then( settings_saved => {
      if(settings_saved){
        Promise.all([
          this.storage.get('host_dir').then( host_dir => this.host_dir = host_dir),
          this.storage.get('listen_port').then( listen_port => this.listen_port = listen_port),
          this.storage.get('api_path').then( api_path => this.api_path = api_path),
          this.storage.get('userpass_b64').then( userpass_b64 => {
            this.userpass_b64 = userpass_b64;
            this.user = atob(userpass_b64).split(':')[0];
            this.pass = atob(userpass_b64).split(':')[1];
          })
        ]).then( value => {
          // When all data have been loaded on primary memory, publish the try_connection event
          this.events.publish('user:try_connection');
        });
      } else {
        // Else directly publish the try_connection event
        this.events.publish('user:try_connection');
      }
    });
  }

  // If some field is empty, all_connection_data returns false
  all_connection_data(): boolean{
    if( !this.host_dir || !this.listen_port || !this.api_path || !this.user || !this.pass ){
      return false;
    } else {
      return true;
    }
  }

}
