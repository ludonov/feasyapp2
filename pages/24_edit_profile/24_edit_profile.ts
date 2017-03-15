import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseError } from 'firebase';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, StripForFirebase, copyObject } from '../../classes/Feasy';

import { SettingsPage } from '../../pages/23_settings/23_settings';


@Component({
  selector: 'page-editprofile',
  templateUrl: '24_edit_profile.html'
})
export class EditProfilePage {

  public user: FeasyUser = new FeasyUser("", "", "");
  public user_db: FirebaseObjectObservable<any>;
  public address: DeliveryAddress = new DeliveryAddress();

  constructor(public navCtrl: NavController, public af: AngularFire, public alertCtrl: AlertController) {
    this.user_db = af.database.object("users/" + af.auth.getAuth().uid);
    this.user_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.user = snapshot.val();
      if (this.user == null) {
        this.user = new FeasyUser(af.auth.getAuth().auth.email, "", "");
      }
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

