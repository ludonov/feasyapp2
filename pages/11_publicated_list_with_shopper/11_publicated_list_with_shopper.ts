import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate, StripForFirebase } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { PaymentPage } from '../../pages/32_payment/32_payment';
import { PublicatedListProductsPage } from '../../pages/12_publicated_list_products/12_publicated_list_products';
import { AddressViewStaticPage } from '../../pages/30_address_view_static/30_address_view_static';

@Component({
    selector: 'page-publicated-with-shopper',
    templateUrl: '11_publicated_list_with_shopper.html'
})

export class PublicatedListWithShopperPage {

    private list_key: string;
    private ChosenCandidate: FeasyUser = new FeasyUser("", "", "");
    private ChosenAddress: DeliveryAddress = new DeliveryAddress();
    private list: FeasyList = new FeasyList("");
    private candidate: Candidate = new Candidate();

    constructor(public navCtrl: NavController, public globals: Globals, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController) {
        this.list_key = navParams.get('list_key');
        if (this.list_key == undefined || this.list_key == null) {
            console.warn("PublicatedListWithShopperPage null list_key. Going back.")
            navCtrl.pop();
        } else {
            this.list = globals.PublishedLists[this.list_key];
            if (globals.Candidates[this.list_key] == null) {
                console.warn("PublicatedListWithShopperPage null candidate. Going back.")
                navCtrl.pop();
            } else {
                this.candidate = globals.getAcceptedCandidateFromList(this.list_key);
                this.ChosenAddress = this.list.DeliveryAddresses[this.candidate.AddressKey];
                af.database.object("/users/" + this.candidate.uid).$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
                    this.ChosenCandidate = snapshot.val() || new FeasyUser("", "", "");
                });
            }
        }
    }

    goToPayment(): void {
        console.log("REMOVING LIST");
        //this.navCtrl.push(PaymentPage);

        //let list_copy: FeasyList = Object.assign({}, this.list);

        //list_copy.PublishedDate = (new Date()).toUTCString();
        //this.af.database.list('/published_lists/' + this.globals.UID).push(StripForFirebase(list_copy)).then(res => {
        //    console.log("List Published! Publishing geopoints...");
        //    let uid: string = this.globals.UID;
        //    console.log("Removing list from unpublished_lists...");
        //    this.af.database.list('/unpublished_lists/' + this.globals.UID).remove(this.list_key).then(res => {
        //        console.log("Removed list from unpublished lists!");
        //        loading.dismiss();
        //        this.navCtrl.popToRoot();
        //    }).catch((err: Error) => {
        //        console.warn("Cannot remove list from unpublished lists: " + err.message);
        //        loading.dismiss();
        //        this.ShowGenericError();
        //    });
        //}).catch((err: Error) => {
        //    console.warn("Cannot push list to published lists: " + err.message);
        //    this.ShowGenericError();
        //});
    }

    ViewAddress(): void {
        console.log("Going to AddressViewStaticPage");
        this.navCtrl.push(AddressViewStaticPage, { address: this.ChosenAddress });
    }

    ViewItems(): void {
        console.log("Going to PublicatedListProductsPage");
        this.navCtrl.push(PublicatedListProductsPage, { items: this.list.Items });
    }

}
