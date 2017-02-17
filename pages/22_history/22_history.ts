import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

import { UserProfilePage } from '../../pages/17_user_profile/17_user_profile';

@Component({
  selector: 'page-history',
  templateUrl: '22_history.html'
})

export class HistoryPage {

  constructor(public navCtrl: NavController) {

  }

goToProfile(): void {
    console.log("going to profile page");
    this.navCtrl.push(UserProfilePage);
  }

}
