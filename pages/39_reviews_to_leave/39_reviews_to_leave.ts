import { Component, ApplicationRef, ChangeDetectorRef } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, Review, Candidature } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';


@Component({
    selector: 'page-reviews-to-leave',
    templateUrl: '39_reviews_to_leave.html'
})

export class ReviewsToLeavePage {


    public ReviewsToLeaveAsDemander: Array<any> = new Array<any>();
    public ReviewsToLeaveAsShopper: Array<any> = new Array<any>();
    public TerminatedListsAsDemander_db: FirebaseListObservable<any>;
    public TerminatedListsAsShopper_db: FirebaseListObservable<any>;
    public TerminatedListsAsDemander: Object = {};
    public TerminatedListsAsShopper: Object = {};

    constructor(public cd: ChangeDetectorRef, public navCtrl: NavController, public globals: Globals, public af: AngularFire, public alertCtrl: AlertController) {
        this.TerminatedListsAsDemander_db = af.database.list("terminated_lists/" + globals.UID + "/as_demander"); 
        this.TerminatedListsAsDemander_db.$ref.on("value", (snapshot1: firebase.database.DataSnapshot) => {
            this.TerminatedListsAsDemander=snapshot1.val();
        });

        this.TerminatedListsAsShopper_db = af.database.list("terminated_lists/" + globals.UID + "/as_shopper"); 
        this.TerminatedListsAsShopper_db.$ref.on("value", (snapshot2: firebase.database.DataSnapshot) => {
            this.TerminatedListsAsShopper=snapshot2.val();
        });

        for (let demander_key in this.TerminatedListsAsDemander) {
            let list_d: FeasyList = this.TerminatedListsAsDemander[demander_key];
            if(list_d.ReviewDone == false)
                this.ReviewsToLeaveAsDemander.push(list_d);
        }

        for (let shopper_key in this.TerminatedListsAsShopper) {
            let list_s: FeasyList = this.TerminatedListsAsShopper[shopper_key];
            if(list_s.ReviewDone == false)
                this.ReviewsToLeaveAsShopper.push(list_s);
        }

    }

}