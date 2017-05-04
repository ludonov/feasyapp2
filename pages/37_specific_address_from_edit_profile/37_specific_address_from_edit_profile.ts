import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, StripForFirebase, copyObject } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';


@Component({
  selector: 'page-specific-address-from-edit-profile',
  templateUrl: '37_specific_address_from_edit_profile.html'
})

export class SpecificAddressFromEditProfilePage {

  public address: DeliveryAddress = new DeliveryAddress();
  public address_key: string;
  public addresses_db: FirebaseListObservable<any>;
  //public addresses: Object = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,   public globals: Globals, public alertCtrl: AlertController) {
    this.address = navParams.get('address');
    this.address_key = navParams.get('address_key');
    this.addresses_db = globals.af.list("users/" + globals.UID + "/Addresses");
    } 

changeAddress(): void {
    this.address.Geocode(this.alertCtrl).then( (res) => {
      this.addresses_db.update(this.address_key, StripForFirebase(this.address)).then(res => {
        this.navCtrl.pop();
      }).catch((err: Error) => {
        console.log("Cannot update: " + err.message);
      });
    }).catch((err: Error) => {
      console.log("Cannot geocode: " + err.message);
    });

}

deleteAddress(): void {
    this.addresses_db.remove(this.address_key).then(res => {
      //console.log("List removed");
      this.navCtrl.pop();
    }).catch((res: Error) => {
      console.warn("Cannot remove list: " + res.message);
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Impossibile rimuovere la indirizzo",
        buttons: ['Ok']
      });
      alert.present();
    });

}

}
