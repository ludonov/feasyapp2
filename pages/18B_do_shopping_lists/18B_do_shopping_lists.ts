import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Alert, Loading, LoadingController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate, Candidature } from '../../classes/Feasy';

import { Globals } from '../../classes/Globals';

import { PublicatedListProductsPage } from '../../pages/12_publicated_list_products/12_publicated_list_products';
import { DoShoppingPage } from '../18A_do_shopping/18A_do_shopping';

import { PublicatedListNoShopperPovShopperPage } from '../../pages/10B_publicated_list_no_shopper_pov_shopper/10B_publicated_list_no_shopper_pov_shopper';
import { PublicatedListWithShopperPovShopperPage } from '../../pages/11B_publicated_list_with_shopper_pov_shopper/11B_publicated_list_with_shopper_pov_shopper';

@Component({
  selector: 'page-doshoppinglists',
  templateUrl: '18B_do_shopping_lists.html'
})
export class DoShoppingListsPage {

  private accepted_lists: Object = {};
  private pending_lists: Object = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals, public af: AngularFire, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

    let loading: Loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });
    loading.present();

    let counter: number = 0;
    let cands_count: number = Object.keys(globals.Candidatures).length;
    for (let cand in globals.Candidatures) {
      let candidature: Candidature = <Candidature>globals.Candidatures[cand];
      counter++;
      af.database.object("/published_lists/" + candidature.ListOwnerUid + "/" + candidature.ListReferenceKey).$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
        let _list: any = snapshot.val();
        _list.ItemsCount = Object.keys(_list.Items).length;
        _list.ChosenAddress = _list.DeliveryAddresses[candidature.AddressKey];
        if (_list.ChosenCandidateKey == candidature.CandidateReferenceKey) {
          this.accepted_lists[snapshot.key] = _list;
        } else {
          this.pending_lists[snapshot.key] = _list;
        }
        if (counter >= cands_count)
          loading.dismiss();
      });
    }
  }

  goToAcceptedList(): void {
    console.log("going to accepted list");
    this.navCtrl.push(PublicatedListWithShopperPovShopperPage);
  }

  goToPendingList(): void {
    console.log("going to pending list");
    this.navCtrl.push(PublicatedListNoShopperPovShopperPage);
  }

  map(): void {
    console.log("search on map");
    this.navCtrl.setRoot(DoShoppingPage);    
  }

}
