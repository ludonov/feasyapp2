import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Alert, Tabs } from 'ionic-angular';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate, StripForFirebase } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { PaymentPage } from '../../pages/32_payment/32_payment';
import { PublicatedListProductsPage } from '../../pages/12_publicated_list_products/12_publicated_list_products';
import { AddressViewStaticPage } from '../../pages/30_address_view_static/30_address_view_static';

@Component({
  selector: 'page-publicated-with-shopper',
  templateUrl: '11_publicated_list_with_shopper.html'
})

export class PublicatedListWithShopperPage {

  private list_key: string;
  private ChosenCandidate: FeasyUser = new FeasyUser("", "", "");
  private ChosenAddress: DeliveryAddress = new DeliveryAddress();
  private list: FeasyList = new FeasyList("");
  private candidate: Candidate = new Candidate();

  constructor(public navCtrl: NavController, public globals: Globals, public navParams: NavParams,  public alertCtrl: AlertController) {
    this.list_key = navParams.get('list_key');
    if (this.list_key == undefined || this.list_key == null) {
      console.warn("PublicatedListWithShopperPage null list_key. Going back.")
      navCtrl.pop();
    } else {
      this.list = globals.GetPublishedListByKey(this.list_key);
      this.candidate = globals.getAcceptedCandidateFromList(this.list_key);
      if (this.candidate == null) {
        console.warn("PublicatedListWithShopperPage list should have an accepted candidate but non found. Going back.")
        navCtrl.pop();
      } else {
        this.ChosenAddress = this.list.DeliveryAddresses[this.candidate.AddressKey];
        globals.af.object("/users/" + this.candidate.uid).$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
          Object.assign(this.ChosenCandidate, snapshot.val());
          this.ChosenCandidate.SetImageOrDefault();
        });
      }
    }
  }

  ShowGenericError() {
    let alert = this.alertCtrl.create({
      title: 'Info',
      subTitle: "C'è stato un errore durante la terminazione della lista. Ritentare nuovamente.",
      buttons: ['Ok']
    });
    alert.present();
  }

  ViewAddress(): void {
    console.log("Going to AddressViewStaticPage");
    this.navCtrl.push(AddressViewStaticPage, { address: this.ChosenAddress });
  }

  ViewItems(): void {
    console.log("Going to PublicatedListProductsPage");
    this.navCtrl.push(PublicatedListProductsPage, { items: this.list.Items });
  }

  goToPaymentPage(): void {
    console.log("Going to PaymentPage");
    this.navCtrl.push(PaymentPage, { list_key: this.list_key});
  }

}
