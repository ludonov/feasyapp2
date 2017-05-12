import { Component } from '@angular/core';

import { NavController, AlertController, Alert, NavParams, Loading, LoadingController } from 'ionic-angular';
import { FirebaseError } from 'firebase';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, StripForFirebase, GenderType, GetGenderNameFromEnum, GetEnumFromGenderName } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';


@Component({
  selector: 'page-viewbigimage',
  templateUrl: '42_view_big_picture.html'
})
export class ViewBigImage {

  public image = { content : "" };

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    let content = navParams.get("image_content");
    if (content == null) {
      console.warn("ViewBigImage> null image_content");
      navCtrl.pop();
    } else {
      this.image.content = content;
    }
  }

}
