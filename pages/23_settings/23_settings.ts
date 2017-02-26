import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { LoginPage } from '../../pages/1_login/1_login';
import { EditProfilePage } from '../../pages/24_edit_profile/24_edit_profile';
import { PasswordResetPage } from '../../pages/25_password_reset/25_password_reset';
import { TermsAndConditionsPage } from '../../pages/26_terms_and_conditions/26_terms_and_conditions';

@Component({
  selector: 'page-settings',
  templateUrl: '23_settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public af: AngularFire) {
  
  }

  logout(): void {
    console.log("logging out");
    this.af.auth.logout();
  }

  editProfile(): void {
    console.log("edit profile");
    this.navCtrl.push(EditProfilePage);
  }
  
  editPassword(): void {
    console.log("edit password");
    this.navCtrl.push(PasswordResetPage);
  }

  terms(): void {
    console.log("terms & conditions");
    this.navCtrl.push(TermsAndConditionsPage);
  }

}
