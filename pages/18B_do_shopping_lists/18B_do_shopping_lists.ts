import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Alert, Loading, LoadingController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate, Candidature } from '../../classes/Feasy';

import { Globals } from '../../classes/Globals';

import { PublicatedListProductsPage } from '../../pages/12_publicated_list_products/12_publicated_list_products';
import { DoShoppingPage } from '../18A_do_shopping/18A_do_shopping';

import { ListFromMapPage } from '../../pages/28_list_from_map_details/28_list_from_map_details';
import { PublicatedListWithShopperPovShopperPage } from '../../pages/11B_publicated_list_with_shopper_pov_shopper/11B_publicated_list_with_shopper_pov_shopper';

@Component({
  selector: 'page-doshoppinglists',
  templateUrl: '18B_do_shopping_lists.html'
})
export class DoShoppingListsPage {

  private accepted_lists: Object = {};
  private pending_lists: Object = {};
  private no_accepted_lists: boolean = true;
  private no_pending_lists: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals, public af: AngularFire, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    
  }

    

  ionViewDidEnter() {

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
              _list.ItemsCount = Object.keys(_list.Items).length;
              (_list as any).ChosenAddress = _list.DeliveryAddresses[candidature.AddressKey];
              (_list as any).Candidature = candidature;
              if (_list.ChosenCandidatureKey == cand) {
                this.accepted_lists[snapshot.key] = _list;
              } else {
                this.pending_lists[snapshot.key] = _list;
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
