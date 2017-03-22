import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { FirebaseError } from 'firebase';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, StripForFirebase, copyObject, PlainAddress } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';
import { SettingsPage } from '../../pages/23_settings/23_settings';


@Component({
  selector: 'page-editprofile',
  templateUrl: '24_edit_profile.html'
})
export class EditProfilePage {

  public user: FeasyUser = new FeasyUser("", "", "");
  public user_db: FirebaseObjectObservable<any>;
  public addresses: Object = {};
  public addresses_db: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public af: AngularFire, public globals: Globals, public alertCtrl: AlertController) {
    this.user_db = af.database.object("users/" + globals.UID);
    this.addresses_db = af.database.list("users/" + globals.UID + "/Addresses");
    this.user_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.user = snapshot.val();
      if (this.user == null) {
        this.user = new FeasyUser(af.auth.getAuth().auth.email, "", "");
      }
    });

    this.addresses_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.addresses = {};
      snapshot.forEach( (address: any) => {
        this.addresses[address.key] = address;
        return false;
      });
    });

    }

  changeProfile(): void {
    console.log("personal address set");
    //this.user.Address = this.address; 
    this.user_db.update(StripForFirebase(this.user)).then(res => {
    //this.navCtrl.setRoot(SetPaymentMethodPage);
    this.navCtrl.pop();
    }).catch((err: Error) => {
      console.log("Error: " + err.message);
    });
  }


}

