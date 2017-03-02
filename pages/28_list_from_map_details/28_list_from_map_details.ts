import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress } from '../../classes/Feasy';

import { PublicatedListProductsPage } from '../../pages/12_publicated_list_products/12_publicated_list_products';
import { AddressViewStaticPage } from '../../pages/30_address_view_static/30_address_view_static';

@Component({
  selector: 'page-list-from-map',
  templateUrl: '28_list_from_map_details.html'
})

export class ListFromMapPage {

  private listkey: string;
  private listowner: string;
  private list: FeasyList = new FeasyList("");
  private owner: FeasyUser = new FeasyUser("", "", "");

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController) {

    this.listkey = navParams.get("listkey");
    this.listowner = navParams.get("listowner");

    if (this.listkey == null || this.listowner == null) {
      console.warn("ListFromMapPage: null listkey or listowner. Going back.");
      navCtrl.pop();
    }

    af.database.object("/published_lists/" + this.listowner + "/" + this.listkey).$ref.once("value", (snaphot: firebase.database.DataSnapshot) => {
      this.list = snaphot.val();
      if (this.list == null) {
        console.warn("ListFromMapPage: null list data. Going back.");
        alertCtrl.create({
          title: 'Info',
          subTitle: "Impossibile trovare la lista selezionata. Questo può verificarsi se la lista è stata ritirata dal richiedente.",
          buttons: ['Ok']
        });
        navCtrl.pop();
      }
    }).catch((err: Error) => {
      console.warn("ListFromMapPage: cannot retrieve list data: " + err.message);
      alertCtrl.create({
        title: 'Info',
        subTitle: "Impossibile recuperare i dettagli della lista.",
        buttons: ['Ok']
      });
      navCtrl.pop();
      });

    af.database.object("/users/" + this.listowner).$ref.once("value", (snaphot: firebase.database.DataSnapshot) => {
      this.owner = snaphot.val();
      if (this.owner == null) {
        console.warn("ListFromMapPage: null owner data. Going back.");
        alertCtrl.create({
          title: 'Info',
          subTitle: "Impossibile recuperare tutti i dettagli relativi alla lista selezionata.",
          buttons: ['Ok']
        });
        navCtrl.pop();
      }
    }).catch((err: Error) => {
      console.warn("ListFromMapPage: cannot retrieve owner data: " + err.message);
      alertCtrl.create({
        title: 'Info',
        subTitle: "Impossibile recuperare tutti i dettagli relativi alla lista selezionata.",
        buttons: ['Ok']
      });
      navCtrl.pop();
    });
  }

  ViewAddress(address: any): void {
    console.log("ListFromMapPage: goto view address");
    this.navCtrl.push(AddressViewStaticPage, { address: address.value });
  }

  ViewItems(): void {
    console.log("ListFromMapPage: goto view items");
    this.navCtrl.push(PublicatedListProductsPage, { items: this.list.Items });
  }

}
