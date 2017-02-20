import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';


@Component({
  selector: 'page-passwordreset',
  templateUrl: '25_password_reset.html'
})
export class PasswordResetPage {

  constructor(public navCtrl: NavController) {
  
  }


  changePassword(): void {
    console.log("change password");
    //this.navCtrl.push(EditProfilePage);
  }


}
