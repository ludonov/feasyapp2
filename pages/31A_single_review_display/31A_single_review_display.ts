import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

@Component({
  selector: 'page-single-review',
  templateUrl: '31A_single_review_display.html'
})

export class SingleReviewDisplayPage {

  constructor(public navCtrl: NavController) {

  }

}
