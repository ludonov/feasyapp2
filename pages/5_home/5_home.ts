import { Component } from '@angular/core';

import { NavController, Tabs } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { ListsPage } from '../../pages/6_lists/6_lists';
import { MapTabsPage } from '../../pages/18_tabs/18_tabs';
import { DoShoppingPage } from '../../pages/18A_do_shopping/18A_do_shopping';
import { SettingsPage } from '../../pages/23_settings/23_settings';

import { UserProfilePage } from '../../pages/17_user_profile/17_user_profile';

// Temporary, to see the pages
import { PublicatedListNoShopperPage } from '../../pages/10_publicated_list_no_shopper/10_publicated_list_no_shopper';
import { PublicatedListNoShopperPovShopperPage } from '../../pages/10B_publicated_list_no_shopper_pov_shopper/10B_publicated_list_no_shopper_pov_shopper';
import { PublicatedListWithShopperPage } from '../../pages/11_publicated_list_with_shopper/11_publicated_list_with_shopper';
import { PublicatedListWithShopperPovShopperPage } from '../../pages/11B_publicated_list_with_shopper_pov_shopper/11B_publicated_list_with_shopper_pov_shopper';
import { PublicatedListProductsPage } from '../../pages/12_publicated_list_products/12_publicated_list_products';
import { SpecificProductShopperPage } from '../../pages/13B_specific_product_shopper/13B_specific_product_shopper';
import { PublicatedListCandidatesPage } from '../../pages/14_publicated_list_candidates/14_publicated_list_candidates';
import { CandidateInfoUnacceptedPage } from '../../pages/16_candidate_info_unaccepted/16_candidate_info_unaccepted';

@Component({
  selector: 'page-home',
  templateUrl: '5_home.html'
})
export class HomePage {

  public tab: Tabs;

  constructor(public navCtrl: NavController, public af: AngularFire) {
    console.log("NAV> home page");
    this.tab = this.navCtrl.parent;
    //this.user = Backendless.UserService.login("ludovico.novelli@gmail.com", "prova", true);
    //console.log(this.user);
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

  tmp_goto_page10(): void {
    console.log("going to page publicated list no shopper");
    this.navCtrl.push(PublicatedListNoShopperPage);
  }

  tmp_goto_page10B(): void {
    console.log("going to page publicated list pov shopper");
    this.navCtrl.push(PublicatedListNoShopperPovShopperPage);
  }

  tmp_goto_page11(): void {
    console.log("going to page publicated list with shopper");
    this.navCtrl.push(PublicatedListWithShopperPage);
  }

  tmp_goto_page11B(): void {
    console.log("going to page publicated list with shopper pov shopper");
    this.navCtrl.push(PublicatedListWithShopperPovShopperPage);
  }

  tmp_goto_page12(): void {
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
}
