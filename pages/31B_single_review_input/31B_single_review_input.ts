import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, Review, StripForFirebase } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

@Component({
  selector: 'page-single-review',
  templateUrl: '31B_single_review_input.html'
})

export class SingleReviewInputPage {

  public ReviewToLeave: FeasyList = new FeasyList("");
  public Review_db: FirebaseListObservable<any>;
  public review: Review = new Review();
  public TerminatedList_db: FirebaseObjectObservable<any>;
  public TerminatedList: FeasyList = new FeasyList("");


  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public globals: Globals) {
      this.ReviewToLeave = navParams.get('review');
      this.Review_db = af.database.list("reviews/" + globals.UID + "/to_move");
      if (globals.UID == this.ReviewToLeave.owner){
          this.TerminatedList_db = af.database.object("terminated_lists/" + globals.UID + "/as_demander/" + this.ReviewToLeave.$key);
          this.TerminatedList_db.$ref.on("value", (snapshot1: firebase.database.DataSnapshot) => {
            this.TerminatedList = snapshot1.val();
          });
      }else{
        this.TerminatedList_db = af.database.object("terminated_lists/" + globals.UID + "/as_shopper/" + this.ReviewToLeave.$key);
        this.TerminatedList_db.$ref.on("value", (snapshot2: firebase.database.DataSnapshot) => {
            this.TerminatedList = snapshot2.val();
        });
      }
      
  } 

  AddReview(): void {
    //aggiungere check se ci sono campi vuoti e sputare popup di warning
    this.review.UID_Writer = this.globals.UID;
    if (this.globals.UID == this.ReviewToLeave.owner) {
        this.review.WriterName = this.ReviewToLeave.DemanderName;
        this.review.RevieweeUid = this.ReviewToLeave.ChosenShopperUid;
    } else {
        this.review.WriterName = this.ReviewToLeave.ChosenShopperName;
        this.review.RevieweeUid = this.ReviewToLeave.owner;
    }
    this.review.ListKey = this.ReviewToLeave.$key;
    this.review.RevieweeUid = this.ReviewToLeave.ChosenShopperUid;
    this.TerminatedList.ReviewLeft = true;
    this.Review_db.push(StripForFirebase(this.review)).then(res => {
        this.TerminatedList_db.update(StripForFirebase(this.TerminatedList)).then(res => {
          this.navCtrl.pop();
        }).catch((err: Error) => {
          console.log("Error: " + err.message);
        });
    }).catch((err: Error) => {
      console.log("Error: " + err.message);
    });
  }

}
