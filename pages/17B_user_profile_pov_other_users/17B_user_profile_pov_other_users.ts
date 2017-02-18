import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

import { HistoryPage } from '../../pages/22_history/22_history';

@Component({
  selector: 'page-user-profile-pov-other-users',
  templateUrl: '17B_user_profile_pov_other_users.html'
})

export class UserProfilePovOtherUsersPage {

  constructor() {
  }
}
