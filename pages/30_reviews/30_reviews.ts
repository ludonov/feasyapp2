import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, Review } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { SingleReviewPage } from '../../pages/31_single_review/31_single_review';

@Component({
  selector: 'page-reviews',
  templateUrl: '30_reviews.html'
})

export class ReviewsPage {

  public Reviews_db: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public af: AngularFire, public globals: Globals) {

  }

  goToSingleReview(review: any): void {
    console.log("going to single review page");
    this.navCtrl.push(SingleReviewPage, { review: review });
  }

}
