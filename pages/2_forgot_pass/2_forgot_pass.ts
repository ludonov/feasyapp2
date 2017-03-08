import { Component, Inject } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';

import { FeasyUser } from '../../classes/Feasy';

import { EmailComposer } from 'ionic-native';

import { LoginPage } from '../../pages/1_login/1_login';


@Component({
  selector: 'page-forgotpass',
  templateUrl: '2_forgot_pass.html'
})
export class ForgotPassPage {

  private user: FeasyUser = new FeasyUser("", "", "");
  private fAppAuth: firebase.auth.Auth;

  constructor(public navCtrl: NavController, @Inject(FirebaseApp) firebaseApp: firebase.app.App, public alertCtrl: AlertController) {
    this.fAppAuth = firebaseApp.auth();
  }

  sendPassword(): void {
    console.log("sending reset password");
    this.fAppAuth.sendPasswordResetEmail(this.user.Email).then(() => {
      console.log("reset password succeded");
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





