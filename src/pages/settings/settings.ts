import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  listen_port: string;
  api_path: string;
  user: string;
  pass: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {

    storage.get('settings_saved').then( value => {
      if(value === "true"){
        this.storage.get('listen_port').then( listen_port => this.listen_port = listen_port);
        this.storage.get('api_path').then( api_path => this.api_path = api_path);
        this.storage.get('user').then( user => this.user = user);
        this.storage.get('pass').then( pass => this.pass = pass);
      } else {
        this.listen_port = "9091";
        this.api_path = "/transmission/rpc";
        this.user = "";
        this.pass = "";
      }
    });

  }

  saveSettings(){
    this.storage.set('settings_saved', 'true');
    this.storage.set('listen_port', this.listen_port);
    this.storage.set('api_path', this.api_path);
    this.storage.set('user', this.user);
    this.storage.set('pass', this.pass);
    this.storage.set('userpass_b64', btoa(this.user+":"+this.pass));
  }

}
