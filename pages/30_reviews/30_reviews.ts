import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';



import { FeasyUser, FeasyList, FeasyItem, Review, SetImageOrDefaultOtherUser } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { SingleReviewDisplayPage } from '../../pages/31A_single_review_display/31A_single_review_display';

@Component({
  selector: 'page-reviews',
  templateUrl: '30_reviews.html'
})

export class ReviewsPage {

  public PhotoURL: string;  
  public ReviewsForDisplay: Array<Review> = new Array<Review>();

  constructor(public navCtrl: NavController,  public globals: Globals) {
    for (let review of globals.Reviews) {
      this.globals.af.object('/users/' + review.RevieweeUid).$ref.once("value", (_user: firebase.database.DataSnapshot) => {
        let user: FeasyUser = _user.val();
        (review as any).PhotoURL = SetImageOrDefaultOtherUser(user.Gender, user.PhotoURL);
        this.ReviewsForDisplay.push(review);
      });
    }
  }

  goToSingleReview(review: any, _photo_url: string): void {
    console.log("going to single review page");
    this.navCtrl.push(SingleReviewDisplayPage, { review: review, photo_url: _photo_url });

  }

}
