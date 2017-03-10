import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs, LoadingController, Loading, LoadingOptions, Alert } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

@Component({  
  selector: 'page-publicated-list-candidates',
  templateUrl: '14_publicated_list_candidates.html'
})
export class PublicatedListCandidatesPage {

  private candidates: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public globals: Globals) {
    let list_owner: any = navParams.get("list_owner");
    let list_key: any = navParams.get("list_key");
    this.candidates = af.database.list("/candidates/" + list_owner + "/" + list_key);
    this.candidates.forEach((candidate: any) => {
      console.log(candidate);
    });
  }

}
