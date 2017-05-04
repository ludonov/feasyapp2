import { Component, ApplicationRef, ChangeDetectorRef } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';


import { FeasyUser, FeasyList, FeasyItem, Review, Candidature } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { SingleReviewToLeavePage } from '../40_single_review_to_leave/40_single_review_to_leave';


@Component({
    selector: 'page-reviews-to-leave',
    templateUrl: '39_reviews_to_leave.html'
})

export class ReviewsToLeavePage {

    public ReviewsToLeaveAsDemander: Array<any> = new Array<any>();
    public ReviewsToLeaveAsShopper: Array<any> = new Array<any>();

    public TerminatedLists_db: FirebaseListObservable<any>; 
    public TerminatedListsAsDemander: Object = {}; 
    public TerminatedListsAsShopper: Object = {};

    constructor(public cd: ChangeDetectorRef, public navCtrl: NavController, public globals: Globals,  public alertCtrl: AlertController) {
        this.TerminatedLists_db = globals.af.list("terminated_lists/" + globals.UID); 
        this.TerminatedLists_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
            let lists: any = snapshot.val();
            this.TerminatedListsAsDemander=lists["as_demander"];
            this.TerminatedListsAsShopper=lists["as_shopper"];

            for (let demander_key in this.TerminatedListsAsDemander) {
                let list_d: FeasyList = this.TerminatedListsAsDemander[demander_key];
                if(list_d.ReviewLeft == false) {
                    list_d.$key = demander_key;
                    this.ReviewsToLeaveAsDemander.push(list_d);
                }
            }

            for (let shopper_key in this.TerminatedListsAsShopper) {
                let list_s: FeasyList = this.TerminatedListsAsShopper[shopper_key];
                if(list_s.ReviewLeft == false){
                    list_s.$key = shopper_key;
                    this.ReviewsToLeaveAsShopper.push(list_s);
                }
            }
        });
    }

    ViewReviewToLeave(ReviewToLeave: any): void {
        let Demander: boolean;
        let PersonUnderReview: string;
        if (ReviewToLeave == null)
            ReviewToLeave = {};
        if (ReviewToLeave.owner == this.globals.UID) {
            Demander = true;
            PersonUnderReview = ReviewToLeave.ChosenShopperName;
        }else{
            Demander = false;
            PersonUnderReview = ReviewToLeave.DemanderName;
        }
        this.navCtrl.push(SingleReviewToLeavePage, {ReviewToLeave: ReviewToLeave, Demander: Demander, PersonUnderReview: PersonUnderReview});
  }
}