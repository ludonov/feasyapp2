import { Component, Pipe, PipeTransform, Injectable, forwardRef, Inject, ChangeDetectionStrategy } from '@angular/core';

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
  //private accepted_lists: Array<FeasyList> = new Array<FeasyList>();
  //private pending_lists: Array<FeasyList> = new Array<FeasyList>();

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController, @Inject(forwardRef(() => Globals)) public globals: Globals, public loadingCtrl: LoadingController) {

  }

  // DEMANDER LISTS
  GetItemsCount(list: any): string {
    return (list == null || list.Items == null ? "0" : Object.keys(list.Items).length.toString());
  }


  addList(): void {
    try {
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
                new_list.DemanderName = this.globals.User.DisplayName;
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
    } catch (e) {
      console.warn('ListsPage> cannot add list. Caught error: ' + e);
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: 'Impossibile aggiungere la lista',
        buttons: ['Ok']
      });
      alert.present();
    }
    
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

  goToAcceptedList(list: any): void {
    console.log("going to accepted list");
    this.navCtrl.push(PublicatedListWithShopperPovShopperPage, { list_owner: list.Candidature.ListOwnerUid, list_key: list.Candidature.ListReferenceKey, candidature: list.Candidature });
  }

  goToPendingList(list: any): void {
    console.log("going to pending list");
    this.navCtrl.push(ListFromMapPage, { list_owner: list.Candidature.ListOwnerUid, list_key: list.Candidature.ListReferenceKey, address_key: list.Candidature.AddressKey });
  }

  map(): void {
    console.log("search on map");
    this.navCtrl.setRoot(DoShoppingPage);
  }

}
