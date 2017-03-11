import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, AlertController, Alert } from 'ionic-angular';
import { AngularFire, AuthProviders, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { StatusBar, Splashscreen, LocalNotifications } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/1_login/1_login';
import { SetPersonalDetailsPage } from '../pages/4A_set_personal_details/4A_set_personal_details';
import { PublicatedListCandidatesPage } from '../pages/14_publicated_list_candidates/14_publicated_list_candidates';

import { Candidate, FeasyUser, StripForFirebase } from '../classes/Feasy';
import { Globals } from '../classes/Globals';

@Component({
  templateUrl: 'app.html',
  providers: [Globals]
})
export class MyApp {
  rootPage: any = LoginPage;
  @ViewChild('mynav') public navCtrl: NavController;

  constructor(platform: Platform, public af: AngularFire, public globals: Globals, public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      af.auth.subscribe(user => {
        console.log("AUTH STATE CHANGED!");
        console.log(user);
        if (user) {
          globals.UID = user.uid;
          globals.User.Email = user.auth.email;

          //FACEBOOK
          if (user.provider == AuthProviders.Facebook) {
            globals.User.DisplayName = user.auth.displayName;
            //globals.User.PhotoURL = user.auth.photoURL;
            let user_db: FirebaseObjectObservable<any> = af.database.object("users/" + user.uid);
            user_db.$ref.once("value", (snaphot: firebase.database.DataSnapshot) => {
              console.log("Found FB user. Checking if user exists and updating user data...");
              let userdata: FeasyUser = snaphot.val();
              if (userdata == null) {
                console.log("Just registered! Updating FB user data and Redirecting to Personal details");
                user_db.update(StripForFirebase(globals.User))
                  .then(res => {
                    console.log("FB user data updated");
                  })
                  .catch((err: Error) => {
                    console.warn("Cannot update fb user data: " + err.message);
                  });
                this.rootPage = SetPersonalDetailsPage;
              }
              else {
                globals.User = userdata;
                console.log("Redirecting to Home");
                this.rootPage = TabsPage;
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
            }
            else {
              if (user.auth.displayName == null) {
                user.auth.updateProfile({
                  displayName: this.globals.User.DisplayName,
                  photoURL: this.globals.User.PhotoURL,
                });
              }
              let user_db: FirebaseObjectObservable<any> = af.database.object("users/" + user.uid);
              user_db.$ref.once("value", (snaphot: firebase.database.DataSnapshot) => {
                let user: FeasyUser = snaphot.val();
                if (user != null) {
                  globals.User = user;
                  console.log("Name: " + this.globals.User.DisplayName);
                }
              });
              console.log("Redirecting to Home");
              this.rootPage = TabsPage;
            }
          }
          this.linkCandidateWatchers();
        } else {
          console.log("User auth not found, redirecting to Login");
          globals.UID = "";
          globals.User = new FeasyUser("", "", "");
          this.rootPage = LoginPage;
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
  }

  linkCandidateWatchers(): void {
    try {
      let ref: FirebaseListObservable<any> = this.af.database.list("/candidates/" + this.globals.UID);
      this.globals.candidates_refs.push(ref.$ref.ref);
      ref.$ref.on("child_added", (list: firebase.database.DataSnapshot) => {
        let ref_cand: FirebaseListObservable<any> = this.af.database.list("/candidates/" + this.globals.UID + "/" + list.key);
        this.globals.candidates_refs.push(ref_cand.$ref.ref);
        ref_cand.$ref.on("value", (candidates: firebase.database.DataSnapshot) => {
          let candidates_data = candidates.val();
          let new_candidates_number: number = 0;
          for (let candidate in candidates_data) {
            if (candidates_data[candidate] != null && !candidates_data[candidate].Visualised) {
              new_candidates_number++;
            }
          }
          if (new_candidates_number > 0) {
            // Schedule a single notification
            LocalNotifications.schedule({
              id: 1,
              title: new_candidates_number == 1 ? 'Nuovo candidato!' : "Nuovi candidati!",
              text: "Clicca per vedere i dettagli",
              data: { list_owner: this.globals.UID, list_key: list.key },
              icon: 'res://icon'
            });
            LocalNotifications.on("click", (notification) => {
              this.navCtrl.push(PublicatedListCandidatesPage, { list_owner: this.globals.UID, list_key: list.key });
            });
            //let alert: Alert = this.alertCtrl.create({
            //  title: new_candidates_number == 1 ? 'Nuovo candidato!' : "Nuovi candidati!",
            //  subTitle: "Vuoi vedere i dettagli?",
            //  buttons: [
            //    {
            //      text: 'Cancel',
            //      role: 'cancel'
            //    },
            //    {
            //      text: 'Ok',
            //      handler: () => {
            //        let candidates_list: any = list.val();
            //        this.navCtrl.push(PublicatedListCandidatesPage, { list_owner: this.globals.UID, list_key: list.key });
            //      }
            //    }]
            //});
            //alert.present();
          }
        });
      });

    } catch (e) {
      console.log("link catch err: " + JSON.stringify(e));
    }
  }
}
