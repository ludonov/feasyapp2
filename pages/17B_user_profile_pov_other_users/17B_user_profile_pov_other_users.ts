import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { FeasyUser, FeasyList, FeasyItem, GetGenderNameFromEnum } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { HistoryPage } from '../../pages/22_history/22_history';
import { ReviewsPage } from '../../pages/30_reviews/30_reviews';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  selector: 'page-user-profile-pov-other-users',
  templateUrl: '17B_user_profile_pov_other_users.html'
})

export class UserProfilePovOtherUsersPage {

  public userUID: string;
  public UserInfo_db: FirebaseObjectObservable<any>;
  public UserInfo: FeasyUser = new FeasyUser("", "", "");
  public gender: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals, public af: AngularFireDatabase) {
    this.userUID = navParams.get('userUID');
    this.UserInfo_db = af.object('/users/' + this.userUID);
    this.UserInfo_db.$ref.on("value", (_user: firebase.database.DataSnapshot) => {
      this.UserInfo = _user.val();
      this.gender = GetGenderNameFromEnum(this.UserInfo.Gender);
    });
  }


  goToReviews(): void {
    console.log("going to reviews page");
    this.navCtrl.push(ReviewsPage, { userUid: this.userUID });
  }
  
}
