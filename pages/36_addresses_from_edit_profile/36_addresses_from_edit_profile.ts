import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';
import { SpecificAddressFromEditProfilePage } from '../37_specific_address_from_edit_profile/37_specific_address_from_edit_profile';
import { AddNewAddressPage } from '../38_add_new_address/38_add_new_address';


@Component({
  selector: 'page-addresses-from-edit-profile',
  templateUrl: '36_addresses_from_edit_profile.html'
})

export class AddressesFromEditProfilePage {

  public addresses: Object = {};
  public addresses_db: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public af: AngularFire, public globals: Globals, public alertCtrl: AlertController) {
    this.addresses_db = af.database.list("users/" + globals.UID + "/Addresses");

    this.addresses_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
        this.addresses=snapshot.val();
      /*this.addresses = {};
      snapshot.forEach( (address: any) => {
        this.addresses[address.key] = address;
        return false;
      });*/
    });

    }

  viewAddress(address: any) {
     if (address.value == null)
       address.value = {};
    this.navCtrl.push(SpecificAddressFromEditProfilePage, {address: address.value});
  }

  addAddress(): void {
    this.navCtrl.push(AddNewAddressPage);
  }

}
