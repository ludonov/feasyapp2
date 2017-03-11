import { Component } from '@angular/core';

import { NavController, Tabs } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { ListsPage } from '../../pages/6_lists/6_lists';
import { MapTabsPage } from '../../pages/18_tabs/18_tabs';
import { DoShoppingPage } from '../../pages/18A_do_shopping/18A_do_shopping';
import { SettingsPage } from '../../pages/23_settings/23_settings';

import { UserProfilePage } from '../../pages/17_user_profile/17_user_profile';

// Temporary, to see the pages
import { PublicatedListNoShopperPage } from '../../pages/10_publicated_list_no_shopper/10_publicated_list_no_shopper';
import { PublicatedListWithShopperPage } from '../../pages/11_publicated_list_with_shopper/11_publicated_list_with_shopper';
import { PublicatedListProductsPage } from '../../pages/12_publicated_list_products/12_publicated_list_products';
import { SpecificProductShopperPage } from '../../pages/13B_specific_product_shopper/13B_specific_product_shopper';
import { PublicatedListCandidatesPage } from '../../pages/14_publicated_list_candidates/14_publicated_list_candidates';
import { CandidateInfoUnacceptedPage } from '../../pages/16_candidate_info_unaccepted/16_candidate_info_unaccepted';
import { ListFromMapPage } from '../../pages/28_list_from_map_details/28_list_from_map_details';

import { SetPersonalDetailsPage } from '../../pages/4A_set_personal_details/4A_set_personal_details';
import { DoShoppingListsPage } from '../../pages/18B_do_shopping_lists/18B_do_shopping_lists';

/*   
import { PublicatedListNoShopperPovShopperPage } from '../../pages/10B_publicated_list_no_shopper_pov_shopper/10B_publicated_list_no_shopper_pov_shopper';
import { PublicatedListWithShopperPovShopperPage } from '../../pages/11B_publicated_list_with_shopper_pov_shopper/11B_publicated_list_with_shopper_pov_shopper';
*/

@Component({
  selector: 'page-home',
  templateUrl: '5_home.html'
})
export class HomePage {

  public tab: Tabs;
  public candidates: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public af: AngularFire, public globals: Globals) {
    console.log("NAV> home page");
    this.tab = this.navCtrl.parent;
  }

  goto_lists(): void {
    console.log("going to lists");
    this.tab.select(1);
  }

  do_shopping(): void {
    console.log("going to do shopping");
    this.tab.select(2);
  }

  goToProfile(): void {
    console.log("going to profile page");
    this.navCtrl.push(UserProfilePage);
  }

  goToSettings(): void {
    console.log("going to settings page");
    this.navCtrl.push(SettingsPage);
  }

  /*tmp_goto_page10(): void {
    console.log("going to page publicated list no shopper");
    this.navCtrl.push(PublicatedListNoShopperPage);
  }*/

  /*tmp_goto_page10B(): void {
    console.log("going to page publicated list pov shopper");
    this.navCtrl.push(PublicatedListNoShopperPovShopperPage);
  }*/

  /*tmp_goto_page11(): void {
    console.log("going to page publicated list with shopper");
    this.navCtrl.push(PublicatedListWithShopperPage);
  }*/

  /*tmp_goto_page11B(): void {
    console.log("going to page publicated list with shopper pov shopper");
    this.navCtrl.push(PublicatedListWithShopperPovShopperPage);
  }*/

  /*tmp_goto_page12(): void {
    console.log("going to page publicated list products");
    this.navCtrl.push(PublicatedListProductsPage);
  }

  tmp_goto_page13B(): void {
    console.log("going to page specific product shopper");
    this.navCtrl.push(SpecificProductShopperPage);
  }

  tmp_goto_page14(): void {
    console.log("going to page publicated list candidates");
    this.navCtrl.push(PublicatedListCandidatesPage);
  }

  tmp_goto_page16(): void {
    console.log("going to page candidate info unaccepted");
    this.navCtrl.push(CandidateInfoUnacceptedPage);
  }

  tmp_goto_page18A(): void {
    console.log("going to page do shopping");
    this.navCtrl.push(DoShoppingPage);
  }

  tmp_goto_page18B(): void {
    console.log("going to page do shopping lists");
    this.navCtrl.push(DoShoppingListsPage);
  }

  tmp_goto_page4A(): void {
    console.log("going to add personal details");
    this.navCtrl.push(SetPersonalDetailsPage);
  }

  tmp_goto_page28(): void {
    console.log("going to page do shopping lists");
    this.navCtrl.push(ListFromMapPage);
  }*/
}
