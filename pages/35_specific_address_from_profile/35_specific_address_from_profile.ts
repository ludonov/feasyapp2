import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';


@Component({
  selector: 'page-specific-address-from-profile',
  templateUrl: '35_specific_address_from_profile.html'
})

export class SpecificAddressFromProfilePage {

  public address: DeliveryAddress;
  public addresses_db: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public af: AngularFire, public navParams: NavParams, public globals: Globals, public alertCtrl: AlertController) {
    this.address = navParams.get('address');
    /*this.addresses_db = af.database.list("users/" + globals.UID + "/Addresses");
    this.addresses_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
        this.addresses=snapshot.val();
    });*/

    }

}
