import { Component, Pipe, PipeTransform } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

import { PublicatedListProductsPage } from '../../pages/12_publicated_list_products/12_publicated_list_products';
import { AddressViewStaticPage } from '../../pages/30_address_view_static/30_address_view_static';


@Component({
  selector: 'page-publicated-list-no-shopper',
  templateUrl: '10_publicated_list_no_shopper.html'
})

export class PublicatedListNoShopperPage {

  public list: FeasyList;
  public DeliveryAddresses: Object = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController) {
    this.list = navParams.get('list');
    if (this.list == undefined || this.list == null)
      navCtrl.pop();
    this.DeliveryAddresses = this.list.DeliveryAddresses;
  }

  ViewAddress(address: any): void {
    console.log("Going to AddressViewStaticPage");
    this.navCtrl.push(AddressViewStaticPage, { address: address.value });
  }

  ViewItems(): void {
    console.log("Going to PublicatedListProductsPage");
    this.navCtrl.push(PublicatedListProductsPage, { items: this.list.Items });
  }

  ViewCandidates(): void {

  }

  WithdrawList(): void {

  }

  RemoveList(): void {
    console.log("Deleting published list: " + this.list.Name);
    this.af.database.list('/published_lists/' + this.af.auth.getAuth().uid).remove(this.list.$key).then(res => {
      console.log("Published list removed");
      this.navCtrl.pop();
    }).catch((res: Error) => {
      console.warn("Cannot remove published list: " + res.message);
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Impossibile rimuovere la lista",
        buttons: ['Ok']
      });
      alert.present();
    });
  }

}
