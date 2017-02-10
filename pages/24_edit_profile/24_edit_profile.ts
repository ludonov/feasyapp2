import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';

//import { LoginPage } from '../../pages/1_login/1_login';

@Component({
  selector: 'page-editprofile',
  templateUrl: '24_edit_profile.html'
})
export class EditProfilePage {

  constructor(public navCtrl: NavController) {
  
  }

  /*logout(): void {
    console.log("logging out");
    this.navCtrl.push(LoginPage);
  }*/

}
