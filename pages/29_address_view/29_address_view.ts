import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { FeasyUser, FeasyList, FeasyItem, DeliveryAddress, StripForFirebase } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

@Component({
  selector: 'page-address-view',
  templateUrl: '29_address_view.html'
})
export class AddressViewPage {

  public list_key: string;
  public address_key: string;
  public addresses_db: FirebaseListObservable<any>;
  public address: DeliveryAddress;
  public is_new: boolean = true;
  
  tabBarElement: any;
  @ViewChild('StreetNameInput') StreetNameInput;

  constructor(public navCtrl: NavController, public navParams: NavParams,  public alertCtrl: AlertController, public globals: Globals) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.list_key = navParams.get('list_key');
    if (this.list_key == null) {
      console.warn("AddressViewPage null list_key!!");
      navCtrl.pop();
    } else {
      this.addresses_db = globals.af.list('unpublished_lists/' + globals.UID + '/' + this.list_key + '/DeliveryAddresses');
      this.address_key = navParams.get('address_key');
      let address: DeliveryAddress = navParams.get('address');
      this.is_new = address == undefined || address == null;
      if (this.is_new) {
        this.address = new DeliveryAddress();
      } else {
        this.address = address;
      }
    }
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.StreetNameInput.setFocus();
    }, 150);
  }


  saveAddress(): void {
    if (this.address.StreetName == "") {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Inserire l'indirizzo.",
        buttons: ['Ok']
      });
      alert.present();
    } else if (this.address.City == "") {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Inserire la città.",
        buttons: ['Ok']
      });
      alert.present();
    } else if (this.address.From == "" || this.address.To == "") {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Completare le informazioni relative alla fascia oraria (dalle-alle).",
        buttons: ['Ok']
      });
      alert.present();
    } else {
      console.log("Saving address: " + this.address.toString());
      this.address.Geocode(this.alertCtrl).then( (res) => {
        console.log("Address check completed, updating db...");
        if (this.is_new) {
          let new_addr_promise = this.addresses_db.push(this.address);
          let new_item_key = new_addr_promise.key;
          new_addr_promise.then(new_addr_db => {
            console.log("New address <" + new_item_key + "> saved");
            this.navCtrl.pop();
          });
        } else {
          this.addresses_db.update(this.address_key, StripForFirebase(this.address)).then(res => {
            console.log("Existing address <" + this.address_key + "> updated");
            this.navCtrl.pop();
          });

        }
      }).catch( (err: Error) => {
        if (err.message != "cancelled") {
          let alert = this.alertCtrl.create({
            title: 'Info',
            subTitle: err.message,
            buttons: ['Ok']
          });
          alert.present();
        }
      });

    }
  }

  deleteAddress(): void {
    console.log("Deleting address:" + this.address.FormattedAddress);
    this.addresses_db.remove(this.address_key).then(res => {
      console.log("Address <" + this.address_key + " removed");
      this.navCtrl.pop();
    }).catch( (err:Error) => {
      console.log("Cannot remove address " + this.address_key + ": " + err.message);
    });;
  }

}