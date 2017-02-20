import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

@Component({
  selector: 'page-single-review',
  templateUrl: '31_single_review.html'
})

export class SingleReviewPage {

  constructor(public navCtrl: NavController) {

  }

}
