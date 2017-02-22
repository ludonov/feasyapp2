import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-doshoppingfilters',
  templateUrl: '18C_do_shopping_filters.html'
})
export class DoShoppingFiltersPage {

  constructor(public navCtrl: NavController) {

  }

  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  /*filters(): void {
    console.log("apply filter on map");
    this.navCtrl.push(TermsAndConditionsPage);
  }*/

}
