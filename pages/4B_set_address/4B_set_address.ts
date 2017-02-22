
import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { HomePage } from '../../pages/5_home/5_home';
import { SetPaymentMethodPage } from '../../pages/4C_set_payment_method/4C_set_payment_method';


@Component({
  selector: 'page-setaddress',
  templateUrl: '4B_set_address.html'
})
export class SetAddressPage {

  constructor(public navCtrl: NavController) {
  
  }

  skipToHome(): void {
    console.log("skip personal details");
    //this.navCtrl.push(HomePage);
  }

  setAddress(): void {
    console.log("personal details set");
    this.navCtrl.push(SetPaymentMethodPage);
  }

}

