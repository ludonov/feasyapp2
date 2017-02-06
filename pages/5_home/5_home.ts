import { Component } from '@angular/core';

import { NavController, Tabs } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { ListsPage } from '../../pages/6_lists/6_lists';
import { DoShoppingPage } from '../../pages/18A_do_shopping/18A_do_shopping';

import { UserProfilePage } from '../../pages/17_user_profile/17_user_profile';

@Component({
  selector: 'page-home',
  templateUrl: '5_home.html'
})
export class HomePage {

  public tab: Tabs;

  constructor(public navCtrl: NavController) {
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
  }

}
