import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, copyObject } from '../../classes/Feasy';

import { AddressViewPage } from '../../pages/29_address_view/29_address_view';


@Component({
  selector: 'page-publicate-list',
  templateUrl: '9_publicate_list.html'
})
export class PublicateListPage {

  public list: FeasyList;
  public DeliveryAddresses: Array<DeliveryAddress> = [];
  public addresses_db: FirebaseListObservable<any>;
  public no_addresses: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController) {
    this.list = navParams.get('list');
    if (this.list == undefined || this.list == null)
      navCtrl.pop();
    this.addresses_db = af.database.list('unpublished_lists/' + af.auth.getAuth().uid + '/' + this.list.$key + '/DeliveryAddresses');
    this.addresses_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.no_addresses = !snapshot.hasChildren();
      this.list.DeliveryAddresses = snapshot.val() || {};
    });
    //this.DeliveryAddresses = [];
    //if (this.list.DeliveryAddresses != null)
    //  this.list.DeliveryAddresses = {};
    //for (let key of Object.keys(this.list.DeliveryAddresses)) {
    //  this.DeliveryAddresses.push(this.list.DeliveryAddresses[key]);
    //}

  }


  AddAddress(): void {
    console.log("Goto add address");
    this.navCtrl.push(AddressViewPage, { addresses_db: this.addresses_db });
  }

  ViewAddress(address: DeliveryAddress): void {
    console.log("Goto view address:" + address.FormattedAddress);
    let _address: DeliveryAddress = new DeliveryAddress();
    copyObject(address, _address);
    this.navCtrl.push(AddressViewPage, { addresses_db: this.addresses_db, address: _address });
  }


  PublicateList(): void {
    console.log("Goto really publicate list: " + this.list.Name);
    if (Object.keys(this.list.DeliveryAddresses).length == 0) {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Aggiungere almeno un indirizzo",
        buttons: ['Ok']
      });
      alert.present();
    }

  }

}