﻿import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { FeasyUser, FeasyList, FeasyItem, GetUnitNameFromEnum } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { AddOrShowItemPage } from '../../pages/13A_specific_product_demander/13A_specific_product_demander';
import { PublicateListFirstPage } from '../../pages/9A_publicate_list/9A_publicate_list';

@Component({
  selector: 'page-list',
  templateUrl: '7_list.html'
})
export class ListPage {

  public list_key: string;
  public no_items: boolean = true;
  private list: FeasyList = new FeasyList("");

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public globals: Globals) {
    this.list_key = navParams.get('list_key');
    if (this.list_key == null) {
      console.warn("ListPage null list_key!!");
      this.navCtrl.pop();
    } else {
      this.list = globals.GetUnpublishedListByKey(this.list_key);
      this.no_items = Object.keys(this.list.Items).length == 0;
      //this.items_db = globals.af.list('unpublished_lists/' + globals.UID + '/' + this.list.$key + '/Items');
      //this.items_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      //  console.log("VALUE ITEMS!");
      //  this.no_items = !snapshot.hasChildren();
      //  this.list.Items = snapshot.val() || {};
      //});
    }
  }


  addItem(): void {
    console.log("Goto add item");
    this.navCtrl.push(AddOrShowItemPage, { list_key: this.list_key });
  }

  goToItem(item: any): void {
    console.log("Goto update item: " + item.value.Name);
    this.navCtrl.push(AddOrShowItemPage, { list_key: this.list_key, item: item.value, item_key: item.key });
  }

  publicateList(): void {
    if (Object.keys(this.list.Items).length == 0) {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Aggiungere almeno un elemento alla lista",
        buttons: ['Ok']
      });
      alert.present();
    } else {
      console.log("Goto publicate list: " + this.list.Name);
      this.navCtrl.push(PublicateListFirstPage, { list_key: this.list_key })
    }
  }


  deleteList(): void {
    console.log("Deleting list: " + this.list.Name);
    this.globals.af.list('/unpublished_lists/' + this.globals.UID).remove(this.list_key).then(res => {
      console.log("List removed");
      this.navCtrl.pop();
    }).catch((res: Error) => {
      console.warn("Cannot remove list: " + res.message);
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Impossibile rimuovere la lista",
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  public GetUnitName(val: any): string {
    return GetUnitNameFromEnum(val);
  }

}
