
import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { SetAddressPage } from '../../pages/4B_set_address/4B_set_address';
import { HomePage } from '../../pages/5_home/5_home';


@Component({
  selector: 'page-setpersonaldetails',
  templateUrl: '4A_set_personal_details.html'
})
export class SetPersonalDetailsPage {

  constructor(public navCtrl: NavController) {
  
  }

  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  skipToHome(): void {
    console.log("skip to home");
    //this.navCtrl.push(HomePage);
  }

  setPersonalDetails(): void {
    console.log("personal details set");
    this.navCtrl.push(SetAddressPage);
  }

}


