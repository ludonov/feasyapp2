import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress } from '../../classes/Feasy';

@Component({
  selector: 'page-address-static-view',
  templateUrl: '30_address_view_static.html'
})
export class AddressViewStaticPage {

  public address: DeliveryAddress;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.address = navParams.get('address');
    if (this.address == null) {
      console.warn("AddressViewStaticPage null address, going back");
      navCtrl.pop();
    }
  }

}