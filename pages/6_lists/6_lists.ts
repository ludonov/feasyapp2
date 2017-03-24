import { Component, Pipe, PipeTransform, Injectable } from '@angular/core';

import { NavController, AlertController, Loading, LoadingController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { ListPage } from '../../pages/7_list/7_list';
import { PublicatedListNoShopperPage } from '../../pages/10_publicated_list_no_shopper/10_publicated_list_no_shopper';


@Component({
  selector: 'page-lists',
  templateUrl: '6_lists.html'
})
export class ListsPage {

  //public published_lists: Object;
  //public unpublished_lists: Object;
  //public published_lists_db: FirebaseListObservable<any>;
  //public unpublished_lists_db: FirebaseListObservable<any>;
  //public no_published_list: boolean = true;
  //public no_unpublished_list: boolean = true;
  public num_items: number = 0;

  constructor(public navCtrl: NavController, public af: AngularFire, public alertCtrl: AlertController, public globals: Globals) {
    //this.published_lists_db = af.database.list('/published_lists/' + globals.UID);
    //this.unpublished_lists_db = af.database.list('/unpublished_lists/' + globals.UID);
    //this.published_lists_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
    //  this.published_lists = {};
    //  snapshot.forEach(list => {
    //    let _list: FeasyList = list.val();
    //    _list.$key = list.key;
    //    _list.ItemsCount = list.hasChild("Items") ? list.child("Items").numChildren() : 0;
    //    this.published_lists[list.key] = _list;
    //    return false;
    //  });
    //  this.no_published_list = !snapshot.hasChildren();
    //});
    //this.unpublished_lists_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
    //  this.unpublished_lists = {};
    //  snapshot.forEach(list => {
    //    let _list: FeasyList = list.val();
    //    _list.$key = list.key;
    //    _list.ItemsCount = list.hasChild("Items") ? list.child("Items").numChildren() : 0;
    //    this.unpublished_lists[list.key] = _list;
    //    return false;
    //  });
    //  this.no_unpublished_list = !snapshot.hasChildren();
    //});
  }

  GetItemsCount(list: any): string {
    return (list == null || list.Items == null ? "0" : Object.keys(list.Items).length.toString());
  }


  addList(): void {
    console.log("Adding list");
    let alert = this.alertCtrl.create({
      title: 'Nuova Lista',
      message: "Inserisci il nome della nuova lista",
      inputs: [
        {
          name: 'name',
          placeholder: ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if (data.name != "") {
              let new_list: FeasyList = new FeasyList(data.name);
              new_list.owner = this.globals.UID;
              new_list.CreatedDate = (new Date()).toUTCString();
              let new_list_promise = this.globals.UnpublishedLists_db.push(new_list);
              let new_list_key = new_list_promise.key;
              new_list_promise.then(new_list_db => {
                new_list.$key = new_list_key;
                this.navCtrl.push(ListPage, { list_key: new_list_key });
              });
            } else {
              console.warn('Inserted null list name');
              let alert = this.alertCtrl.create({
                title: 'Info',
                subTitle: 'Il nome non può essere vuoto',
                buttons: ['Ok']
              });
              alert.present();
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }


  goToList(list: any): void {
    console.log("Goto list: " + list.Name);
    this.navCtrl.push(ListPage, { list_key: list.$key });
  }

  goToPublicatedList(list: any): void {
    console.log("Goto publicated list: " + list.Name);
    this.navCtrl.push(PublicatedListNoShopperPage, { list_key: list.$key });
  }

}
