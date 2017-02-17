import { Component } from '@angular/core';

import { NavController, Tabs } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { ListsPage } from '../../pages/6_lists/6_lists';
import { DoShoppingPage } from '../../pages/18A_do_shopping/18A_do_shopping';

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
    this.af.auth.logout().then(res => {
      console.log("Logged out!");
    }).catch(res => {
      console.log("Cannot logout: " + res);
    });
  }

  goToSettings(): void {
    console.log("going to settings page");
  }

}
