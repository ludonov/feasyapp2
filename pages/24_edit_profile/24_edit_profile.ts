import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { FirebaseError } from 'firebase';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, StripForFirebase, GenderType, GetGenderNameFromEnum, GetEnumFromGenderName } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';
import { SettingsPage } from '../../pages/23_settings/23_settings';
import { AddressesFromEditProfilePage } from "../36_addresses_from_edit_profile/36_addresses_from_edit_profile";


@Component({
  selector: 'page-editprofile',
  templateUrl: '24_edit_profile.html'
})
export class EditProfilePage {

  public user: FeasyUser = new FeasyUser("", "", "");
  public addresses: Object = {};
  public addresses_db: FirebaseListObservable<any>;
  public gender: string;

  constructor(public navCtrl: NavController, public af: AngularFire, public globals: Globals, public alertCtrl: AlertController) {

    this.user = globals.User;
    this.gender = GetGenderNameFromEnum(this.user.Gender);

    this.addresses_db = af.database.list("users/" + globals.UID + "/Addresses");
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
    this.user.Gender=GetEnumFromGenderName(this.gender);
    this.globals.User_db.update(StripForFirebase(this.user)).then(res => {
    this.navCtrl.pop();
    }).catch((err: Error) => {
      console.log("Error: " + err.message);
    });
  }

  MyAddresses(): void {

    this.navCtrl.push(AddressesFromEditProfilePage);

  }


}

