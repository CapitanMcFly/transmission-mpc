import { NgModule, ErrorHandler } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { TestPage } from '../pages/test/test';

import { TabsPage } from '../pages/tabs/tabs';

import { ConnectionInfo } from '../providers/connection-info';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SearchPage,
    SettingsPage,
    TestPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SearchPage,
    SettingsPage,
    TestPage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage, ConnectionInfo]
})
export class AppModule {}
