import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

import { PaymentPage } from '../../pages/32_payment/32_payment';

@Component({
  selector: 'page-publicated-with-shopper',
  templateUrl: '11_publicated_list_with_shopper.html'
})

export class PublicatedListWithShopperPage {

  constructor(public navCtrl: NavController) {

  }
  
  goToPayment(): void {
    console.log("going to payment page");
    this.navCtrl.push(PaymentPage);
  }

}
