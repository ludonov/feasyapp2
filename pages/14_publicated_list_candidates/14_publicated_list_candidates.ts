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
  private cands: Object = {};
  private NoCandidates: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(forwardRef(() => Globals)) public globals: Globals, public loadingCtrl: LoadingController, public af: AngularFire, public alertCtrl: AlertController) {
    this.list_key = navParams.get("list_key");

    if (this.list_key == null) {
      console.warn("PublicatedListCandidatesPage: null list_key. Going back.");
      navCtrl.pop();
    } else {

      let unvisualisedCandidates: Object = {};

      // imposta già tutti i candidates come già visti, perché ho aperto la pagina
      console.log("Setting all candidates as visualised");
      this.cands = globals.GetAllCandidatesForList(this.list_key);
      for (let cand in this.cands) {
        if (!this.cands[cand].Visualised) {
          unvisualisedCandidates[cand] = {};
          Object.assign(unvisualisedCandidates[cand], this.cands[cand]);
          unvisualisedCandidates[cand].Visualised = true;
        }
      }
      this.NoCandidates = Object.keys(this.cands).length == 0;
      if (Object.keys(unvisualisedCandidates).length > 0) {
        globals.af.database.list("/candidates").update(globals.UID, unvisualisedCandidates);
      }
    }
  }

  ViewCandidate(candidate): void {
    this.navCtrl.push(CandidateInfoUnacceptedPage, { candidate: candidate.value, candidate_key: candidate.key, list_key: this.list_key })
  }

}
