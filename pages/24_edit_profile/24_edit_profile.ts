import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { SettingsPage } from '../../pages/23_settings/23_settings';


@Component({
  selector: 'page-editprofile',
  templateUrl: '24_edit_profile.html'
})
export class EditProfilePage {

  constructor(public navCtrl: NavController) {
  
  }

  changeProfile(): void {
    console.log("edit profile");
    this.navCtrl.push(SettingsPage);
  }


}
