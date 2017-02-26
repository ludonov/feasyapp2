import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFire, AuthProviders, FirebaseObjectObservable } from 'angularfire2';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/1_login/1_login';
import { SetPersonalDetailsPage } from '../pages/4A_set_personal_details/4A_set_personal_details';

import { Globals } from '../classes/Globals';

@Component({
  templateUrl: 'app.html',
  providers: [Globals]
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(platform: Platform, af: AngularFire, private globals: Globals) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      af.auth.subscribe(user => {
        console.log("AUTH STATE CHANGED!");
        console.log(user);
        if (user) {
          if (user.provider == AuthProviders.Facebook) {
            let user_db: FirebaseObjectObservable<any> = af.database.object("users/" + user.uid);
            user_db.$ref.once("value", (snaphot: firebase.database.DataSnapshot) => {
              console.log("Found FB user. Checking if user exists and updating user data...");
              let just_registered: boolean = false;
              if (snaphot.val() == null) {
                just_registered = true;
              }
              user_db.update({ "DisplayName": user.auth.displayName, "Email": user.auth.email, "PhotoURL": user.auth.photoURL })
                .then(res => {
                  console.log("FB user data updated");
                })
                .catch((err: Error) => {
                  console.warn("Cannot update fb user data: " + err.message);
                });

              if (just_registered) {
                console.log("Just registered! Redirecting to Personal details");
                this.rootPage = SetPersonalDetailsPage;
              }
              else {
                console.log("Redirecting to Home");
                this.rootPage = TabsPage;
              }
            });
          } else {
            console.log("Found normal User");
            if (globals.JustRegistered) {
              console.log("Just registered! Redirecting to Personal details");
              this.rootPage = SetPersonalDetailsPage;
            }
            else {
              console.log("Redirecting to Home");
              this.rootPage = TabsPage;
            }
          }
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
