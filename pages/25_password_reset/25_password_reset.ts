import { Component, Inject } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';

import { FeasyUser, FeasyList, FeasyItem, StripForFirebase } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { SettingsPage } from '../23_settings/23_settings';


@Component({
  selector: 'page-passwordreset',
  templateUrl: '25_password_reset.html'
})
export class PasswordResetPage {
  

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public globals: Globals) {
  }

  changePassword(): void {
    console.log("sending reset password");
    this.globals.afAuth.auth.sendPasswordResetEmail(this.globals.User.Email).then(() => {
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
