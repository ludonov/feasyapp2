import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';



@Component({
  selector: 'page-payment-summary',
  templateUrl: '33_payment_summary.html'
})

export class PaymentSummaryPage {

  constructor(public navCtrl: NavController) {

  }

}
