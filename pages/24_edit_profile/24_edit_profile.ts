import { Component } from '@angular/core';

import { NavController, AlertController, Alert, NavParams, Loading, LoadingController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public globals: Globals, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

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
    this.globals.InputImage(this.globals.BIG_IMAGE_MAX_WIDTH(), this.globals.BIG_IMAGE_MAX_HEIGHT()).then(img => {
      let loading: Loading = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Publishing...'
      });
      loading.present();
      if (img != null) {
        console.log("EditProfilePage> Selected image");
        this.globals.af.object("/pics/" + this.globals.UID + "/Big").set(img).then(() => {
          this.globals.SetNewUserPicBig(img);
          this.globals.ResizeImage(img, this.globals.SMALL_IMAGE_MAX_WIDTH(), this.globals.SMALL_IMAGE_MAX_HEIGHT()).then(img_small => {
            this.globals.User.PhotoURL = img_small;
            this.globals.updateUser().then(() => {
              loading.dismiss();
            }).catch((err: Error) => {
              loading.dismiss();
            })
          }).catch((err: Error) => {
            loading.dismiss();
            console.warn("EditProfilePage> Cannot set small picture: " + err.message);
            this.globals.ShowGenericError();
          })
        }).catch((err: Error) => {
          loading.dismiss();
          console.warn("EditProfilePage> Cannot set big picture: " + err.message);
          this.globals.ShowGenericError();
        });
      }
    }).catch((err: Error) => {
      console.log("EditProfilePage> Err selecting image: " + err.message);
    });
  }
  
}

