

import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseError } from 'firebase';

import { HomePage } from '../../pages/5_home/5_home';
import { SetPaymentMethodPage } from '../../pages/4C_set_payment_method/4C_set_payment_method';
import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, StripForFirebase, copyObject, PlainAddress } from '../../classes/Feasy';


@Component({
  selector: 'page-setaddress',
  templateUrl: '4B_set_address.html'
})
export class SetAddressPage {

  public user: FeasyUser = new FeasyUser("", "", "");
  public user_db: FirebaseObjectObservable<any>;
  public address: PlainAddress = new PlainAddress();

    constructor(public navCtrl: NavController, public af: AngularFire, public alertCtrl: AlertController) {
    this.user_db = af.database.object("users/" + af.auth.getAuth().uid);
    this.user_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.user = snapshot.val();
      if (this.user == null) {
        this.user = new FeasyUser(af.auth.getAuth().auth.email, "", "");
      }
    });
  }

  skipToHome(): void {
    console.log("skip to home");
    this.navCtrl.setRoot(HomePage);
  }

  setAddress(): void {
    console.log("personal address set");
    this.user.Address = this.address; 
    this.user_db.update(StripForFirebase(this.user)).then(res => {
    //this.navCtrl.setRoot(SetPaymentMethodPage);
    this.navCtrl.setRoot(HomePage);
    }).catch((err: Error) => {
      console.log("Error: " + err.message);
    });
  }

}

