﻿import { Component, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';


import { FeasyUser, FeasyList, FeasyItem, Review, Candidature } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { SingleReviewInputPage } from '../31B_single_review_input/31B_single_review_input';
import { PublicatedListProductsPage } from '../../pages/12_publicated_list_products/12_publicated_list_products';
import { UserProfilePovOtherUsersPage } from "../17B_user_profile_pov_other_users/17B_user_profile_pov_other_users";


@Component({
    selector: 'page-single-review-to-leave',
    templateUrl: '40_single_review_to_leave.html'
})

export class SingleReviewToLeavePage {

    public ReviewToLeave: FeasyList = new FeasyList("");
    public Demander: boolean;
    public PersonUnderReview: string;

    constructor(public navParams: NavParams, public cd: ChangeDetectorRef, public navCtrl: NavController, public globals: Globals,  public alertCtrl: AlertController) {
       this.ReviewToLeave = navParams.get('ReviewToLeave');
       this.Demander = navParams.get('Demander');
       this.PersonUnderReview = navParams.get('PersonUnderReview');
    }

    WriteReview(): void {
        this.navCtrl.push(SingleReviewInputPage, {review: this.ReviewToLeave});
    }

    ViewItems(): void {
        this.navCtrl.push(PublicatedListProductsPage, { items: this.ReviewToLeave.Items });
    }

    GoToProfile(): void {
        let _user_uid: string;
        if (this.Demander == true) {
            _user_uid = this.ReviewToLeave.ChosenShopperUid;
        } else {
            _user_uid = this.ReviewToLeave.owner;
        }
        this.navCtrl.push(UserProfilePovOtherUsersPage, { userUID: _user_uid });
    }

    
}