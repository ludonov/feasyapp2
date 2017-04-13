import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

import { SingleReviewDisplayPage } from '../../pages/31A_single_review_display/31A_single_review_display';

@Component({
  selector: 'page-reviews',
  templateUrl: '30_reviews.html'
})

export class ReviewsPage {

  constructor(public navCtrl: NavController) {

  }

  goToSingleReviewDisplay(): void {
    console.log("going to single review display page");
    this.navCtrl.push(SingleReviewDisplayPage);
  }

}
