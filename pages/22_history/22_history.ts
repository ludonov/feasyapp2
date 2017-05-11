import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { FeasyUser, FeasyList, FeasyItem, Review, StripForFirebase, Chat } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { UserProfilePovOtherUsersPage } from '../../pages/17B_user_profile_pov_other_users/17B_user_profile_pov_other_users';
import { TerminatedListInfoPage } from '../../pages/21_terminated_list_info/21_terminated_list_info';

@Component({
  selector: 'page-history',
  templateUrl: '22_history.html'
})

export class HistoryPage {

  public Demander: boolean = false;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals, public af: AngularFireDatabase) {
    this.Demander = navParams.get('demander');
  }

  goToProfileOtherUser(userUID: string): void {
    console.log("going to profile page of another user");
    this.navCtrl.push(UserProfilePovOtherUsersPage, {userUID: userUID});
  }

  goToListDetailsAsDemander(listKey: string): void {
    this.navCtrl.push(TerminatedListInfoPage, {list_key: listKey, demander: this.Demander});
  }

  goToListDetailsAsShopper(listKey: string): void {
    this.navCtrl.push(TerminatedListInfoPage, { list_key: listKey, demander: this.Demander });
  }

}
