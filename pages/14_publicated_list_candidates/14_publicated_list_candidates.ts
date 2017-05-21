import { Component, forwardRef, Inject } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs, LoadingController, Loading, LoadingOptions, Alert } from 'ionic-angular';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate, StripForFirebase, UnknownMan, UnknownWoman, SetImageOrDefaultOtherUser } from '../../classes/Feasy';

import { Globals } from '../../classes/Globals';

import { CandidateInfoUnacceptedPage } from '../../pages/16_candidate_info_unaccepted/16_candidate_info_unaccepted';

@Component({
  selector: 'page-publicated-list-candidates',
  templateUrl: '14_publicated_list_candidates.html'
})
export class PublicatedListCandidatesPage {

  private Candidates: Array<Candidate> = new Array<Candidate>();
  private list_key: string;
  private cands: Array<Candidate> = new Array<Candidate>();

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(forwardRef(() => Globals)) public globals: Globals, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.list_key = navParams.get("list_key");

    if (this.list_key == null) {
      console.warn("PublicatedListCandidatesPage: null list_key. Going back.");
      navCtrl.pop();
    } else {

      let unvisualisedCandidates: Object = {};

      // imposta già tutti i candidates come già visti, perché ho aperto la pagina
      console.log("Setting all candidates as visualised");
      this.cands = globals.GetAllCandidatesForList(this.list_key);
      for (let cand of this.cands) {
        globals.GetUser(cand.uid).then( user => {
          if (user != null) {
            (cand as any).PhotoURL = SetImageOrDefaultOtherUser(user.Gender, user.PhotoURL);
            (cand as any).Gender = user.Gender;
            this.Candidates.push(cand);
          }
        });
  
        if (!cand.Visualised) {
          unvisualisedCandidates[cand.$key] = {};
          Object.assign(unvisualisedCandidates[cand.$key], StripForFirebase(cand));
          unvisualisedCandidates[cand.$key].Visualised = true;
        }
      }
      if (Object.keys(unvisualisedCandidates).length > 0) {
        globals.af.list("/candidates").update(globals.UID, StripForFirebase(unvisualisedCandidates));
      }
    }
  }

  ViewCandidate(candidate): void {
    this.navCtrl.push(CandidateInfoUnacceptedPage, { candidate: candidate, candidate_key: candidate.$key, list_key: this.list_key});
  }

}
