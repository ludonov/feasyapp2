import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { StripForFirebase, GetUnits, FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

@Component({
  selector: 'page-specific-product-shopper',
  templateUrl: '13B_specific_product_shopper.html'
})
export class SpecificProductShopperPage {

  public item: FeasyItem;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.item = navParams.get('item');
    if (this.item == null || this.item == undefined)
      navCtrl.pop();
  }

}
