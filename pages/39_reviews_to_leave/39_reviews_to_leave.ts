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


    private ReviewsToLeaveAsDemander: Array<any> = new Array<any>();
    private ReviewsToLeaveAsShopper: Array<any> = new Array<any>();
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

        for (let demander_key in this.TerminatedListsAsDemander_db) {
            let list: FeasyList = this.TerminatedListsAsDemander_db[demander_key];
            if(list.ReviewDone == false)
                this.ReviewsToLeaveAsDemander.push(list);
        }

        for (let shopper_key in this.TerminatedListsAsShopper_db) {
            let list: FeasyList = this.TerminatedListsAsShopper_db[shopper_key];
            if(list.ReviewDone == false)
                this.ReviewsToLeaveAsShopper.push(list);
        }

        // for (let candidature_key in this.globals.Candidatures) {
        //     //this.reviewsToLeave.push({ AddressName: "a", OwnerName: "b" });
        //     let candidature: Candidature = this.globals.Candidatures[candidature_key];
        //     this.af.database.object("/terminated_lists/" + candidature.ListOwnerUid + "/" + candidature.ListReferenceKey).$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
        //       //this.reviewsToLeave.push({ AddressName: "a2", OwnerName: "b2" });
        //       let list: FeasyList = snapshot.val();
        //         if (list != null) {
        //             this.af.database.object("/users/" + candidature.ListOwnerUid).$ref.once("value", (snapshot2: firebase.database.DataSnapshot) => {
        //               //this.reviewsToLeave.push({ AddressName: "a3", OwnerName: "b3" });
        //               (list as any).OwnerName = snapshot2.val().DisplayName;
        //                 this.af.database.object("/terminated_lists/" + candidature.ListOwnerUid + "/" + candidature.ListReferenceKey + "/DeliveryAddresses/" + candidature.AddressKey).$ref.once("value", (snapshot3: firebase.database.DataSnapshot) => {
        //                     (list as any).AddressName = snapshot3.val().FormattedAddress;
        //                     this.reviewsToLeave.push(list);
        //                     this.cd.detectChanges();
        //                     //this.cd.markForCheck();
        //                 });
        //             });
        //         }
        //     });
        // }
    }

}