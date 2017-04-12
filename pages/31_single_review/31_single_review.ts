import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, Review } from '../../classes/Feasy';

@Component({
  selector: 'page-single-review',
  templateUrl: '31_single_review.html'
})

export class SingleReviewPage {

  public review: Review;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.review = navParams.get('review');
  }

}
