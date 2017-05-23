import { Component } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Platform, NavController, AlertController } from 'ionic-angular';
import { FirebaseError } from 'firebase';
import * as firebase from 'firebase';

import { FeasyUser, GenderType } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import {ForgotPassPage } from '../../pages/2_forgot_pass/2_forgot_pass';
import { SignupPage } from '../../pages/3_signup/3_signup';

@Component({
  selector: 'page-login',
  templateUrl: '1_login.html'
})
export class LoginPage {
  
  public userdata: FeasyUser = new FeasyUser("", "", "");
  public is_web: boolean = false;

  constructor(public navCtrl: NavController, private platform: Platform, public globals: Globals, public alertCtrl: AlertController, public facebook: Facebook) {
    console.log("NAV> login page");
    this.is_web = this.platform.is("core");
    //this.user = Backendless.UserService.login("ludovico.novelli@gmail.com", "prova", true);
    //console.log(this.user);
  }

  normalSignIn(): void {
    if (this.userdata.Email == "") {
      let alert = this.alertCtrl.create({
        title: 'Email mancante',
        subTitle: 'Inserisci la tua email per continuare',
        buttons: ['Ok']
      });
      alert.present();
    } else if (this.userdata.Password == "") {
      let alert = this.alertCtrl.create({
        title: 'Password mancante',
        subTitle: 'Inserisci una password per continuare',
        buttons: ['Ok']
      });
      alert.present();
    } else {
      console.log("Normal logging...");
      this.globals.afAuth.auth.signInWithEmailAndPassword(this.userdata.Email, this.userdata.Password)
        .then(function (user: any) {
          console.log("Normal Login successful");
        }).catch((error: FirebaseError) => {
          this.showLoginError(error);
        });
    }
  }

  showLoginError(error: FirebaseError): void {
    console.warn("Login error code: " + error.code + " - Message: " + error.message);
    if (error.code == "auth/invalid-email") {
      let alert = this.alertCtrl.create({
        title: 'Email invalida',
        subTitle: "Sembra che l'email inserita non sia valida. Si prega di ricontrollare.",
        buttons: ['Ok']
      });
      alert.present();
    } else if (error.code == "auth/user-not-found") {
      let alert = this.alertCtrl.create({
        title: 'Utente non trovato',
        subTitle: "Impossibile accedere. Ricontrollare le credenziali e ritentare.",
        buttons: ['Ok']
      });
      alert.present();
    } else if (error.code == "auth/wrong-password") {
      let alert = this.alertCtrl.create({
        title: 'Password errata',
        subTitle: "Impossibile accedere. La passsword inserita non è giusta.",
        buttons: ['Ok']
      });
      alert.present();
    } else {
      let alert = this.alertCtrl.create({
        title: "Login failed",
        subTitle: error.message,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  recoverPass(): void {
    console.log("going to recover pass");
    this.navCtrl.push(ForgotPassPage);
  }

  facebookSignIn(): void {
    console.log("Facebook logging...");
    if (this.is_web) {

      let alert = this.alertCtrl.create({
        title: "Info",
        subTitle: "Il login tramite Facebook è permesso solo da dispositivi mobili",
        buttons: ['Ok']
      });
      alert.present();
      //this.af.auth.login({
      //  provider: AuthProviders.Facebook,
      //  method: AuthMethods.Popup,
      //}).then(res => {
      //  console.log("Facebook login successful");
      //}).catch(res => {
      //  console.warn("Facebook login error: " + res);
      //});
    } else {
      this.facebook.login(["public_profile", "user_birthday", "user_hometown", "email"]).then((response) => {

        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);

        // get extra fb data from FB Graph API
        console.log("Getting extra user data from FB Graph API...");
        this.facebook.api("/me?fields=id,birthday,gender,first_name,last_name,name", ["public_profile", "user_birthday", "user_hometown", "email"]).then((extradata) => {
          console.log("Extra data retrieved. Signing to firebase...");
          this.globals.User.Birthdate = extradata.birthday || "";
          if (extradata.gender == "male")
            this.globals.User.Gender = GenderType.Male;
          else if (extradata.gender == "female")
            this.globals.User.Gender = GenderType.Female;
          else
            this.globals.User.Gender = null;
          this.globals.User.FirstName = extradata.first_name || "";
          this.globals.User.LastName = extradata.last_name || "";
          this.globals.User.DisplayName = extradata.first_name + " " + extradata.last_name[0] + ".";
          this.globals.User.PhotoURL = extradata.id != null ? "http://graph.facebook.com/" + extradata.id + "/picture?type=square&width=400&height=400" : "";
          this.globals.JustRegistered = true;
          firebase.auth().signInWithCredential(facebookCredential)
            .then((user) => {
              console.log("Firebase fb login success!" + user.DisplayName);
            })
            .catch((error) => {
              console.warn("Firebase fb login failure: " + JSON.stringify(error));
              this.globals.JustRegistered = false;
            });
        }).catch((err: Error) => {
          console.warn("Cannot read fb graph api: " + err.message);
          let alert = this.alertCtrl.create({
            title: "Info",
            subTitle: "Impossibile effettuare il login da Facebook. Riprovare.",
            buttons: ['Ok']
          });
          alert.present();
        });

      }).catch((err: Error) => { console.warn("Native fb login catch error: " + err.message) });
    }
  }

  signUp(): void {
    console.log("going to sign up");
    this.navCtrl.push(SignupPage);
  }

}
