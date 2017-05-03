import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';

import { Globals } from '../../classes/Globals';

import { LoginPage } from '../../pages/1_login/1_login';
import { EditProfilePage } from '../../pages/24_edit_profile/24_edit_profile';
import { PasswordResetPage } from '../../pages/25_password_reset/25_password_reset';
import { TermsAndConditionsPage } from '../../pages/26_terms_and_conditions/26_terms_and_conditions';

@Component({
  selector: 'page-settings',
  templateUrl: '23_settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController,  public globals: Globals) {
  
  }

  logout(): void {
    console.log("Logging out: removing link to candidate refs");
    this.globals.afAuth.auth.signOut();
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
