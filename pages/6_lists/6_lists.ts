import { Component, Pipe, PipeTransform, Injectable } from '@angular/core';

import { NavController, AlertController, Alert, NavParams, Loading, LoadingController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate, Candidature } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { ListPage } from '../../pages/7_list/7_list';
import { PublicatedListNoShopperPage } from '../../pages/10_publicated_list_no_shopper/10_publicated_list_no_shopper';
import { PublicatedListWithShopperPage } from '../../pages/11_publicated_list_with_shopper/11_publicated_list_with_shopper';

import { PublicatedListProductsPage } from '../../pages/12_publicated_list_products/12_publicated_list_products';
import { DoShoppingPage } from '../18A_do_shopping/18A_do_shopping';

import { ListFromMapPage } from '../../pages/28_list_from_map_details/28_list_from_map_details';
import { PublicatedListWithShopperPovShopperPage } from '../../pages/11B_publicated_list_with_shopper_pov_shopper/11B_publicated_list_with_shopper_pov_shopper';

@Component({
  selector: 'page-lists',
  templateUrl: '6_lists.html'
})
export class ListsPage {

  lists: string = "demander";

  //public published_lists: Object;
  //public unpublished_lists: Object;
  //public published_lists_db: FirebaseListObservable<any>;
  //public unpublished_lists_db: FirebaseListObservable<any>;
  //public no_published_list: boolean = true;
  //public no_unpublished_list: boolean = true;

  //SHOPPER LISTS
  public num_items: number = 0;

  //DEMANDER LISTS
  private accepted_lists: Object = {};
  private pending_lists: Object = {};
  private no_accepted_lists: boolean = true;
  private no_pending_lists: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController, public globals: Globals, public loadingCtrl: LoadingController) {

    this.updateShopperLists();

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

  // DEMANDER LISTS
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

  goToPublicatedList(list: FeasyList): void {
    if (list.ChosenCandidatureKey != null && list.ChosenCandidatureKey != "") {
      console.log("Goto publicated list: " + list.Name);
      this.navCtrl.push(PublicatedListWithShopperPage, { list_key: list.$key });
    } else {
      console.log("Goto publicated list: " + list.Name);
      this.navCtrl.push(PublicatedListNoShopperPage, { list_key: list.$key });

    }
  }

  // SHOPPER LISTS
  updateShopperLists() {

    this.globals.Candidatures_db.$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
      let candidatures: any = snapshot.val() || {};
      let counter: number = 0;
      let cands_count: number = Object.keys(candidatures).length;
      this.no_accepted_lists = true;
      this.no_pending_lists = true;
      if (cands_count > 0) {
        let loading: Loading = this.loadingCtrl.create({
          spinner: 'dots',
          content: 'Please wait...'
        });
        loading.present();
        for (let cand in candidatures) {
          let candidature: Candidature = <Candidature>candidatures[cand];
          counter++;
          this.af.database.object("/published_lists/" + candidature.ListOwnerUid + "/" + candidature.ListReferenceKey).$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
            let _list: FeasyList = snapshot.val();
            if (_list != null && _list.Items != null && _list.DeliveryAddresses != null) {
              _list.ItemsCount = Object.keys(_list.Items).length;
              (_list as any).ChosenAddress = _list.DeliveryAddresses[candidature.AddressKey];
              (_list as any).Candidature = candidature;
              if (_list.ChosenCandidatureKey == cand) {
                this.accepted_lists[snapshot.key] = _list;
              } else {
                this.pending_lists[snapshot.key] = _list;
              }
            }
            if (counter >= cands_count)
              loading.dismiss();
            this.no_accepted_lists = Object.keys(this.accepted_lists).length == 0;
            this.no_pending_lists = Object.keys(this.pending_lists).length == 0;
          });
        }
      }
    });
  }

  goToAcceptedList(list: any): void {
    console.log("going to accepted list");
    this.navCtrl.push(PublicatedListWithShopperPovShopperPage, { list_owner: list.value.Candidature.ListOwnerUid, list_key: list.value.Candidature.ListReferenceKey, candidature: list.value.Candidature });
  }

  goToPendingList(list: any): void {
    console.log("going to pending list");
    this.navCtrl.push(ListFromMapPage, { list_owner: list.value.Candidature.ListOwnerUid, list_key: list.value.Candidature.ListReferenceKey, address_key: list.value.Candidature.AddressKey });
  }

  map(): void {
    console.log("search on map");
    this.navCtrl.setRoot(DoShoppingPage);
  }

}
