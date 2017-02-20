import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-doshoppinglists',
  templateUrl: '18B_do_shopping_lists.html'
})
export class DoShoppingListsPage {

  constructor(public navCtrl: NavController) {

  }

  goToList(): void {
    console.log("going to list");
    //this.navCtrl.push(DoShoppingListsPage);
  }

}
