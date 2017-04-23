import { Component, forwardRef, Inject } from '@angular/core';

import { NavController, NavParams, AlertController, LoadingController, Loading, LoadingOptions, Alert } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate, StripForFirebase } from '../../classes/Feasy';

import { Globals } from '../../classes/Globals';


@Component({
  selector: 'page-candidate-info-unaccepted',
  templateUrl: '16_candidate_info_unaccepted.html'
})

export class CandidateInfoUnacceptedPage {

  private candidate_key: string;
  private list_key: string;
  private candidate: Candidate;
  private address: DeliveryAddress;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(forwardRef(() => Globals)) public globals: Globals, public loadingCtrl: LoadingController, public af: AngularFire, public alertCtrl: AlertController) {
    this.candidate_key = navParams.get("candidate_key");
    this.list_key = navParams.get("list_key");
    this.candidate = navParams.get("candidate");

    if (this.candidate == null || this.list_key == null) {
      console.warn("CandidateInfoUnacceptedPage: null candidate or list_key. Going back.");
      navCtrl.pop();
    } else {
      this.address = globals.PublishedLists[this.list_key].DeliveryAddresses[this.candidate.AddressKey];
    }

  }

  AcceptShopper(): void {
    //this.af.database.object("/candidates/" + this.globals.UID + "/" + this.list_key + "/" + this.candidate_key).set({ Accepted: true }).then(() => {
      let list_updated: FeasyList = this.globals.PublishedLists[this.list_key];
      list_updated.ChosenCandidateKey = this.candidate_key;
      this.globals.PublishedLists_db.update(this.list_key, StripForFirebase(list_updated)).then(() => {
        let alert: Alert = this.alertCtrl.create({
          title: 'Info',
          subTitle: "Hai accettato !",
          buttons: ['Ok']
        });
        alert.onDidDismiss(() => {
          this.navCtrl.pop();
        });
        alert.present();
      }).catch((err: Error) => {
        console.warn("CandidateInfoUnacceptedPage > Cannot update list with candidate key: " + err.message);
        let alert: Alert = this.alertCtrl.create({
          title: 'Info',
          subTitle: "Impossibile candidarsi alla lista. Ritentare.",
          buttons: ['Ok']
        });
        alert.present();
      });
    //}).catch((err: Error) => {
    //    console.warn("CandidateInfoUnacceptedPage > Cannot accept candidate: " + err.message);
    //    let alert: Alert = this.alertCtrl.create({
    //      title: 'Info',
    //      subTitle: "Impossibile candidarsi alla lista. Ritentare.",
    //      buttons: ['Ok']
    //    });
    //    alert.present();
    //  });
  }

}
