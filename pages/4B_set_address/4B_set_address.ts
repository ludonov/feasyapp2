

import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseError } from 'firebase';

import { TabsPage } from '../../pages/tabs/tabs';
import { SetPaymentMethodPage } from '../../pages/4C_set_payment_method/4C_set_payment_method';
import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, StripForFirebase, copyObject } from '../../classes/Feasy';


@Component({
  selector: 'page-setaddress',
  templateUrl: '4B_set_address.html'
})
export class SetAddressPage {

  public user: FeasyUser = new FeasyUser("", "", "");
  public user_db: FirebaseObjectObservable<any>;
  public address: DeliveryAddress = new DeliveryAddress();

    constructor(public navCtrl: NavController, public af: AngularFire, public alertCtrl: AlertController) {
    this.user_db = af.database.object("users/" + af.auth.getAuth().uid + "/Addresses"); // aggiunto
    this.user_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.user = snapshot.val();
      if (this.user == null) {
        this.user = new FeasyUser(af.auth.getAuth().auth.email, "", "");
      }
    });
  }

  skipToHome(): void {
    console.log("skip to home");
    this.navCtrl.setRoot(TabsPage);
  }

  setAddress(): void {
    console.log("personal address set");
    //this.user_db.push(this.address);
    this.user.Address = this.address; 
    this.user_db.update(StripForFirebase(this.user)).then(res => {
    //this.navCtrl.setRoot(SetPaymentMethodPage);
    this.navCtrl.setRoot(TabsPage);
    }).catch((err: Error) => {
      console.log("Error: " + err.message);
    });
  }

}

