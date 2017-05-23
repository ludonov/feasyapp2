import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';



import { FeasyUser, FeasyList, FeasyItem, Review, SetImageOrDefaultOtherUser } from '../../classes/Feasy';
import { Globals } from "../../classes/Globals";

@Component({
  selector: 'page-single-review',
  templateUrl: '31A_single_review_display.html'
})

export class SingleReviewDisplayPage {

  public review: Review;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals) {
    this.review = navParams.get('review');

  }

}

