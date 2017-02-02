import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem } from '../../classes/Feasy';

import { AddOrShowItemPage } from '../../pages/13A_specific_product_demander/13A_specific_product_demander';

@Component({
  selector: 'page-list',
  templateUrl: '7_list.html'
})
export class ListPage {

  public list: FeasyList;
  public items_db: FirebaseListObservable<any>;
  public no_items: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController) {
    this.list = navParams.get('list');
    this.items_db = af.database.list('unpublished_lists/' + af.auth.getAuth().uid + '/' + this.list.$key + '/Items');
    this.items_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.no_items = !snapshot.hasChildren();
    });
  }


  addItem(): void {
    console.log("Goto add item");
    this.navCtrl.push(AddOrShowItemPage, { list: this.list })
  }

  goToItem(item: any): void {
    console.log("Goto update item: " + item.Name);
    this.navCtrl.push(AddOrShowItemPage, { list: this.list, item: item })
  }


  publicateList(list: any): void {
    console.log("Goto publicate list: " + list.Name);
  }


  deleteList(): void {
    console.log("Deleting list: " + this.list.Name);
    this.af.database.list('/unpublished_lists/' + this.af.auth.getAuth().uid).remove(this.list.$key).then(res => {
      console.log("List removed");
      this.navCtrl.pop();
    }).catch((res: Error) => {
      console.log("Cannot remove list: " + res.message);
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Impossibile rimuovere la lista",
        buttons: ['Ok']
      });
      alert.present();
    });
  }

}
