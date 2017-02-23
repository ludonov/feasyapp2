import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { PublicatedListNoShopperPovShopperPage } from '../../pages/10B_publicated_list_no_shopper_pov_shopper/10B_publicated_list_no_shopper_pov_shopper';
import { PublicatedListWithShopperPovShopperPage } from '../../pages/11B_publicated_list_with_shopper_pov_shopper/11B_publicated_list_with_shopper_pov_shopper';

@Component({
  selector: 'page-doshoppinglists',
  templateUrl: '18B_do_shopping_lists.html'
})
export class DoShoppingListsPage {

  constructor(public navCtrl: NavController) {

  }

  goToAcceptedList(): void {
    console.log("going to accepted list");
    this.navCtrl.push(PublicatedListWithShopperPovShopperPage);
  }

  goToPendingList(): void {
    console.log("going to pending list");
    this.navCtrl.push(PublicatedListNoShopperPovShopperPage);
  }

}
