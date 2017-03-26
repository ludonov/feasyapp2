﻿import { Component, forwardRef, Inject } from '@angular/core';

import { NavController, NavParams, AlertController, Alert } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate } from '../../classes/Feasy';

import { Globals } from '../../classes/Globals';

@Component({
  selector: 'page-publicated-with-shopper-pov-shopper',
  templateUrl: '11B_publicated_list_with_shopper_pov_shopper.html'
})

export class PublicatedListWithShopperPovShopperPage {

  private list_owner: string;
  private list_key: string;
  private candidature_key: string;

  private list: FeasyList = new FeasyList("");
  private demander: FeasyUser = new FeasyUser("", "", "");
  private candidature: Candidate = new Candidate();
  private address: DeliveryAddress = new DeliveryAddress();

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(forwardRef(() => Globals)) public globals: Globals, public af: AngularFire, public alertCtrl: AlertController) {
    this.list_key = navParams.get("list_key");
    this.list_owner = navParams.get("list_owner");
    this.candidature_key = navParams.get("candidature_key");
    this.candidature = navParams.get("candidature");

    if (this.list_key == null || this.list_owner == null || this.candidature_key == null || this.candidature == null) {
      console.warn("PublicatedListCandidatesPage: null listkeylist_owner/candidature_key/candidature. Going back.");
      navCtrl.pop();
    } else {
      this.af.database.object("/Users/" + this.list_owner).$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
        this.demander = snapshot.val() || new FeasyUser("", "", "");
      });
      this.af.database.object("/published_lists/" + this.list_owner + "/" + this.list_key).$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
        let _val = snapshot.val();
        if (_val != null) {
          this.list = _val;
          this.address = this.list.DeliveryAddresses[this.candidature.AddressKey];
        } else {
          let alert: Alert = alertCtrl.create({
            title: 'Info',
            subTitle: "Impossibile trovare la lista selezionata. Questo può verificarsi se la lista è stata ritirata dal richiedente.",
            buttons: ['Ok']
          });
          alert.onDidDismiss(() => {
            navCtrl.pop();
          });
          alert.present();
        }
      });
    }
  }

}
