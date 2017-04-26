import { Component, ApplicationRef, ChangeDetectorRef } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

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

    constructor(public cd: ChangeDetectorRef, public navCtrl: NavController, public globals: Globals, public af: AngularFire, public alertCtrl: AlertController) {
        this.TerminatedLists_db = af.database.list("terminated_lists/" + globals.UID); 
        this.TerminatedLists_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
            let lists: any = snapshot.val();
            this.TerminatedListsAsDemander=lists["as_demander"];
            this.TerminatedListsAsShopper=lists["as_shopper"];

            for (let demander_key in this.TerminatedListsAsDemander) {
                let list_d: FeasyList = this.TerminatedListsAsDemander[demander_key];
                if(list_d.ReviewLeft == false)
                    this.ReviewsToLeaveAsDemander.push(list_d);
            }

            for (let shopper_key in this.TerminatedListsAsShopper) {
                let list_s: FeasyList = this.TerminatedListsAsShopper[shopper_key];
                if(list_s.ReviewLeft == false)
                    this.ReviewsToLeaveAsShopper.push(list_s);
            }
        });
    }

    ViewReviewToLeave(ReviewToLeave: any) {
        let Demander: boolean;
        let PersonUnderReview: string;
        if (ReviewToLeave.value == null)
            ReviewToLeave.value = {};
        if (ReviewToLeave.value.owner == this.globals.UID) {
            Demander = true;
            PersonUnderReview = ReviewToLeave.value.ChosenShopperName;
        }else{
            Demander = false;
            PersonUnderReview = ReviewToLeave.value.DemanderName;
        }
        this.navCtrl.push(SingleReviewToLeavePage, {ReviewToLeave: ReviewToLeave.value, Demander: Demander, PersonUnderReview: PersonUnderReview});
  }
}