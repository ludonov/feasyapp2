
import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { HomePage } from '../../pages/5_home/5_home';


@Component({
  selector: 'page-setpaymentmethod',
  templateUrl: '4C_set_payment_method.html'
})
export class SetPaymentMethodPage {

  constructor(public navCtrl: NavController) {
  
  }

  skipToHome(): void {
    console.log("skip personal details");
    //this.navCtrl.push(HomePage);
  }

  setPaymentMethod(): void {
    console.log("personal details set");
    //this.navCtrl.push(HomePage);
  }

}

