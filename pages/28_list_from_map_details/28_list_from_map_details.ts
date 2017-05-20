import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs, LoadingController, Loading, LoadingOptions, Alert } from 'ionic-angular';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, Candidate, Candidature, StripForFirebase } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { PublicatedListProductsPage } from '../../pages/12_publicated_list_products/12_publicated_list_products';
import { AddressViewStaticPage } from '../../pages/30_address_view_static/30_address_view_static';
import { UserProfilePovOtherUsersPage } from "../17B_user_profile_pov_other_users/17B_user_profile_pov_other_users";

@Component({
  selector: 'page-list-from-map',
  templateUrl: '28_list_from_map_details.html'
})

export class ListFromMapPage {

  private list_key: string;
  private list_owner: string;
  private address_key: string;
  private list: FeasyList = new FeasyList("");
  private owner: FeasyUser = new FeasyUser("", "", "");
  private loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public globals: Globals) {

    this.list_key = navParams.get("list_key");
    this.list_owner = navParams.get("list_owner");
    this.address_key = navParams.get("address_key");

    if (this.list_key == null || this.list_owner == null || this.address_key == null) {
      console.warn("ListFromMapPage: null list_key or list_owner or address_key. Going back.");
      navCtrl.pop();
    } else {

      globals.af.object("/published_lists/" + this.list_owner + "/" + this.list_key).$ref.once("value", (snaphot: firebase.database.DataSnapshot) => {
        let _val: any = snaphot.val();
        if (_val == null) {
          console.warn("ListFromMapPage: null list data. Going back.");
          let alert: Alert = alertCtrl.create({
            title: 'Info',
            subTitle: "Impossibile trovare la lista selezionata. Questo può verificarsi se la lista è stata ritirata dal richiedente.",
            buttons: ['Ok']
          });
          alert.onDidDismiss(() => {
            navCtrl.pop();
          });
          alert.present();
        } else {
          this.list = _val;
        }
      });
      //  .catch((err: Error) => {
      //  console.warn("ListFromMapPage: cannot retrieve list data: " + err.message);
      //  let alert: Alert = alertCtrl.create({
      //    title: 'Info',
      //    subTitle: "Impossibile recuperare i dettagli della lista.",
      //    buttons: ['Ok']
      //  });
      //  alert.onDidDismiss(() => {
      //    navCtrl.pop();
      //  });
      //  alert.present();
      //});

      globals.GetUser(this.list_owner).then( val => {
        if (val == null) {
          console.warn("ListFromMapPage: null owner data. Going back.");
          let alert: Alert = alertCtrl.create({
            title: 'Info',
            subTitle: "Impossibile recuperare tutti i dettagli relativi alla lista selezionata.",
            buttons: ['Ok']
          });
          alert.onDidDismiss(() => {
            navCtrl.pop();
          });
          alert.present();
        } else {
          Object.assign(this.owner, val);
          this.owner.SetImageOrDefault();
        }
      });
      //.catch((err: Error) => {
      //  console.warn("ListFromMapPage: cannot retrieve owner data: " + err.message);
      //  let alert: Alert = alertCtrl.create({
      //    title: 'Info',
      //    subTitle: "Impossibile recuperare tutti i dettagli relativi alla lista selezionata.",
      //    buttons: ['Ok']
      //  });
      //  alert.onDidDismiss(() => {
      //    navCtrl.pop();
      //  });
      //  alert.present();
      //});
    }

  }

  ViewAddress(address: any): void {
    console.log("ListFromMapPage: goto view address");
    this.navCtrl.push(AddressViewStaticPage, { address: address.value });
  }

  ViewItems(): void {
    console.log("ListFromMapPage: goto view items");
    this.navCtrl.push(PublicatedListProductsPage, { items: this.list.Items });
  }

  Apply(): void {
    console.log("ListFromMapPage: applying to list");

    if (this.globals.IsAlreadyCandidate(this.list_key)) {
      let alert: Alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Sei già candidato per questa lista!",
        buttons: ['Ok']
      });
      alert.present();
    } else {

      let alert1 = this.alertCtrl.create({
        title: 'Aggiungi commento',
        message: "C'è qualcosa che vorresti far sapere al tuo richiedente? Scrivi qui qualunque informazione aggiuntiva oppure lascia vuoto!",
        inputs: [
          {
            name: 'comment',
            placeholder: 'Inserisci commento o lascia vuoto'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Ok',
            handler: data => {
              this.loading = this.loadingCtrl.create({
                spinner: 'dots',
                content: 'Please wait...'
              });

              this.loading.present();
              let new_candidature: Candidature = new Candidature();
              new_candidature.ListOwnerUid = this.list_owner;
              new_candidature.ListReferenceKey = this.list_key;
              new_candidature.AddressKey = this.address_key;
              new_candidature.Comment = data.comment || "";
              this.globals.AddCandidature(new_candidature).then((res: boolean) => {
                console.log("ListFromMapPage: candidate added!");
                this.loading.dismiss();
                let alert2: Alert = this.alertCtrl.create({
                  title: 'Info',
                  subTitle: "Ti sei candidato alla lista!",
                  buttons: ['Ok']
                });
                alert2.onDidDismiss(() => {
                  this.navCtrl.pop();
                });
                alert2.present();
              }).catch((err: Error) => {
                this.loading.dismiss();
                console.log("ListFromMapPage: cannot candidate: " + err.message);
                let alert3: Alert = this.alertCtrl.create({
                  title: 'Info',
                  subTitle: err.message == "already_candidated" ? "Sei già candidato per questa lista!" : "Impossibile candidarsi alla lista selezionata.",
                  buttons: ['Ok']
                });
                alert3.present();
              });
            }
          }
        ]
      });
      alert1.present();
    }
  }

  goToProfileOtherUser(): void {
    console.log("going to profile page of another user");
    this.navCtrl.push(UserProfilePovOtherUsersPage, { userUID: this.list_owner });
  }

}
