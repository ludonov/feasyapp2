import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { LoginPage } from '../../pages/1_login/1_login';


@Component({
  selector: 'page-forgotpass',
  templateUrl: '2_forgot_pass.html'
})
export class ForgotPassPage {

  constructor(public navCtrl: NavController) {
  
  }

  sendPassword(): void {
    console.log("send password");
    //send password to users email!!!!!!
    this.navCtrl.push(LoginPage);
  }

}
