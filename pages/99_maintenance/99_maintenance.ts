import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-maintenance',
  templateUrl: '99_maintenance.html'
})
export class MaintenancePage {

  
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {

  }

}
