import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

@Component({
  selector: 'page-reviews',
  templateUrl: '30_reviews.html'
})

export class ReviewsPage {

  constructor(public navCtrl: NavController) {

  }

}
