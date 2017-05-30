import { Component, Inject, forwardRef } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { FeasyUser, FeasyList, FeasyItem, GetGenderNameFromEnum, SetImageOrDefaultOtherUser } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { HistoryPage } from '../../pages/22_history/22_history';
import { ReviewsPovOtherUserPage } from '../../pages/30B_reviews_pov_other_user/30B_reviews_pov_other_user';

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
  public rating: any;
  public Demander: boolean;
  private date_to_print: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(forwardRef(() => Globals)) public globals: Globals, public af: AngularFireDatabase) {
    this.userUID = navParams.get('userUID');
    globals.ShowLoading();
    globals.GetUser(this.userUID).then(user => {
      globals.GetUserPicBig(this.userUID).then(usr_bigpic => {
        globals.DismissLoading();
        this.UserInfo = user;
        let date: Date = new Date(this.UserInfo.RegisterDate);
        let day: number = date.getDay();
        let month: number = date.getMonth() + 1;
        let year: number = date.getFullYear();
        this.date_to_print = (day.toString()) + "/" + (month.toString()) + "/" + (year.toString());
        if (this.UserInfo != null || this.UserInfo != undefined) {
          this.gender = GetGenderNameFromEnum(this.UserInfo.Gender);
          this.UserInfo.PhotoURL = SetImageOrDefaultOtherUser(this.UserInfo.Gender, this.UserInfo.PhotoURL);
          if (this.UserInfo.Rating == 0) {
            this.rating = "-";
          } else {
            this.rating = this.UserInfo.Rating;
          }
        }
      }).catch(() => {
        globals.DismissLoading();
      });
    }).catch(() => {
      globals.DismissLoading();
    });
  }

  goToReviews(): void {
    console.log("going to reviews page");
    this.navCtrl.push(ReviewsPovOtherUserPage, { userUid: this.userUID });
  }

  goToBigImage(): void {
    console.log("going to big image page");
    this.globals.GetUserPicBig(this.userUID).then(usr_bigpic => {
      this.globals.ViewBigImage(usr_bigpic, this.navCtrl);
    })
  }
  
}
