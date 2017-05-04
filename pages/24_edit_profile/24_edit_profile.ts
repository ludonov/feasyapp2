import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
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
  public gender: string;

  constructor(public navCtrl: NavController, public globals: Globals, public alertCtrl: AlertController) {

    this.user = globals.User;
    this.gender = GetGenderNameFromEnum(this.user.Gender);
      
    } 

  changeProfile(): void {
    console.log("personal address set");
    //this.user.Address = this.address; 
    this.user.Gender = GetEnumFromGenderName(this.gender);
    this.globals.User_db.update(StripForFirebase(this.user)).then(res => {
    this.navCtrl.pop();
    }).catch((err: Error) => {
      console.log("Error: " + err.message);
    });
  }

  MyAddresses(): void {

    this.navCtrl.push(AddressesFromEditProfilePage);

  }

  selectImage() {
    this.globals.InputImage().then(img => {
      if (img != null) {
        console.log("Selected image");
        this.globals.User.PhotoURL = img;
        this.globals.updateUser();
      }
    }).catch((err: Error) => {
      console.log("Err selecting image: " + err.message);
    });
  }


}

