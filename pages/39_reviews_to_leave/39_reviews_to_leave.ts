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


    private reviewsToLeave: Array<any> = new Array<any>();

    constructor(public cd: ChangeDetectorRef, public navCtrl: NavController, public globals: Globals, public af: AngularFire, public alertCtrl: AlertController) {
        for (let candidature_key in this.globals.Candidatures) {
            //this.reviewsToLeave.push({ AddressName: "a", OwnerName: "b" });
            let candidature: Candidature = this.globals.Candidatures[candidature_key];
            this.af.database.object("/terminated_lists/" + candidature.ListOwnerUid + "/" + candidature.ListReferenceKey).$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
              //this.reviewsToLeave.push({ AddressName: "a2", OwnerName: "b2" });
              let list: FeasyList = snapshot.val();
                if (list != null) {
                    this.af.database.object("/users/" + candidature.ListOwnerUid).$ref.once("value", (snapshot2: firebase.database.DataSnapshot) => {
                      //this.reviewsToLeave.push({ AddressName: "a3", OwnerName: "b3" });
                      (list as any).OwnerName = snapshot2.val().DisplayName;
                        this.af.database.object("/terminated_lists/" + candidature.ListOwnerUid + "/" + candidature.ListReferenceKey + "/DeliveryAddresses/" + candidature.AddressKey).$ref.once("value", (snapshot3: firebase.database.DataSnapshot) => {
                            (list as any).AddressName = snapshot3.val().FormattedAddress;
                            this.reviewsToLeave.push(list);
                            this.cd.detectChanges();
                            //this.cd.markForCheck();
                        });
                    });
                }
            });
        }
    }

}