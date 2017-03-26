import { Component, forwardRef, Inject } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs, LoadingController, Loading, LoadingOptions, Alert } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate } from '../../classes/Feasy';

import { Globals } from '../../classes/Globals';

import { CandidateInfoUnacceptedPage } from '../../pages/16_candidate_info_unaccepted/16_candidate_info_unaccepted';

@Component({  
  selector: 'page-publicated-list-candidates',
  templateUrl: '14_publicated_list_candidates.html'
})
export class PublicatedListCandidatesPage {

  //private candidates_db: FirebaseListObservable<any>;
  private candidates: Object = {};
  private list_key: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(forwardRef(() => Globals)) public globals: Globals, public loadingCtrl: LoadingController, public af: AngularFire, public alertCtrl: AlertController) {
    this.list_key = navParams.get("list_key");

    if (this.list_key == null) {
      console.warn("PublicatedListCandidatesPage: null list_key. Going back.");
      navCtrl.pop();
    } else {

      //this.candidates_db = af.database.list("/candidates/" + globals.UID + "/" + list_key);
      //this.candidates_db.$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {

      //this.candidates = {};
      //let _candidates = globals.Candidates[list_key];
      //  for (let candidate_key in _candidates) {
      //    let candidate: Candidate = _candidates[candidate_key];
      //    candidate.Visualised = true;
      //    this.candidates[candidate_key] = candidate;
      //}
      //globals.Candidates_db.update(list_key, this.candidates).then(() => {
      //    console.log("Candidates visualised updated");
      //  }).catch((err: Error) => {
      //    console.warn("Cannot update Candidates visualised: " + err.message);
      //  });

      //});

      if (globals.Candidates[this.list_key] != null) {
        // imposta già tutti i candidates come già visti, perché ho aperto la pagina
        console.log("Setting all candidates as visualised");
        let cands: Object = globals.Candidates[this.list_key];
        for (let cand in cands) {
          cands[cand].Visualised = true;
        }
        globals.Candidates_db.update(this.list_key, cands);
      }
    }
  }

  ViewCandidate(candidate): void {
    this.navCtrl.push(CandidateInfoUnacceptedPage, {candidate: candidate.value, candidate_key: candidate.key, list_key: this.list_key })
  }

}
