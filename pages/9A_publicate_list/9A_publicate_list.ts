import { Component } from '@angular/core';

import { NavController, NavParams, NavOptions, AlertController, Loading, LoadingController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';


import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, GeoPoint, StripForFirebase, copyObject, ExpiryDateType, GetExpiryDates, GetRealExpiryDate } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { AddressViewPage } from '../../pages/29_address_view/29_address_view';
import { PublicateListSecondPage } from '../../pages/9B_publicate_list/9B_publicate_list';


@Component({
  selector: 'page-publicate-list-first',
  templateUrl: '9A_publicate_list.html'
})
export class PublicateListFirstPage {

  public list: FeasyList = new FeasyList("");
  public list_key: string;

  constructor(public navCtrl: NavController, public globals: Globals, public navParams: NavParams,  public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.list_key = navParams.get('list_key');
    if (this.list_key == undefined || this.list_key == null) {
      console.warn("PublicateListPage null list_key!!");
      navCtrl.pop();
    } else {
      //this.published_lists_db = globals.af.list('/published_lists/' + globals.UID);
      //this.unpublished_lists_db = globals.af.list('/unpublished_lists/' + globals.UID);
      this.list = globals.GetUnpublishedListByKey(this.list_key);
    }
  }

  GoToPublicateListSecond(): void {
    console.log("Goto really publicate list: " + this.list.Name);
    if (Object.keys(this.list.Name) == null) {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Aggiungere un nome alla lista",
        buttons: ['Ok']
      })
    } else if (this.list.Reward == null || this.list.Reward == 0) {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Inserire la mancia",
        buttons: ['Ok']
      });
      alert.present();
    } else {
        let loading: Loading = this.loadingCtrl.create({
            spinner: 'dots',
            content: 'Saving...'
        });
        loading.present();

        this.globals.UnpublishedLists_db.update(this.list_key, StripForFirebase(this.list)).then(res1 => {
            console.log("going to page publicate list 2");
            loading.dismiss().catch((err: Error) => {
              console.warn("PublicateListFirstPage> LoadingController dismiss: " + err.message);
            });
            this.navCtrl.push(PublicateListSecondPage, { list_key: this.list_key });
        }).catch((err: Error) => {
            console.warn("PublicateListFirstPage> cannot update list: " + err.message);
            loading.dismiss().catch((err: Error) => {
              console.warn("PublicateListFirstPage> LoadingController dismiss: " + err.message);
            });
            this.ShowGenericError();
        });
    }

  }

  ShowGenericError() {
    let alert = this.alertCtrl.create({
      title: 'Info',
      subTitle: "C'è stato un errore durante il salvataggio della lista. Ritentare nuovamente.",
      buttons: ['Ok']
    });
    alert.present();
  }
}