import { Component } from '@angular/core';

import { NavController, NavParams, NavOptions, AlertController, Loading, LoadingController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, GeoPoint, StripForFirebase, copyObject, ExpiryDateType, GetExpiryDates, GetRealExpiryDate } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { HomePage } from '../../pages/5_home/5_home';
import { AddressViewPage } from '../../pages/29_address_view/29_address_view';
import { PublicateListSecondPage } from '../../pages/9B_publicate_list/9B_publicate_list';


@Component({
  selector: 'page-publicate-list-first',
  templateUrl: '9A_publicate_list.html'
})
export class PublicateListFirstPage {

  public list: FeasyList = new FeasyList("");
  public list_key: string;
  public addresses_db: FirebaseListObservable<any>;
  //public published_lists_db: FirebaseListObservable<any>;
  //public unpublished_lists_db: FirebaseListObservable<any>;
  public no_addresses: boolean = true;
  public expirydates: string[] = GetExpiryDates();

  constructor(public navCtrl: NavController, public globals: Globals, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.list_key = navParams.get('list_key');
    if (this.list_key == undefined || this.list_key == null) {
      console.warn("PublicateListPage null list_key!!");
      navCtrl.pop();
    } else {
      //this.published_lists_db = af.database.list('/published_lists/' + globals.UID);
      //this.unpublished_lists_db = af.database.list('/unpublished_lists/' + globals.UID);
      this.list = globals.UnpublishedLists[this.list_key];
      this.no_addresses = Object.keys(this.list.DeliveryAddresses).length == 0;
      this.addresses_db = af.database.list('unpublished_lists/' + globals.UID + '/' + this.list.$key + '/DeliveryAddresses');
      this.addresses_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
        this.no_addresses = !snapshot.hasChildren();
        //this.list = globals.UnpublishedLists[this.list_key];
        this.list.DeliveryAddresses = snapshot.val() || {};
      });
      this.list.ExpiryDate = ExpiryDateType.InThreeDays;
    }
  }


  AddAddress(): void {
    console.log("Goto add address");
    this.navCtrl.push(AddressViewPage, { list_key: this.list_key });
  }

  ViewAddress(address: any): void {
    console.log("Goto view address:" + address.FormattedAddress);
    let _address: DeliveryAddress = new DeliveryAddress();
    copyObject(address.value, _address);
    this.navCtrl.push(AddressViewPage, { list_key: this.list_key, address: _address, address_key: address.key });
  }


  GoToPublicateListSecond(): void {
    console.log("Goto really publicate list: " + this.list.Name);
    if (Object.keys(this.list.DeliveryAddresses).length == 0) {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Aggiungere almeno un indirizzo",
        buttons: ['Ok']
      });
      alert.present();
    } else if (this.list.Reward == null || this.list.Reward == 0) {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Inserire la mancia",
        buttons: ['Ok']
      });
      alert.present();
    } else {
      let list_copy: FeasyList = Object.assign({}, this.list);
      console.log("going to page publicate list 2");
      this.navCtrl.push(PublicateListSecondPage, {list_copy: list_copy, list_key: this.list_key});
    }

  }

  ShowGenericError() {
    let alert = this.alertCtrl.create({
      title: 'Info',
      subTitle: "C'è stato un errore durante la pubblicazione della lista. Controllare sulla mappa se la lista è visualizzata correttamente.",
      buttons: ['Ok']
    });
    alert.present();
  }
}