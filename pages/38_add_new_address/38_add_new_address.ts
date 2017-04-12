

import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { FirebaseError } from 'firebase';

import { TabsPage } from '../../pages/tabs/tabs';
import { HomePage } from '../../pages/5_home/5_home';
import { SetPaymentMethodPage } from '../../pages/4C_set_payment_method/4C_set_payment_method';
import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, StripForFirebase, copyObject } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

@Component({
  selector: 'page-add-new-address',
  templateUrl: '38_add_new_address.html'
})
export class AddNewAddressPage {

  public addresses_db: FirebaseListObservable<any>;
  public address: DeliveryAddress = new DeliveryAddress();

    constructor(public navCtrl: NavController, public af: AngularFire, public alertCtrl: AlertController, public globals: Globals) {
    this.addresses_db = af.database.list("users/" + af.auth.getAuth().uid + "/Addresses"); // aggiunto
    
    
    }

  setAddress(): void {
    console.log("personal address set");
    //this.user_db.push(this.address);
    this.address.Geocode(this.alertCtrl).then( (res) => {
      let new_address_promise = this.addresses_db.push(this.address);
      let new_address_key = new_address_promise.key;
      new_address_promise.then(new_address_db => {
          this.navCtrl.pop();
      }).catch((err: Error) => {
        console.warn("Error: " + err.message);
      });
    }).catch((err: Error) => {
      console.log("Cannot geocode: " + err.message);
    });

  }

}

