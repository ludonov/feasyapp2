import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { FirebaseError } from 'firebase';

import { FeasyUser } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

@Component({
  selector: 'page-signup',
  templateUrl: '3_signup.html'
})
export class SignupPage {

  public terms_accepted: boolean = false;
  public userdata: FeasyUser = new FeasyUser("", "", "");

  constructor(public navCtrl: NavController, public af: AngularFire, public alertCtrl: AlertController, public globals: Globals) {
    console.log("NAV> signup page");
    //this.user = Backendless.UserService.login("ludovico.novelli@gmail.com", "prova", true);
    //console.log(this.user);
  }

  signUp(): void {
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
    } else if (this.terms_accepted == false) {
      let alert = this.alertCtrl.create({
        title: 'Accettare i termini',
        subTitle: "Per continuare si prega di accettare i termini e le condizioni d'uso",
        buttons: ['Ok']
      });
      alert.present();
    } else {
      console.log("Normal logging...");
      this.globals.JustRegistered = true;
      this.globals.User.DisplayName = this.userdata.FirstName + " " + this.userdata.LastName;
      this.globals.User.Email = this.userdata.Email;
      this.globals.User.PhotoURL = "";
      this.af.auth.createUser(
        {
          email: this.userdata.Email,
          password: this.userdata.Password
        })
        .then((user: any) => {
          if (user != undefined && user.uid != undefined) {
            console.log("User successfully created. ID: " + user.uid);
            delete this.userdata.Password;
            this.userdata.DisplayName = this.userdata.FirstName + " " + this.userdata.LastName;
            this.af.database.object("users/" + user.uid).set(this.userdata).then((res) => {
              console.log("User data updated");
            }).catch((err: Error) => {
              console.warn("Cannot update user data: " + err.message);
            });
          }
        })
        .catch((error: FirebaseError) => {
          this.globals.JustRegistered = false;
          this.showRegisterError(error);
        });
    }
  }

  showRegisterError(error: FirebaseError): void {
    console.warn("Login error code: " + error.code + " - Message: " + error.message);
    if (error.code == "auth/invalid-email") {
      let alert = this.alertCtrl.create({
        title: 'Email invalida',
        subTitle: "Sembra che l'email inserita non sia valida. Si prega di ricontrollare.",
        buttons: ['Ok']
      });
      alert.present();
    } else if (error.code == "auth/email-already-in-use") {
      let alert = this.alertCtrl.create({
        title: 'Email esistente',
        subTitle: "L'indirizzo email inserito risulta essere già in uso.",
        buttons: ['Ok']
      });
      alert.present();
    } else if (error.code == "auth/weak-password") {
      let alert = this.alertCtrl.create({
        title: 'Password debole',
        subTitle: "La password inserita è troppo debole. Si ricorda che la password deve contenere almeno 6 caratteri.",
        buttons: ['Ok']
      });
      alert.present();
    } else if (error.code == "auth/operation-not-allowed") {
      let alert = this.alertCtrl.create({
        title: 'Impossibile registrare',
        subTitle: "Si prega di riprovare tra qualche minuto.",
        buttons: ['Ok']
      });
      alert.present();
    } else {
      let alert = this.alertCtrl.create({
        title: "Registration failed",
        subTitle: error.message,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

}
