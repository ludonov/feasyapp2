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
    

    constructor(public navCtrl: NavController, public globals: Globals, public alertCtrl: AlertController) {
        
    }

    ViewReviewToLeave(ReviewToLeave: any): void {
        let Demander: boolean;
        let PersonUnderReview: string;
        if (ReviewToLeave == null)
            ReviewToLeave = {};
        if (ReviewToLeave.owner == this.globals.UID) {
            Demander = true;
            PersonUnderReview = ReviewToLeave.ChosenShopperName;
        } else {
            Demander = false;
            PersonUnderReview = ReviewToLeave.DemanderName;
        }
        this.navCtrl.push(SingleReviewToLeavePage, { ReviewToLeave: ReviewToLeave, Demander: Demander, PersonUnderReview: PersonUnderReview });
    }
}