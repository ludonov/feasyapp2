import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { StripForFirebase, GetUnits, FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

@Component({
  selector: 'page-item-add-or-show',
  templateUrl: '13A_specific_product_demander.html'
})
export class AddOrShowItemPage {

  public is_new: boolean;
  public list: FeasyList;
  public item: FeasyItem;
  public items_db: FirebaseListObservable<any>;
  public units: string[] = GetUnits();

  constructor(public navCtrl: NavController, public navParams: NavParams, af: AngularFire, public alertCtrl: AlertController) {
    this.list = navParams.get('list');
    let item = navParams.get('item');
    this.is_new = item == undefined || item == null;
    if (this.is_new) {
      this.item = new FeasyItem("", 1);
    } else {
      this.item = item;
    }
    if (this.item.Unit == null) {
      this.item.Unit = "Pezzi";
      this.units = [];
      this.units = GetUnits();
    }
    this.items_db = af.database.list('unpublished_lists/' + this.list.$key + '/Items');
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
        this.items_db.update(this.item.$key, StripForFirebase(this.item)).then(res => {
          console.log("Existing item <" + this.item.$key + " updated");
          this.navCtrl.pop();
        });

      }
    }
  }


  delete(): void {
    console.log("Deleting item: " + this.item.Name);
    this.items_db.remove(this.item.$key).then(res => {
      console.log("Item removed");
    }).catch((res: Error) => {
      console.log("Cannot remove item: " + res.message);
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Impossibile rimuovere l'elemento",
        buttons: ['Ok']
      });
      alert.present();
    });
  }

}
