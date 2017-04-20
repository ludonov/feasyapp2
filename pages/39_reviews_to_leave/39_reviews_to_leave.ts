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


  public reviewsToLeave: Object = {}; 

  constructor(public cd: ChangeDetectorRef, public navCtrl: NavController, public globals: Globals, public af: AngularFire, public alertCtrl: AlertController) {
    // let l: FeasyList = new FeasyList("Ciao");
    // (l as any).AddressName = "AAA";
    // (l as any).OwnerName = "BANABA";
    // this.reviewsToLeave["b"] = l;

    for(let candidature_key in globals.Candidatures){
        let candidature: Candidature = globals.Candidatures[candidature_key];
        af.database.object("/terminated_lists/" + candidature.ListOwnerUid + "/" + candidature.ListReferenceKey).$ref.once("value", (snapshot: firebase.database.DataSnapshot)=>{
            let list: FeasyList = snapshot.val();
            if(list != null){
                af.database.object("/users/" + candidature.ListOwnerUid).$ref.once("value", (snapshot2: firebase.database.DataSnapshot)=>{
                  (list as any).OwnerName = snapshot2.val().DisplayName;
                    af.database.object("/terminated_lists/" + candidature.ListOwnerUid + "/" + candidature.ListReferenceKey + "/DeliveryAddresses/" + candidature.AddressKey).$ref.once("value", (snapshot3: firebase.database.DataSnapshot)=>{
                      (list as any).AddressName = snapshot3.val().FormattedAddress;

                        let l: FeasyList = new FeasyList("Ciao");
                        (l as any).AddressName = "AAA";
                        (l as any).OwnerName = "BANABA";
                        this.reviewsToLeave["b"] = l;

                      // this.reviewsToLeave[snapshot3.key] = JSON.parse(JSON.stringify(list));
                      cd.detectChanges();
                    });
                });  
            }
        });
    }
  }

}

