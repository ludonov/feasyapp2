import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/1_login/1_login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(platform: Platform, af: AngularFire) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      af.auth.subscribe(user => {
        console.log("AUTH STATE CHANGED!");
        console.log(user);
        if (user) {
          console.log("User auth found, redirecting to Home");
          this.rootPage = TabsPage;
        } else {
          console.log("User auth not found, redirecting to Login");
          this.rootPage = LoginPage;
        }
      });
      //if (af.auth.getAuth().uid != null) {
      //  console.log("INIT User auth found, redirecting to Home");
      //  this.rootPage = TabsPage;
      //} else {
      //  console.log("INIT User auth not found, redirecting to Login");
      //  this.rootPage = LoginPage;
      //}
    });
  }
}
