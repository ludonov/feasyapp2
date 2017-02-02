import { Component, Pipe, PipeTransform, Injectable } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList } from '../../classes/Feasy';

import { ListPage } from '../../pages/7_list/7_list';


@Component({
  selector: 'page-lists',
  templateUrl: '6_lists.html'
})
export class ListsPage {

  public published_lists: Object;
  public unpublished_lists: Object;
  public published_lists_db: FirebaseListObservable<any>;
  public unpublished_lists_db: FirebaseListObservable<any>;
  public no_published_list: boolean = true;
  public no_unpublished_list: boolean = true;
  public num_items: number = 0;

  constructor(public navCtrl: NavController, af: AngularFire, public alertCtrl: AlertController) {
    this.published_lists_db = af.database.list('/published_lists/' + af.auth.getAuth().uid);
    this.unpublished_lists_db = af.database.list('/unpublished_lists/' + af.auth.getAuth().uid);
    this.published_lists_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.published_lists = {};
      snapshot.forEach(list => {
        let _list: FeasyList = list.val();
        _list.$key = list.key;
        _list.ItemsCount = list.hasChild("Items") ? list.child("Items").numChildren() : 0;
        this.published_lists[list.key] = _list;
        return false;
      });
      this.no_published_list = !snapshot.hasChildren();
    });
    this.unpublished_lists_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.unpublished_lists = {};
      snapshot.forEach(list => {
        let _list: FeasyList = list.val();
        _list.$key = list.key;
        _list.ItemsCount = list.hasChild("Items") ? list.child("Items").numChildren() : 0;
        this.unpublished_lists[list.key] = _list;
        return false;
      });
      this.no_unpublished_list = !snapshot.hasChildren();
    });
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
              let new_list_promise = this.unpublished_lists_db.push(new_list);
              let new_list_key = new_list_promise.key;
              new_list_promise.then(new_list_db => {
                new_list.$key = new_list_key;
                this.navCtrl.push(ListPage, { list: new_list });
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
    this.navCtrl.push(ListPage, { list: list });
  }


  deleteList(list: any): void {
    console.log("Delete list: " + list.Name);
  }

}
