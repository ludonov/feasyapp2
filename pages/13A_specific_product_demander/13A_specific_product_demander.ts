﻿import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { StripForFirebase, UnitType, GetUnits, GetUnitNameFromEnum, FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

@Component({
  selector: 'page-item-add-or-show',
  templateUrl: '13A_specific_product_demander.html'
})
export class AddOrShowItemPage {

  public is_new: boolean;
  public list_key: string;
  public item_key: string;
  public item: FeasyItem;
  public items_db: FirebaseListObservable<any>;
  public units: string[] = GetUnits();

  @ViewChild('NameInput') NameInputField;

  constructor(public navCtrl: NavController, public globals: Globals, public navParams: NavParams, af: AngularFire, public alertCtrl: AlertController) {
    this.list_key = navParams.get('list_key');
    this.item_key = navParams.get('item_key');
    if (this.list_key == null) {
      console.warn("AddOrShowItemPage null list_key!!");
      this.navCtrl.pop();
    } else {
      let item = navParams.get('item');
      this.is_new = item == undefined || item == null;
      if (this.is_new) {
        this.item = new FeasyItem("", 1);
      } else {
        this.item = item;
      }
      if (this.item.Unit == null) {
        this.item.Unit = UnitType.Pieces;
        this.units = [];
        this.units = GetUnits();
      }
      this.items_db = af.database.list('unpublished_lists/' + globals.UID + '/' + this.list_key + '/Items');
    }
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.NameInputField.setFocus();
    }, 150);
  }


  save(): void {

    if (this.item.Name == "") {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: 'Il nome non può essere vuoto',
        buttons: ['Ok']
      });
      alert.present();
    } else if (this.item.Qty <= 0) {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: 'La quantità deve essere maggiore di zero',
        buttons: ['Ok']
      });
      alert.present();
    } else {
      console.log("Saving item");
      if (this.is_new) {
        let new_item_promise = this.items_db.push(this.item);
        let new_item_key = new_item_promise.key;
        new_item_promise.then(new_item_db => {
          console.log("New item <" + new_item_key + "> saved");
          this.item.$key = new_item_key;
          this.navCtrl.pop();
        });
      } else {
        this.items_db.update(this.item_key, StripForFirebase(this.item)).then(res => {
          console.log("Existing item <" + this.item.$key + " updated");
          this.navCtrl.pop();
        });

      }
    }
  }


  delete(): void {
    console.log("Deleting item: " + this.item.Name);
    this.items_db.remove(this.item_key).then(res => {
      console.log("Item removed");
      this.navCtrl.pop();
    }).catch((res: Error) => {
      console.warn("Cannot remove item: " + res.message);
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Impossibile rimuovere l'elemento",
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  public GetUnitName(val: any): string {
    return GetUnitNameFromEnum(val);
  }

}
