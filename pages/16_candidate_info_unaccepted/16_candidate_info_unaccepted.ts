import { Component, forwardRef, Inject } from '@angular/core';

import { NavController, NavParams, AlertController, LoadingController, Loading, LoadingOptions, Alert } from 'ionic-angular';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate, StripForFirebase, SetImageOrDefaultOtherUser } from '../../classes/Feasy';

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
  private user: FeasyUser = new FeasyUser("", "", "");
  private rating: any;
  private date_to_print: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(forwardRef(() => Globals)) public globals: Globals, public loadingCtrl: LoadingController,  public alertCtrl: AlertController) {
    this.candidate_key = navParams.get("candidate_key");
    this.list_key = navParams.get("list_key");
    this.candidate = navParams.get("candidate");
    globals.GetUser(this.candidate.uid).then(_user => {
      this.user = _user;
      if (this.user != null) {
        if (this.user.Rating == 0) {
          this.rating = 0;
        } else {
          this.rating = this.user.Rating;
        }
        let date: Date = new Date(this.user.RegisterDate);
        let day: number = date.getDay();
        let month: number = date.getMonth() + 1;
        let year: number = date.getFullYear();
        this.date_to_print = (day.toString()) + "/" + (month.toString()) + "/" + (year.toString());
      }
    });

    if (this.candidate == null || this.list_key == null) {
      console.warn("CandidateInfoUnacceptedPage: null candidate or list_key. Going back.");
      navCtrl.pop();
    } else {
      this.address = globals.GetPublishedListByKey(this.list_key).DeliveryAddresses[this.candidate.AddressKey];   
    }
    

  }

  AcceptShopper(): void {
    let list_updated: FeasyList = this.globals.GetPublishedListByKey(this.list_key);
    list_updated.ChosenCandidateKey = this.candidate_key;
    this.globals.PublishedLists_db.update(this.list_key, StripForFirebase(list_updated)).then(() => {
      let alert: Alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Hai accettato !",
        buttons: ['Ok']
      });
      alert.onDidDismiss(() => {
        this.navCtrl.popToRoot();
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
  }

   goToBigImage(): void {
     console.log("going to big image page");
     this.globals.GetUserPicBig(this.candidate.uid).then(pic => {
       this.globals.ViewBigImage(pic, this.navCtrl);
     });
   }

}
