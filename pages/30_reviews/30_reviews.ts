import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

import { SingleReviewPage } from '../../pages/31_single_review/31_single_review';

@Component({
  selector: 'page-reviews',
  templateUrl: '30_reviews.html'
})

export class ReviewsPage {

  constructor(public navCtrl: NavController) {

  }

  goToSingleReview(): void {
    console.log("going to single review page");
    this.navCtrl.push(SingleReviewPage);
  }

}
