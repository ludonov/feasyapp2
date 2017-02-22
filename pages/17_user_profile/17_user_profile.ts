import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

import { HistoryPage } from '../../pages/22_history/22_history';

import { EditProfilePage } from '../../pages/24_edit_profile/24_edit_profile';
import { ReviewsPage } from '../../pages/30_reviews/30_reviews';

@Component({
  selector: 'page-user-profile',
  templateUrl: '17_user_profile.html'
})

export class UserProfilePage {

  public tab: Tabs;
  public user: FeasyUser = new FeasyUser("", "", "");
  public user_db: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController) {
    this.user_db = af.database.list('/users/' + af.auth.getAuth().uid);
    this.user_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {this.user = snapshot.val();});
  }

  goToHistory(): void {
    console.log("going to history page");
    this.navCtrl.push(HistoryPage);
  }

  editProfile(): void {
    console.log("going to edit profile");
    this.navCtrl.push(EditProfilePage);
  }

  goToReviews(): void {
    console.log("going to reviews page");
    this.navCtrl.push(ReviewsPage);
  }

}
