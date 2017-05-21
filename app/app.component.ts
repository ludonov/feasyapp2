import { Component, ViewChild, enableProdMode } from '@angular/core';
import { Http } from '@angular/http';

import { Platform, NavController, Tabs, AlertController, Alert, Loading, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { ImagePicker } from '@ionic-native/image-picker';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/1_login/1_login';
import { ListsPage } from '../pages/6_lists/6_lists';
import { DoShoppingPage } from '../pages/18A_do_shopping/18A_do_shopping';
import { ChatListPage } from '../pages/19_chat_list/19_chat_list';

import { SetPersonalDetailsPage } from '../pages/4A_set_personal_details/4A_set_personal_details';
import { PublicatedListCandidatesPage } from '../pages/14_publicated_list_candidates/14_publicated_list_candidates';
import { SettingsPage } from '../pages/23_settings/23_settings';
import { UserProfilePage } from '../pages/17_user_profile/17_user_profile';
import { ReviewsToLeavePage } from '../pages/39_reviews_to_leave/39_reviews_to_leave';
import { PublicatedListWithShopperPovShopperPage } from '../pages/11B_publicated_list_with_shopper_pov_shopper/11B_publicated_list_with_shopper_pov_shopper';

import { Candidate, FeasyUser, StripForFirebase, FeasyList } from '../classes/Feasy';
import { Globals, NotificationType } from '../classes/Globals';

import { MenuController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';


@Component({
  templateUrl: 'app.html',
  providers: [Globals, StatusBar, Keyboard],
})
export class MyApp {
  rootPage: any = LoginPage;
  @ViewChild('mynav') public navCtrl: NavController;
  @ViewChild("footerTabs") footerTabs: Tabs;

  _user: Observable<firebase.User>;


  constructor(platform: Platform, private storage: Storage, public af: AngularFireDatabase, public afAuth: AngularFireAuth, public globals: Globals, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public http: Http, private splashScreen: SplashScreen, private keyboard: Keyboard, private statusBar: StatusBar, public menuCtrl: MenuController, private localNotifications: LocalNotifications, private imagePicker: ImagePicker, public camera: Camera, photoViewer: PhotoViewer) {
   
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.styleDefault();
      if (!platform.is('core'))
        splashScreen.hide();
      //keyboard.disableScroll(false);
      //keyboard.hideKeyboardAccessoryBar(true);

      keyboard.onKeyboardShow().subscribe(() => {
        document.body.classList.add('keyboard-is-open');
      });

      keyboard.onKeyboardHide().subscribe(() => {
        document.body.classList.remove('keyboard-is-open');
      });

      if (!platform.is('core')) {
        localNotifications.registerPermission().then(function (granted) {
          console.log("local notification permission: " + granted);
        });
      }
      globals.storage = storage;
      globals.af = af;
      globals.afAuth = afAuth;
      globals.alertCtrl = alertCtrl;
      globals.navCtrl = this.navCtrl;
      globals.loadingCtrl = this.loadingCtrl;
      globals.http = http;
      globals.localNotifications = localNotifications;
      globals.imagePicker = imagePicker;
      globals.camera = camera;
      globals.photoViewer = photoViewer;
      globals.root = LoginPage;

      if (!globals.IsWeb)
        localNotifications.on("click", (noti) => { globals.NotificationHandler(noti); });

      globals.StartConfigWatcher();

      this._user = afAuth.authState;

      this._user.subscribe( (user: firebase.User) => {

        console.log("AUTH STATE CHANGED!");
        console.log(user);

        globals._user = user;

        if (user) {

          let loading: Loading = this.loadingCtrl.create({
            spinner: 'dots',
            content: 'Please wait...'
          });
          loading.present();

          globals.UID = user.uid;
          globals.User.Email = user.email;

          //FACEBOOK
          //if (user.provider == AuthProviders.Facebook) {
          //  globals.User.DisplayName = user.auth.displayName;
          //  //globals.User.PhotoURL = user.auth.photoURL;
          //  let user_db: FirebaseObjectObservable<any> = globals.af.object("users/" + user.uid);
          //  user_db.$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
          //    console.log("Found FB user. Checking if user exists and updating user data...");
          //    let userdata: FeasyUser = snapshot.val();
          //    if (userdata == null) {
          //      console.log("Just registered! Updating FB user data and Redirecting to Personal details");
          //      //user_db.set(StripForFirebase(globals.User))
          //      //  .then(res => {
          //      //    console.log("FB user data updated");
          //      //  })
          //      //  .catch((err: Error) => {
          //      //    console.warn("Cannot update fb user data: " + err.message);
          //      //  });
          //      this.setRoot(SetPersonalDetailsPage);
          //      loading.dismiss();
          //    }
          //    else {
          //      globals.User = userdata;
          //      console.log("Redirecting to tab root 1");
          //      this.setRoot(TabsPage);
          //      loading.dismiss();
          //    }
          //  });
          //  console.log("Name: " + this.globals.User.DisplayName);


          ////NORMAL
          //} else {

            //console.log("Found normal User");
            //globals.User.PhotoURL = "assets/img/unknown_man.png";
            if (globals.JustRegistered) {
              globals.JustRegistered = false;
              console.log("Just registered! Updating userdata and Redirecting to Personal details");
              //user.auth.updateProfile({
              //  displayName: this.globals.User.DisplayName,
              //  photoURL: this.globals.User.PhotoURL
              //});

              // update profile
              this.af.object("users/" + user.uid).$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
                let _user: FeasyUser = snapshot.val();
                if (_user == null || _user.RegisterDate == null) {
                  this.globals.User.RegisterDate == (new Date()).toUTCString();
                }
                this.af.object("users/" + user.uid).update(this.globals.User).then((res) => {
                  console.log("User data updated");
                }).catch((err: Error) => {
                  console.warn("Cannot update user data: " + err.message);
                });
              });
              this.setRoot(SetPersonalDetailsPage);
              loading.dismiss();
            }
            else {
              //check if RegisterDate is present, otherwise set it
              this.af.object("users/" + user.uid).$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
                let _user: FeasyUser = snapshot.val();
                if (_user != null && _user.RegisterDate == null) {
                  this.af.object("users/" + user.uid + "/RegisterDate").set((new Date()).toUTCString()).then((res) => {
                    console.log("User register date set");
                  }).catch((err: Error) => {
                    console.warn("Cannot update user register date: " + err.message);
                  });
                }
              });
              //if (user.auth.displayName == null) {
              //  user.auth.updateProfile({
              //    displayName: this.globals.User.DisplayName,
              //    photoURL: this.globals.User.PhotoURL
              //  });
              //}
              console.log("Redirecting to homepage");
              this.setRoot(TabsPage);
              loading.dismiss();
            }
          //}
          globals.LinkAllWatchers();
        } else {
          console.log("User auth not found, redirecting to Login");
          if (globals.UID != null && globals.UID != "") {
            this.logout();
          }
        }
      });
      //if (this.globals.UID != null) {
      //  console.log("INIT User auth found, redirecting to Home");
      //  this.rootPage = TabsPage;
      //} else {
      //  console.log("INIT User auth not found, redirecting to Login");
      //  this.rootPage = LoginPage;
      //}
    });

    if (!platform.is('core'))
      statusBar.styleLightContent();

  }

  private setRoot(rootPage: any) {
    this.globals.root = rootPage
    this.rootPage = rootPage;
  }


  //SIDE MENU

  menuOpen() {
      this.globals.MenuOpenChange.trigger(true);
  }

  menuClosed() {
      this.globals.MenuOpenChange.trigger(false);
  }

  goToProfile(): void {
    console.log("going to profile page");
    this.navCtrl.push(UserProfilePage);
    this.menuCtrl.close();
  }

  goToSettings(): void {
    console.log("going to settings page");
    this.navCtrl.push(SettingsPage);
    this.menuCtrl.close();
  }

  goToLists(): void {
    console.log("going to lists page");
    this.navCtrl.setRoot(TabsPage, { tabIndex: 0 });
    this.menuCtrl.close();
  }

  goToFind(): void {
    console.log("going to find page");
    this.navCtrl.setRoot(TabsPage, { tabIndex: 1 });
    this.menuCtrl.close();
  }

  goToChats(): void {
    console.log("going to chats page");
    this.navCtrl.setRoot(TabsPage, { tabIndex: 2 });
    this.menuCtrl.close();
  }

  goToReviewsToLeave(): void {
    console.log("going to reviews to leave page page");
    this.navCtrl.push(ReviewsToLeavePage);
    this.menuCtrl.close();
  }

  goToBigImage(): void {
    console.log("going to big image page");
    this.globals.ViewBigImage(this.globals.UserPicBig, this.navCtrl);
    this.menuCtrl.close();
  }

  //triggered after auth().signOut()
  private logout(): void {

    let loading: Loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });
    loading.present();

    console.log("Logging out: removing link to candidate refs");
    this.globals.UnlinkAllWatchers();
    this.globals.UID = "";
    this.setRoot(LoginPage);

    loading.dismiss();
  }

}
