import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, Review } from '../../classes/Feasy';

@Component({
  selector: 'page-single-review',
  templateUrl: '31A_single_review_display.html'
})

export class SingleReviewDisplayPage {

  public review: Review;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.review = navParams.get('review');
  }

}

