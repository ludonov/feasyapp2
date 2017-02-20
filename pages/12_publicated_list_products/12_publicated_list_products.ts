import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

import { SpecificProductShopperPage } from '../../pages/13B_specific_product_shopper/13B_specific_product_shopper';

@Component({
  selector: 'page-publicated-list-products',
  templateUrl: '12_publicated_list_products.html'
})

export class PublicatedListProductsPage {

  public items: Object = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.items = navParams.get('items');
    if (this.items == null || this.items == {})
      navCtrl.pop();
  }

  ViewItem(item: any): void {
    console.log("Going to view specific item");
    this.navCtrl.push(SpecificProductShopperPage, { item: item.value});
  }

}
