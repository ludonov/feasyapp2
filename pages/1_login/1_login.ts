import { Component } from '@angular/core';
import { Facebook } from 'ionic-native';
import { Platform, NavController, AlertController } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { FirebaseError } from 'firebase';

import { FeasyUser } from '../../classes/Feasy';
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

  constructor(public navCtrl: NavController, private platform: Platform, public af: AngularFire, public globals: Globals, public alertCtrl: AlertController) {
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
      this.af.auth.login(
        {
          email: this.userdata.Email,
          password: this.userdata.Password
        },
        {
          provider: AuthProviders.Password,
          method: AuthMethods.Password
        })
        .catch((error: FirebaseError) => this.showLoginError(error))
        .then(function (user: any) {
          console.log("Login successful: " + user);
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
      this.af.auth.login({
        provider: AuthProviders.Facebook,
        method: AuthMethods.Popup,
      }).then(res => {
        console.log("Facebook login successful");
      }).catch(res => {
        console.warn("Facebook login error: " + res);
      });
    } else {
      Facebook.login(["public_profile", "user_birthday", "user_hometown", "email"]).then((response) => {

        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);

        // get extra fb data from FB Graph API
        console.log("Getting extra user data from FB Graph API...");
        Facebook.api("/me?fields=id,birthday,gender,first_name,last_name,name", ["public_profile", "user_birthday", "user_hometown", "email"]).then((extradata) => {
          console.log("Extra data retrieved. Signing to firebase...");
          this.globals.User.Birthdate = extradata.birthday || "";
          if (extradata.gender == "male")
            this.globals.User.Gender = "Uomo";
          else if (extradata.gender == "female")
            this.globals.User.Gender = "Donna";
          else
            this.globals.User.Gender = null;
          this.globals.User.FirstName = extradata.first_name || "";
          this.globals.User.LastName = extradata.last_name || "";
          this.globals.User.DisplayName = extradata.name || "";
          this.globals.User.PhotoURL = extradata.id != null ? "http://graph.facebook.com/" + extradata.id + "/picture?type=square&width=400&height=400" : "";
          firebase.auth().signInWithCredential(facebookCredential)
            .then((success) => {
              console.log("Firebase fb login success: " + JSON.stringify(success));
            })
            .catch((error) => {
              console.warn("Firebase fb login failure: " + JSON.stringify(error));
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
