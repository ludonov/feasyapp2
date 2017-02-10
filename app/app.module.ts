
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/1_login/1_login';
import { SignupPage } from '../pages/3_signup/3_signup';
import { HomePage } from '../pages/5_home/5_home';
import { ListsPage } from '../pages/6_lists/6_lists';
import { ListPage } from '../pages/7_list/7_list';
import { AddOrShowItemPage } from '../pages/13A_specific_product_demander/13A_specific_product_demander';
import { DoShoppingPage } from '../pages/18A_do_shopping/18A_do_shopping';
import { ChatPage } from '../pages/19_chat_list/19_chat_list';
import { SettingsPage } from '../pages/23_settings/23_settings';
import { EditProfilePage } from '../pages/24_edit_profile/24_edit_profile'

import { TabsPage } from '../pages/tabs/tabs';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyDNIp5Lc0niVP3-G52b5ylvPiZ-bZLCH1Q",
  authDomain: "feasy-144313.firebaseapp.com",
  databaseURL: "https://feasy-144313.firebaseio.com",
  storageBucket: "feasy-144313.appspot.com",
  messagingSenderId: "921392403918"
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    ListsPage,
    ListPage,
    AddOrShowItemPage,
    DoShoppingPage,
    ChatPage,
    TabsPage,
    SettingsPage,
    EditProfilePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    ListsPage,
    ListPage,
    AddOrShowItemPage,
    DoShoppingPage,
    ChatPage,
    TabsPage,
    SettingsPage,
    EditProfilePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {

}
