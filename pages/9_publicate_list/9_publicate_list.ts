import { Component } from '@angular/core';

import { NavController, NavParams, NavOptions, AlertController, Loading, LoadingController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, GeoPoint, StripForFirebase, copyObject, ExpiryDateType, GetExpiryDates, GetRealExpiryDate } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { HomePage } from '../../pages/5_home/5_home';
import { AddressViewPage } from '../../pages/29_address_view/29_address_view';


@Component({
  selector: 'page-publicate-list',
  templateUrl: '9_publicate_list.html'
})
export class PublicateListPage {

  public list: FeasyList = new FeasyList("");
  public list_key: string;
  public addresses_db: FirebaseListObservable<any>;
  //public published_lists_db: FirebaseListObservable<any>;
  //public unpublished_lists_db: FirebaseListObservable<any>;
  public no_addresses: boolean = true;
  public expirydates: string[] = GetExpiryDates();

  constructor(public navCtrl: NavController, public globals: Globals, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.list_key = navParams.get('list_key');
    if (this.list_key == undefined || this.list_key == null) {
      console.warn("PublicateListPage null list_key!!");
      navCtrl.pop();
    } else {
      //this.published_lists_db = af.database.list('/published_lists/' + globals.UID);
      //this.unpublished_lists_db = af.database.list('/unpublished_lists/' + globals.UID);
      this.list = globals.UnpublishedLists[this.list_key];
      this.no_addresses = Object.keys(this.list.DeliveryAddresses).length == 0;
      this.addresses_db = af.database.list('unpublished_lists/' + globals.UID + '/' + this.list.$key + '/DeliveryAddresses');
      this.addresses_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
        this.no_addresses = !snapshot.hasChildren();
        //this.list = globals.UnpublishedLists[this.list_key];
        this.list.DeliveryAddresses = snapshot.val() || {};
      });
      this.list.ExpiryDate = ExpiryDateType.InThreeDays;
    }
  }


  AddAddress(): void {
    console.log("Goto add address");
    this.navCtrl.push(AddressViewPage, { list_key: this.list_key });
  }

  ViewAddress(address: any): void {
    console.log("Goto view address:" + address.FormattedAddress);
    let _address: DeliveryAddress = new DeliveryAddress();
    copyObject(address.value, _address);
    this.navCtrl.push(AddressViewPage, { list_key: this.list_key, address: _address, address_key: address.key });
  }


  PublicateList(): void {
    console.log("Goto really publicate list: " + this.list.Name);
    if (Object.keys(this.list.DeliveryAddresses).length == 0) {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Aggiungere almeno un indirizzo",
        buttons: ['Ok']
      });
      alert.present();
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
        content: 'Publishing...'
      });
      loading.present();

      let list_copy: FeasyList = Object.assign({}, this.list);
      //delete this.list.$key;
      //this.list.owner = this.globals.UID;
      list_copy.PublishedDate = (new Date()).toUTCString();
      this.af.database.list('/published_lists/' + this.globals.UID).push(StripForFirebase(list_copy)).then(res => {
        console.log("List Published! Publishing geopoints...");
        let uid: string = this.globals.UID;
        let counter: number = 0;
        for (let address_key in list_copy.DeliveryAddresses) {
          let geo: GeoPoint = new GeoPoint();
          geo.own = uid;
          geo.lst = res.key;
          geo.adr = address_key;
          geo.rew = list_copy.Reward;
          geo.exp = GetRealExpiryDate(list_copy.ExpiryDate);
          geo.lat = list_copy.DeliveryAddresses[address_key].Latitude;
          geo.lng = list_copy.DeliveryAddresses[address_key].Longitude;
          geo.com = list_copy.DeliveryAddresses[address_key].Comments;
          geo.cnt = Object.keys(list_copy.Items).length;
          this.af.database.list("geopoints").push(StripForFirebase(geo)).then((point) => {
              console.log("Geopoint published: " + point);
              this.af.database.object('/published_lists/' + this.globals.UID + "/DeliveryAddresses/" + address_key + "/GeopointKey").set(point.key).then(res => {
              }).catch((err: Error) => {
                  console.warn("Cannot update GeopointKey: " + err.message);
                  this.ShowGenericError();
              });
          }).catch((err: Error) => {
              console.warn("Cannot publish geopoint: " + err.message);
              this.ShowGenericError();
          });
        }
        console.log("Removing list from unpublished_lists...");
        this.af.database.list('/unpublished_lists/' + this.globals.UID).remove(this.list_key).then(res => {
          console.log("Removed list from unpublished lists!");
          loading.dismiss();
          this.navCtrl.popToRoot();
        }).catch((err: Error) => {
          console.warn("Cannot remove list from unpublished lists: " + err.message);
          loading.dismiss();
          this.ShowGenericError();
        });
      }).catch((err: Error) => {
        console.warn("Cannot push list to published lists: " + err.message);
        this.ShowGenericError();
      });
    }

  }

  ShowGenericError() {
    let alert = this.alertCtrl.create({
      title: 'Info',
      subTitle: "C'è stato un errore durante la pubblicazione della lista. Controllare sulla mappa se la lista è visualizzata correttamente.",
      buttons: ['Ok']
    });
    alert.present();
  }

}