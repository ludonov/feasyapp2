import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

// import { SpecificAddressFromProfilePage } from '../pages/35_specific_address_from_profile/35_specific_address_from_profile';
import { SpecificAddressFromProfilePage } from '../../pages/35_specific_address_from_profile/35_specific_address_from_profile';


@Component({
  selector: 'page-addresses-from-profile',
  templateUrl: '34_addresses_from_profile.html'
})

export class AddressesFromProfilePage {

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

  ViewAddress(address: any) {
     if (address.value == null)
       address.value = {};
    this.navCtrl.push(SpecificAddressFromProfilePage, {address: address.value});
  }

}
