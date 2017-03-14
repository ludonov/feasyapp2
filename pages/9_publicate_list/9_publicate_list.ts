import { Component } from '@angular/core';

import { NavController, NavParams, NavOptions, AlertController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, GeoPoint, StripForFirebase, copyObject, GetExpiryDates, GetRealExpiryDate } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { HomePage } from '../../pages/5_home/5_home';
import { AddressViewPage } from '../../pages/29_address_view/29_address_view';


@Component({
  selector: 'page-publicate-list',
  templateUrl: '9_publicate_list.html'
})
export class PublicateListPage {

  //public list: FeasyList;
  public list_key: string;
  //public addresses_db: FirebaseListObservable<any>;
  //public published_lists_db: FirebaseListObservable<any>;
  //public unpublished_lists_db: FirebaseListObservable<any>;
  public no_addresses: boolean = true;
  public expirydates: string[] = GetExpiryDates();

  constructor(public navCtrl: NavController, public globals: Globals, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController) {
    this.list_key = navParams.get('list_key');
    if (this.list_key == undefined || this.list_key == null) {
      console.warn("PublicateListPage null list_key!!");
      navCtrl.pop();
    } else {
      //this.published_lists_db = af.database.list('/published_lists/' + globals.UID);
      //this.unpublished_lists_db = af.database.list('/unpublished_lists/' + globals.UID);
      //this.addresses_db = af.database.list('unpublished_lists/' + globals.UID + '/' + this.list.$key + '/DeliveryAddresses');
      //this.addresses_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      //  this.no_addresses = !snapshot.hasChildren();
      //  this.list.DeliveryAddresses = snapshot.val() || {};
      //});
      this.no_addresses = Object.keys(globals.UnpublishedLists[this.list_key].DeliveryAddresses).length == 0;
      globals.UnpublishedLists[this.list_key].ExpiryDate = "Tra 3 giorni";
      //this.DeliveryAddresses = [];
      //if (this.list.DeliveryAddresses != null)
      //  this.list.DeliveryAddresses = {};
      //for (let key of Object.keys(this.list.DeliveryAddresses)) {
      //  this.DeliveryAddresses.push(this.list.DeliveryAddresses[key]);
      //}
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
    console.log("Goto really publicate list: " + this.globals.UnpublishedLists[this.list_key].Name);
    if (Object.keys(this.globals.UnpublishedLists[this.list_key].DeliveryAddresses).length == 0) {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Aggiungere almeno un indirizzo",
        buttons: ['Ok']
      });
      alert.present();
    } else if (this.globals.UnpublishedLists[this.list_key].Reward == null || this.globals.UnpublishedLists[this.list_key].Reward == 0) {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Inserire la mancia",
        buttons: ['Ok']
      });
      alert.present();
    } else {
      let list_copy: FeasyList = Object.assign({}, this.globals.UnpublishedLists[this.list_key]);
      this.af.database.list('/unpublished_lists/' + this.globals.UID).remove(this.list_key).then(res => {
        console.log("Removed list fom unpublished lists first");
        //delete this.list.$key;
        //this.list.owner = this.globals.UID;
        list_copy.PublishedDate = (new Date()).toUTCString();
        this.af.database.list('/published_lists/' + this.globals.UID).push(StripForFirebase(list_copy)).then(res => {
          let uid: string = this.globals.UID;
          for (let address_key in list_copy.DeliveryAddresses) {
            let geo: GeoPoint = new GeoPoint();
            geo.own = uid;  
            geo.lst = res.key;
            geo.rew = list_copy.Reward;
            geo.exp = GetRealExpiryDate(list_copy.ExpiryDate);
            geo.lat = list_copy.DeliveryAddresses[address_key].Latitude;
            geo.lng = list_copy.DeliveryAddresses[address_key].Longitude;
            geo.com = list_copy.DeliveryAddresses[address_key].Comments;
            geo.cnt = Object.keys(list_copy.Items).length;
            this.af.database.list("geopoints").push(StripForFirebase(geo));
          }
          console.log("List published! Publishing geopoints...");
          this.navCtrl.popToRoot();
        }).catch((err: Error) => {
          console.warn("Cannot move list to published lists: " + err.message);
        });
      }).catch((err: Error) => {
        console.warn("Cannot remove list from unpublished lists first: " + err.message);
      });
    }

  }

}