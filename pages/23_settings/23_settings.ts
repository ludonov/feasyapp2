import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';

//import { LoginPage } from '../../pages/1_login/1_login';
import { EditProfilePage } from '../../pages/24_edit_profile/24_edit_profile';

@Component({
  selector: 'page-settings',
  templateUrl: '23_settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController) {
  
  }

  logout(): void {
    console.log("logging out");
    //this.navCtrl.push(LoginPage);
  }

  editProfile(): void {
    console.log("edit profile");
    this.navCtrl.push(EditProfilePage);
  }

}
