import { Component, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, Review, Candidature } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';


@Component({
    selector: 'page-single-review-to-leave',
    templateUrl: '40_single_review_to_leave.html'
})

export class SingleReviewToLeavePage {

    public ReviewToLeave: FeasyList = new FeasyList("");

    constructor(public navParams: NavParams, public cd: ChangeDetectorRef, public navCtrl: NavController, public globals: Globals, public af: AngularFire, public alertCtrl: AlertController) {
       this.ReviewToLeave = navParams.get('ReviewToLeave');
        
    }

    
}