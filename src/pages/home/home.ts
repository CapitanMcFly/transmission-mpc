import { Component } from '@angular/core';
import { NavController, Events, AlertController } from 'ionic-angular';
import { ConnectionInfo } from "../../providers/connection-info";
import { CommService } from "../../providers/comm-service";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  redirectToSettings: boolean = true;

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public connectionInfo: ConnectionInfo,
    public commService: CommService,
    public alertCtrl: AlertController
  ) { }

  ionViewDidLoad(){

    // Subscribe to an event which try to establish a connection
    this.events.subscribe('user:try_connection', () => {

      // console.log("--Hi! from try_connection event");

      // If connection data has been set up, lets try to connect
      if(this.connectionInfo.all_connection_data()){

        // Stop showing 'Go to settings' screen
        this.redirectToSettings = false;

        this.commService.firstSessionGet();
        this.events.subscribe('user:sessionId_ready', errorCode => {
          // console.log("--Hi! from sessionId_ready event");
          switch(errorCode){
            case (401): // Unauthorized access
              this.redirectToSettings = true;
              // Pop-up notifies the unauthorized access
              let alert = this.alertCtrl.create({
                title: 'Unauthorized access',
                subTitle: 'Please check your credentials',
                buttons: [
                  {
                    text: 'Go to Settings',
                    handler: () => {
                      this.goToSettings();
                    }
                  }
                ]
              });
              alert.present();
              break;
            case (409): // Session id received correctly
              this.commService.nextSessionGet();
              this.commService.sessionStats();
              this.commService.firstTorrentGet();
              break;
            default:
              console.log("There was a connection error...");
              console.log("Status code: " + errorCode);
          }
        });

      } else {
        // Else, show a template that redirect to the settings page
        this.redirectToSettings = true;
      }

    });

  }

  // Change to Settings tab
  goToSettings(){
    this.navCtrl.parent.select(2);
  }

}
