import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

import { UserProfilePage } from '../../pages/17_user_profile/17_user_profile';


@Component({
  selector: 'page-candidate-info-unaccepted',
  templateUrl: '16_candidate_info_unaccepted.html'
})

export class CandidateInfoUnacceptedPage {

  constructor(public navCtrl: NavController) {

  }

  goto_user_profile(): void {
    console.log("going to page user profile");
    this.navCtrl.push(UserProfilePage);
  }

}
