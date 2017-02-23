
import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, StripForFirebase, copyObject } from '../../classes/Feasy';


import { SetAddressPage } from '../../pages/4B_set_address/4B_set_address';
import { HomePage } from '../../pages/5_home/5_home';


@Component({
  selector: 'page-setpersonaldetails',
  templateUrl: '4A_set_personal_details.html'
})
export class SetPersonalDetailsPage {

  public user: FirebaseObjectObservable<any>;

  constructor(public navCtrl: NavController, public af: AngularFire, public alertController: AlertController) {
    this.user = af.database.object("users/" + af.auth.getAuth().uid);
  }

  skipToHome(): void {
    console.log("skip to home");
    //this.navCtrl.push(HomePage);

    this.user.set(this.user).then(res => {
      //this.navCtrl.push(new page);
    }).catch((err: Error) => {
      console.log("Error: " + err.message);
    });

  }

  setPersonalDetails(): void {
    console.log("personal details set");
    this.navCtrl.push(SetAddressPage);
  }

}


