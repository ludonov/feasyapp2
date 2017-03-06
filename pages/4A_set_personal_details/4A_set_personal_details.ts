
import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseError } from 'firebase';

import { SetAddressPage } from '../../pages/4B_set_address/4B_set_address';
import { HomePage } from '../../pages/5_home/5_home';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, StripForFirebase, copyObject } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';


@Component({
  selector: 'page-setpersonaldetails',
  templateUrl: '4A_set_personal_details.html'
})
export class SetPersonalDetailsPage {

  public user: FeasyUser = new FeasyUser("", "", "");
  public user_db: FirebaseObjectObservable<any>;

  constructor(public navCtrl: NavController, public globals: Globals, public af: AngularFire, public alertCtrl: AlertController) {
    this.user_db = af.database.object("users/" + globals.UID);
    this.user_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.user = snapshot.val();
      if (this.user == null) {
        this.user = new FeasyUser(af.auth.getAuth().auth.email, "", "");
      }
    });
  }

  skipToHome(): void {
    console.log("skip to home");
    this.navCtrl.push(HomePage);
  }

  setPersonalDetails(): void {
    console.log("personal details set");
    this.user_db.update(StripForFirebase(this.user)).then(res => {
      this.navCtrl.push(SetAddressPage);
    }).catch((err: Error) => {
      console.log("Error: " + err.message);
    });
  }

}


