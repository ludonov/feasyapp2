import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { EmailComposer } from 'ionic-native';

import { LoginPage } from '../../pages/1_login/1_login';


@Component({
  selector: 'page-forgotpass',
  templateUrl: '2_forgot_pass.html'
})
export class ForgotPassPage {

  public UserEmail: string;

  constructor(public navCtrl: NavController) {
  
  }

  sendPassword(): void {
    console.log("send password");
    /*EmailComposer.isAvailable().then((available: boolean) =>{
    if(available) {
      //Now we know we can send
    }
    });

    let email = {
      to: this.UserEmail,
      subject: 'Feasy Forgotten Password',
      body: 'Password: ',
      isHtml: true
    };

    // Send a text message using default options
    EmailComposer.open(email);*/
    this.navCtrl.setRoot(LoginPage);
    }

}





