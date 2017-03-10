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

  private candidates_db: FirebaseListObservable<any>;
  private candidates: Object = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public globals: Globals) {
    let list_owner: any = navParams.get("list_owner");
    let list_key: any = navParams.get("list_key");
    this.candidates_db = af.database.list("/candidates/" + list_owner + "/" + list_key);
    this.candidates_db.$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
      this.candidates = {};
      let _candidates = snapshot.val();
      for (let candidate_key in _candidates) {
        let candidate: Candidate = _candidates[candidate_key];
        candidate.Visualised = true;
        this.candidates[candidate_key] = candidate;
      }
      af.database.list("/candidates/" + list_owner).update(list_key, this.candidates).then(() => {
        console.log("Candidates visualised updated");
      }).catch((err: Error) => {
        console.warn("Cannot update Candidates visualised: " + err.message);
      });
    });
  }

}
