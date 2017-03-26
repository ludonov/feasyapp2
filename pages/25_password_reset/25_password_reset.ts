import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, StripForFirebase } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';


@Component({
  selector: 'page-passwordreset',
  templateUrl: '25_password_reset.html'
})
export class PasswordResetPage {

  public user_db: FirebaseObjectObservable<any>;
  public user: FeasyUser = new FeasyUser("", "", "");

  public old_password: string;
  public new_password: string;
  public repeat_new_password: string;

  constructor(public navCtrl: NavController, public af: AngularFire, public globals: Globals, public alertCtrl: AlertController) {
      this.user_db = af.database.object("users/" + globals.UID);
      this.user_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.user = snapshot.val();
    });
  }


  changePassword(): void {
    console.log("change password");
    if(this.old_password == this.user.Password) {
        if(this.new_password == this.repeat_new_password) {
            this.user.Password = this.new_password;
            this.user_db.update(StripForFirebase(this.user)).then(res => {
                this.navCtrl.pop();
            }).catch((err: Error) => {
                console.log("Error: " + err.message);
            });
        } else {
            let alert = this.alertCtrl.create({
                title: 'Info',
                subTitle: "Nuove Password sono diverse",
                buttons: ['Ok']
            });
            alert.present();
        }
    } else {
        let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Password Errata",
        buttons: ['Ok']
        });
        alert.present();
    }
  }


}
