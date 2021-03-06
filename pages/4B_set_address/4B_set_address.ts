﻿

import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseError } from 'firebase';

import { TabsPage } from '../../pages/tabs/tabs';
import { SetPaymentMethodPage } from '../../pages/4C_set_payment_method/4C_set_payment_method';
import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, StripForFirebase, copyObject } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

@Component({
    selector: 'page-setaddress',
    templateUrl: '4B_set_address.html'
})
export class SetAddressPage {

    public addresses_db: FirebaseListObservable<any>;
    public address: DeliveryAddress = new DeliveryAddress();

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public globals: Globals) {
        this.addresses_db = globals.af.list("users/" + globals.UID + "/Addresses"); // aggiunto


    }

    skipToTabRoot(): void {
        console.log("skip to tab root 1");
        this.navCtrl.setRoot(TabsPage);
    }

    setAddress(): void {
        console.log("personal address set");
        //this.user_db.push(this.address);
        this.address.Geocode(this.alertCtrl).then((res) => {
            let new_address_promise = this.addresses_db.push(this.address);
            let new_address_key = new_address_promise.key;
            new_address_promise.then(new_address_db => {
                this.navCtrl.setRoot(TabsPage);
            }).catch((err: Error) => {
                console.warn("Error: " + err.message);
            });
        }).catch((err: Error) => {
            console.log("Cannot geocode: " + err.message);
        });

    }

}

