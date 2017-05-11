import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Alert, Tabs } from 'ionic-angular';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate, StripForFirebase } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { PublicatedListProductsPage } from '../../pages/12_publicated_list_products/12_publicated_list_products';
import { AddressViewStaticPage } from '../../pages/30_address_view_static/30_address_view_static';

@Component({
    selector: 'page-terminated-list-info',
    templateUrl: '21_terminated_list_info.html'
})

export class TerminatedListInfoPage {

    private list_key: string;
    private OtherUser: FeasyUser = new FeasyUser("", "", "");
    private ChosenAddress: DeliveryAddress = new DeliveryAddress();
    private list: FeasyList = new FeasyList("");
    private OtherUserUid: string;
    private Demander: boolean;

    constructor(public navCtrl: NavController, public globals: Globals, public navParams: NavParams, public alertCtrl: AlertController) {
        this.list_key = navParams.get('list_key');
        this.Demander = navParams.get('demander');
        if (this.list_key == undefined || this.list_key == null || this.Demander == undefined || this.Demander == null) {
            console.warn("TerminatedListInfoPage null list_key or null demander(boolean). Going back.")
            navCtrl.pop();
        } else {
            if (this.Demander == true) {
                this.list = globals.GetTerminatedListAsDemanderByKey(this.list_key);
                this.OtherUserUid = this.list.ChosenShopperUid;
            } else {
                this.list = globals.GetTerminatedListAsShopperByKey(this.list_key);
                this.OtherUserUid = this.list.owner;
            }
            if (this.OtherUserUid == null) {
                console.warn("TerminatedListInfoPage list OtherUserUID not found. Going back.")
                navCtrl.pop();
            } else {
                for (let address_key in this.list.DeliveryAddresses) {
                    let address: DeliveryAddress = this.list.DeliveryAddresses[address_key];
                    if ((address as any).Chosen == true) {
                        this.ChosenAddress = address;
                        break;
                    }
                }
                globals.af.object("/users/" + this.OtherUserUid).$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
                    Object.assign(this.OtherUser, snapshot.val());
                    this.OtherUser.SetImageOrDefault();
                });
            }
        }
    }

    ShowGenericError() {
        let alert = this.alertCtrl.create({
            title: 'Info',
            subTitle: "C'è stato un errore durante la terminazione della lista. Ritentare nuovamente.",
            buttons: ['Ok']
        });
        alert.present();
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
