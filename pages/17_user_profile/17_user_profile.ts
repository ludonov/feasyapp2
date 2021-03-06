﻿import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs, Loading, LoadingController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { FeasyUser, FeasyList, FeasyItem, GetGenderNameFromEnum } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { HistoryPage } from '../../pages/22_history/22_history';

import { EditProfilePage } from '../../pages/24_edit_profile/24_edit_profile';
import { ReviewsPage } from '../../pages/30_reviews/30_reviews';
import { AddressesFromProfilePage } from "../34_addresses_from_profile/34_addresses_from_profile";
import { ReviewsToLeavePage } from "../39_reviews_to_leave/39_reviews_to_leave";
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-user-profile',
  templateUrl: '17_user_profile.html'
})

export class UserProfilePage {

  public tab: Tabs;

  public user: FeasyUser = new FeasyUser("", "", "");
  public user_db: FirebaseObjectObservable<any>;
  public addresses_db: FirebaseListObservable<any>;
  public gender: string;

  constructor(public navCtrl: NavController, public globals: Globals, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.user = globals.User;
    this.gender = GetGenderNameFromEnum(this.user.Gender);
  }

  GoToHistory(demander: boolean): void {
    console.log("going to history page");
    this.navCtrl.push(HistoryPage, {demander: demander});
  }

  editProfile(): void {
    console.log("going to edit profile");
    this.navCtrl.push(EditProfilePage);
  }

  goToReviews(): void {
    console.log("going to reviews page");
    this.navCtrl.push(ReviewsPage);
  }

  MyAddresses(): void {
    console.log("going to addresses page");
    this.navCtrl.push(AddressesFromProfilePage);
  }

  goToPendingReviews(): void {
    console.log("going to pending reviews page");
    this.navCtrl.push(ReviewsToLeavePage);
  }

  goToBigImage(): void {
    console.log("going to big image page");
    this.globals.ViewBigImage(this.globals.UserPicBig, this.navCtrl);
  }

}
