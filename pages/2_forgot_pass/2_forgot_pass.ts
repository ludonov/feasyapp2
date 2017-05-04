import { Component, Inject } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

import { Globals } from '../../classes/Globals';

import { FeasyUser } from '../../classes/Feasy';

import { LoginPage } from '../../pages/1_login/1_login';


@Component({
  selector: 'page-forgotpass',
  templateUrl: '2_forgot_pass.html'
})
export class ForgotPassPage {

  private user: FeasyUser = new FeasyUser("", "", "");

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public globas: Globals) {
  }

  sendPassword(): void {
    console.log("sending reset password");
    this.globas.af.app.auth().sendPasswordResetEmail(this.user.Email).then(() => {
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





