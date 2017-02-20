import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { DoShoppingFiltersPage } from '../18C_do_shopping_filters/18C_do_shopping_filters';


@Component({
  selector: 'page-doshopping',
  templateUrl: '18A_do_shopping.html'
})

export class DoShoppingPage {
 constructor(public navCtrl: NavController) {

 }

 filters(): void {
    console.log("apply filter on map");
    this.navCtrl.push(DoShoppingFiltersPage);
  }

}