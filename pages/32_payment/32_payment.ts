import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';



import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

import { PaymentSummaryPage } from '../../pages/33_payment_summary/33_payment_summary';



@Component({
  selector: 'page-payment',
  templateUrl: '32_payment.html'
})

export class PaymentPage {

  constructor(public navCtrl: NavController) {

  }

  goToPaymentSummary(): void {
    console.log("going to payment summary");
    this.navCtrl.push(PaymentSummaryPage);
  }

}
