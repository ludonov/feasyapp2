import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { FeasyUser, FeasyList, FeasyItem, Review, StripForFirebase, Chat } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { UserProfilePage } from '../../pages/17_user_profile/17_user_profile';
import { UserProfilePovOtherUsersPage } from '../../pages/17B_user_profile_pov_other_users/17B_user_profile_pov_other_users';


@Component({
  selector: 'page-history',
  templateUrl: '22_history.html'
})

export class HistoryPage {

  public HistoryUsers_db: FirebaseListObservable<any>;
  public HistoryUsers: Array<FeasyUser> = new Array<FeasyUser>();   
  
  constructor(public navCtrl: NavController, public globals: Globals, public af: AngularFireDatabase) {

  }

  goToProfileOtherUser(userUID: string): void {
    console.log("going to profile page of another user");
    this.navCtrl.push(UserProfilePovOtherUsersPage, {userUID: userUID});
  }

  goToListDetails(): void {
    //this.navCtrl.push(UserProfilePovOtherUsersPage);
  }

}
