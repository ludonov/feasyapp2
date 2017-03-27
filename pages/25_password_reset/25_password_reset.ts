import { Component, Inject } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';

import { FeasyUser, FeasyList, FeasyItem, StripForFirebase } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { EmailComposer } from 'ionic-native'; 

import { SettingsPage } from '../23_settings/23_settings';


@Component({
  selector: 'page-passwordreset',
  templateUrl: '25_password_reset.html'
})
export class PasswordResetPage {

  private fAppAuth: firebase.auth.Auth;

  constructor(public navCtrl: NavController, @Inject(FirebaseApp) firebaseApp: firebase.app.App, public alertCtrl: AlertController, public globals: Globals) {
    this.fAppAuth = firebaseApp.auth();
  }

  changePassword(): void {
    console.log("sending reset password");
    this.fAppAuth.sendPasswordResetEmail(this.globals.User.Email).then(() => {
      console.log("reset password succeded");
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Link inviato. Controlla la tua email.",
        buttons: ['Ok']
      });
      alert.present();
      this.navCtrl.pop();
    }).catch((err: Error) => {
      console.warn("Cannot send reset password: " + err.message);
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Impossibile resettare la password: " +  err.message,
        buttons: ['Ok']
      });
      alert.present();
    });
  }

}
