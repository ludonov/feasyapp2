import { Component, Pipe, PipeTransform } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { PublicatedListProductsPage } from '../../pages/12_publicated_list_products/12_publicated_list_products';
import { PublicatedListCandidatesPage } from '../../pages/14_publicated_list_candidates/14_publicated_list_candidates';
import { AddressViewStaticPage } from '../../pages/30_address_view_static/30_address_view_static';


@Component({
  selector: 'page-publicated-list-no-shopper',
  templateUrl: '10_publicated_list_no_shopper.html'
})

export class PublicatedListNoShopperPage {

  public list_key: string;
  public list: FeasyList = new FeasyList("");
  //public DeliveryAddresses: Object = {};

  constructor(public navCtrl: NavController, public globals: Globals, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController) {
    this.list_key = navParams.get('list_key');
    if (this.list_key == undefined || this.list_key == null) {
      console.warn("PublicatedListNoShopperPage null list_key. Going back.")
      navCtrl.pop();
    }
    this.list = globals.PublishedLists[this.list_key];
    af.database.object('published_lists/' + globals.UID + '/' + this.list_key).$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.list = snapshot.val();
    });

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
    console.log("Going to PublicatedListCandidatesPage");
    this.navCtrl.push(PublicatedListCandidatesPage, { list_owner: this.globals.UID, list_key: this.list_key });
  }

  WithdrawList(): void {

  }

  RemoveList(): void {
    console.log("Deleting published list: " + this.list.Name);
    this.af.database.list('/published_lists/' + this.globals.UID).remove(this.list.$key).then(res => {
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
