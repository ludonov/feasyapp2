import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { FeasyUser, FeasyList, FeasyItem, Review, StripForFirebase, Chat } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { UserProfilePovOtherUsersPage } from '../../pages/17B_user_profile_pov_other_users/17B_user_profile_pov_other_users';
import { TerminatedListInfoPage } from '../../pages/21_terminated_list_info/21_terminated_list_info';

@Component({
  selector: 'page-history',
  templateUrl: '22_history.html'
})

export class HistoryPage {

  public Demander: boolean = false;
  public HistoryListsDemander: Array<FeasyList> = new Array<FeasyList>();
  public HistoryListsShopper: Array<FeasyList> = new Array<FeasyList>();
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals, public af: AngularFireDatabase) {
    this.Demander = navParams.get('demander');
    for (let list_d of globals.TerminatedListsAsDemander) {
      af.object("users/" + list_d.ChosenShopperUid + "/PhotoURL").$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
        (list_d as any).PhotoURL = snapshot.val();
        this.HistoryListsDemander.push(list_d);
      });
    }
    for (let list_s of globals.TerminatedListsAsShopper) {
      af.object("users/" + list_s.owner + "/PhotoURL").$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
        (list_s as any).PhotoURL = snapshot.val();
        this.HistoryListsShopper.push(list_s);
      });
    }
  }

  goToListDetailsAsDemander(listKey: string): void {
    this.navCtrl.push(TerminatedListInfoPage, {list_key: listKey, demander: this.Demander});
  }

  goToListDetailsAsShopper(listKey: string): void {
    this.navCtrl.push(TerminatedListInfoPage, { list_key: listKey, demander: this.Demander });
  }

}
