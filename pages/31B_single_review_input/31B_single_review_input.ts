import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { FeasyUser, FeasyList, FeasyItem, Review, StripForFirebase } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

@Component({
    selector: 'page-single-review',
    templateUrl: '31B_single_review_input.html'
})

export class SingleReviewInputPage {

    public LinkedTerminatedList: FeasyList = new FeasyList("");
    public review: Review = new Review();

    @ViewChild('FocusInput') FocusInputField;

    constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public globals: Globals) {
        this.review.Rating = 5;
        this.LinkedTerminatedList = navParams.get('review');
    }

    ionViewDidEnter() {
        setTimeout(() => {
            this.FocusInputField.setFocus();
        }, 150);
    }


    AddReview(): void {
        this.review.Rating = parseInt((this.review.Rating as any));

        if (this.review.Title == "" || this.review.Title == null) {
            let alert = this.alertCtrl.create({
                title: 'Info',
                subTitle: 'Il titolo non può essere vuoto',
                buttons: ['Ok']
            });
            alert.present();
        } else if (this.review.Rating < 0 || this.review.Rating > 5 || this.review.Rating == null) {
            let alert = this.alertCtrl.create({
                title: 'Info',
                subTitle: 'Il voto deve essere tra zero e cinque',
                buttons: ['Ok']
            });
            alert.present();
        } else if (this.review.Text == "" || this.review.Text == null) {
            let alert = this.alertCtrl.create({
                title: 'Info',
                subTitle: 'Il testo non può essere vuoto',
                buttons: ['Ok']
            });
            alert.present();
        } else {
            this.review.UID_Writer = this.globals.UID;
            if (this.globals.UID == this.LinkedTerminatedList.owner) {
                this.review.WriterName = this.LinkedTerminatedList.DemanderName;
                this.review.RevieweeUid = this.LinkedTerminatedList.ChosenShopperUid;
            } else {
                this.review.WriterName = this.LinkedTerminatedList.ChosenShopperName;
                this.review.RevieweeUid = this.LinkedTerminatedList.owner;
            }
            this.review.ListKey = this.LinkedTerminatedList.$key;
            this.globals.af.list("reviews/" + this.globals.UID + "/to_move").push(StripForFirebase(this.review)).then(res => {
                let list_db: FirebaseObjectObservable<any> = this.globals.UID == this.LinkedTerminatedList.owner ? this.globals.af.object("terminated_lists/" + this.globals.UID + "/as_demander/" + this.LinkedTerminatedList.$key + "/ReviewLeft") : this.globals.af.object("terminated_lists/" + this.globals.UID + "/as_shopper/" + this.LinkedTerminatedList.$key + "/ReviewLeft");
                list_db.set(true).then(res => {
                    this.navCtrl.popToRoot();
                }).catch((err: Error) => {
                    console.log("Error: " + err.message);
                });
            }).catch((err: Error) => {
                console.log("Error: " + err.message);
            });
        }
    }

}
