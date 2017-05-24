import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { NavController, NavParams, NavOptions, AlertController, Loading, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { CloudFuncResponse, FeasyUser, FeasyList, FeasyItem, DeliveryAddress, GeoPoint, StripForFirebase, copyObject, ExpiryDateType, GetExpiryDates, GetRealExpiryDate } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { AddressViewPage } from '../../pages/29_address_view/29_address_view';


@Component({
  selector: 'page-publicate-list-second',
  templateUrl: '9B_publicate_list.html'
})
export class PublicateListSecondPage {

  public list: FeasyList = new FeasyList("");
  public list_key: string;
  //public published_lists_db: FirebaseListObservable<any>;
  //public unpublished_lists_db: FirebaseListObservable<any>;

  public addresses_db: FirebaseListObservable<any>;
  public no_addresses: boolean = true;

  constructor(public navCtrl: NavController, public http: Http, public globals: Globals, public navParams: NavParams,  public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.list_key = navParams.get('list_key');
    if (this.list_key == undefined || this.list_key == null) {
      console.warn("PublicateListPage null list_key!!");
      navCtrl.pop();
    } else {
      //this.published_lists_db = globals.af.list('/published_lists/' + globals.UID);
      //this.unpublished_lists_db = globals.af.list('/unpublished_lists/' + globals.UID);
      this.list = globals.GetUnpublishedListByKey(this.list_key);
      this.no_addresses = Object.keys(this.list.DeliveryAddresses).length == 0;
      this.addresses_db = globals.af.list('unpublished_lists/' + globals.UID + '/' + this.list.$key + '/DeliveryAddresses');
      this.addresses_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
        this.no_addresses = !snapshot.hasChildren();
        //this.list = globals.UnpublishedLists[this.list_key];
        this.list.DeliveryAddresses = snapshot.val() || {};
      });
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
    if (Object.keys(this.list.DeliveryAddresses).length == 0) {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Aggiungere almeno un indirizzo",
        buttons: ['Ok']
      });
      alert.present();
    } else {

      let loading: Loading = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Publishing...'
      });
      loading.present();

      this.list.PublishedDate = (new Date()).toUTCString();
      (this.list as any).UnpublishedListKey = this.list_key;
      this.globals.PublishedLists_db.push(StripForFirebase(this.list)).then(res1 => {
        this.globals.DeleteFromArrayByKey(this.globals.UnpublishedLists, this.list_key);
        this.globals.NoUnpublishedLists = this.globals.UnpublishedLists.length == 0;
        this.globals.RecopyArray(this.globals.UnpublishedLists);

        //let token: string;
        //firebase.auth().currentUser.getToken().then((_token) => {
        //    token = _token;
        //    this.http.get("https://us-central1-feasy-748cf.cloudfunctions.net/publishList?list_key=" + this.list_key + "&token=" + token).subscribe(res => {
        //        console.log("PublicateListSecondPage> Publish Cloud Function reply: " + res);
        loading.dismiss().catch((err: Error) => {
          console.warn("PublicateListSecondPage> LoadingController dismiss: " + err.message);
        });
        //        let func: CloudFuncResponse = CloudFuncResponse.fromString(res.text());
        //        if (func.Error) {
        //            console.log("PublicateListSecondPage> Publish Cloud Function error message: " + func.ErrorMessage);
        //            this.ShowGenericError();
        //        } else {
        console.log("PublicateListSecondPage> Publish Cloud Function succeded");
        this.navCtrl.popToRoot();
        //        }
        //    });
        //});
      }).catch((err: Error) => {
        console.warn("PublicateListSecondPage> Cannot publish geopoint: " + err.message);
        loading.dismiss().catch((err: Error) => {
          console.warn("PublicateListSecondPage> LoadingController dismiss: " + err.message);
        });
        this.ShowGenericError();
      });

      //this.list_copy.PublishedDate = (new Date()).toUTCString();
      //this.globals.af.list('/published_lists/' + this.globals.UID).push(StripForFirebase(this.list_copy)).then(res => {
      //  console.log("List Published! Publishing geopoints...");
      //  let uid: string = this.globals.UID;
      //  for (let address_key in this.list_copy.DeliveryAddresses) {
      //    let geo: GeoPoint = new GeoPoint();
      //    geo.own = uid;
      //    geo.lst = res.key;
      //    geo.adr = address_key;
      //    geo.rew = this.list_copy.Reward;
      //    geo.exp = GetRealExpiryDate(this.list_copy.ExpiryDate);
      //    geo.lat = this.list_copy.DeliveryAddresses[address_key].Latitude;
      //    geo.lng = this.list_copy.DeliveryAddresses[address_key].Longitude;
      //    geo.com = this.list_copy.DeliveryAddresses[address_key].Comments;
      //    geo.cnt = Object.keys(this.list_copy.Items).length;
      //    this.globals.af.list("geopoints").push(StripForFirebase(geo)).then(() => {
      //      console.log("Geopoint published");
      //    }).catch((err: Error) => {
      //      console.warn("Cannot publish geopoint: " + err.message);
      //      this.ShowGenericError();
      //    });
      //  }
      //  console.log("Removing list from unpublished_lists...");
      //  this.globals.af.list('/unpublished_lists/' + this.globals.UID).remove(this.list_key).then(res => {
      //    console.log("Removed list from unpublished lists!");
      //    loading.dismiss();
      //    this.navCtrl.popToRoot();
      //  }).catch((err: Error) => {
      //    console.warn("Cannot remove list from unpublished lists: " + err.message);
      //    loading.dismiss();
      //    this.ShowGenericError();
      //  });
      //}).catch((err: Error) => {
      //  console.warn("Cannot push list to published lists: " + err.message);
      //  this.ShowGenericError();
      //});
    }

  }

  ShowGenericError() {
    let alert = this.alertCtrl.create({
      title: 'Info',
      subTitle: "Non è stato possibile pubblicare la lista. Ritentare nuovamente.",
      buttons: ['Ok']
    });
    alert.present();
  }

}