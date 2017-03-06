import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs, LoadingController, Loading, LoadingOptions, Alert } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate, StripForFirebase } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

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
  private loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public globals: Globals) {

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
        let alert: Alert = alertCtrl.create({
          title: 'Info',
          subTitle: "Impossibile trovare la lista selezionata. Questo può verificarsi se la lista è stata ritirata dal richiedente.",
          buttons: ['Ok']
        });
        alert.onDidDismiss(() => {
          navCtrl.pop();
        });
        alert.present();
      }
    }).catch((err: Error) => {
      console.warn("ListFromMapPage: cannot retrieve list data: " + err.message);
      let alert: Alert = alertCtrl.create({
        title: 'Info',
        subTitle: "Impossibile recuperare i dettagli della lista.",
        buttons: ['Ok']
      });
      alert.onDidDismiss(() => {
        navCtrl.pop();
      });
      alert.present();
    });

    af.database.object("/users/" + this.listowner).$ref.once("value", (snaphot: firebase.database.DataSnapshot) => {
      this.owner = snaphot.val();
      if (this.owner == null) {
        console.warn("ListFromMapPage: null owner data. Going back.");
        let alert: Alert = alertCtrl.create({
          title: 'Info',
          subTitle: "Impossibile recuperare tutti i dettagli relativi alla lista selezionata.",
          buttons: ['Ok']
        });
        alert.onDidDismiss(() => {
          navCtrl.pop();
        });
        alert.present();
      }
    }).catch((err: Error) => {
      console.warn("ListFromMapPage: cannot retrieve owner data: " + err.message);
      let alert: Alert = alertCtrl.create({
        title: 'Info',
        subTitle: "Impossibile recuperare tutti i dettagli relativi alla lista selezionata.",
        buttons: ['Ok']
      });
      alert.onDidDismiss(() => {
        navCtrl.pop();
      });
      alert.present();
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

  Apply(): void {
    console.log("ListFromMapPage: applying to list");

    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });

    this.loading.present();

    this.af.database.list("/candidates/" + this.listowner + "/" + this.listkey).push(StripForFirebase(new Candidate(this.globals.UID, this.globals.DisplayName))).then(() => {
      console.log("ListFromMapPage: candidate added!");
      this.loading.dismiss();
      let alert: Alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Ti sei candidato alla lista!",
        buttons: ['Ok']
      });
      alert.onDidDismiss(() => {
        this.navCtrl.pop();
      });
      alert.present();
    }).catch((err: Error) => {
      this.loading.dismiss();
      console.log("ListFromMapPage: cannot candidate: " + err.message);
      let alert: Alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Impossibile candidarsi alla lista selezionata.",
        buttons: ['Ok']
      });
      alert.present();
    });


  }

}
