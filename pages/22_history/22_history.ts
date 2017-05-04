import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';



import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

import { UserProfilePage } from '../../pages/17_user_profile/17_user_profile';
import { UserProfilePovOtherUsersPage } from '../../pages/17B_user_profile_pov_other_users/17B_user_profile_pov_other_users';


@Component({
  selector: 'page-history',
  templateUrl: '22_history.html'
})

export class HistoryPage {

  constructor(public navCtrl: NavController) {

  }

  goToProfileOtherUser(): void {
    console.log("going to profile page of another user");
    this.navCtrl.push(UserProfilePovOtherUsersPage);
  }

}
