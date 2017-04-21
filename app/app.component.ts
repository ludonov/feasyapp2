import { Component, ViewChild } from '@angular/core';
import { Http } from '@angular/http';

import { Platform, NavController, AlertController, Alert, Loading, LoadingController } from 'ionic-angular';
import { AngularFire, AuthProviders, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Splashscreen, LocalNotifications } from 'ionic-native';
import { StatusBar } from '@ionic-native/status-bar';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/1_login/1_login';
import { SetPersonalDetailsPage } from '../pages/4A_set_personal_details/4A_set_personal_details';
import { PublicatedListCandidatesPage } from '../pages/14_publicated_list_candidates/14_publicated_list_candidates';

import { Candidate, FeasyUser, StripForFirebase } from '../classes/Feasy';
import { Globals } from '../classes/Globals';

@Component({
  templateUrl: 'app.html',
  providers: [Globals, StatusBar],
})
export class MyApp {
  rootPage: any = LoginPage;
  @ViewChild('mynav') public navCtrl: NavController;

  constructor(platform: Platform, public af: AngularFire, public globals: Globals, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public http: Http, private statusBar: StatusBar) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.styleDefault();
      Splashscreen.hide();
      globals.af = af;
      globals.alertCtrl = alertCtrl;
      globals.navCtrl = this.navCtrl;
      globals.loadingCtrl = this.loadingCtrl;
      globals.http = http;

      af.auth.subscribe(user => {

        console.log("AUTH STATE CHANGED!");
        console.log(user);

        let loading: Loading = this.loadingCtrl.create({
          spinner: 'dots',
          content: 'Please wait...'
        });
        loading.present();

        if (user) {

          globals.UID = user.uid;
          globals.User.Email = user.auth.email;

          //FACEBOOK
          if (user.provider == AuthProviders.Facebook) {
            globals.User.DisplayName = user.auth.displayName;
            //globals.User.PhotoURL = user.auth.photoURL;
            let user_db: FirebaseObjectObservable<any> = af.database.object("users/" + user.uid);
            user_db.$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
              console.log("Found FB user. Checking if user exists and updating user data...");
              let userdata: FeasyUser = snapshot.val();
              if (userdata == null) {
                console.log("Just registered! Updating FB user data and Redirecting to Personal details");
                user_db.set(StripForFirebase(globals.User))
                  .then(res => {
                    console.log("FB user data updated");
                  })
                  .catch((err: Error) => {
                    console.warn("Cannot update fb user data: " + err.message);
                  });
                this.rootPage = SetPersonalDetailsPage;
                loading.dismiss();
              }
              else {
                globals.User = userdata;
                console.log("Redirecting to tab root 1");
                this.rootPage = TabsPage;
                loading.dismiss();
              }
            });
            console.log("Name: " + this.globals.User.DisplayName);


          //NORMAL
          } else {
            console.log("Found normal User");
            globals.User.PhotoURL = "assets/img/unknown_man.png";
            if (globals.JustRegistered) {
              globals.JustRegistered = false;
              console.log("Just registered! Redirecting to Personal details");
              user.auth.updateProfile({
                displayName: this.globals.User.DisplayName,
                photoURL: this.globals.User.PhotoURL,
              });
              this.rootPage = SetPersonalDetailsPage;
              loading.dismiss();
            }
            else {
              if (user.auth.displayName == null) {
                user.auth.updateProfile({
                  displayName: this.globals.User.DisplayName,
                  photoURL: this.globals.User.PhotoURL,
                });
              }
              console.log("Redirecting to tab root 1");
              this.rootPage = TabsPage;
              loading.dismiss();
            }
          }
          globals.LinkAllWatchers();
        } else {
          console.log("User auth not found, redirecting to Login");
          globals.UID = "";
          globals.User = new FeasyUser("", "", "");
          this.rootPage = LoginPage;
          loading.dismiss();
        }
      });
      //if (this.globals.UID != null) {
      //  console.log("INIT User auth found, redirecting to Home");
      //  this.rootPage = TabsPage;
      //} else {
      //  console.log("INIT User auth not found, redirecting to Login");
      //  this.rootPage = LoginPage;
      //}
    });

    statusBar.styleLightContent();
  }
}
