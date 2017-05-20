
import { Injectable, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController, Alert, LoadingController, Loading, Platform } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { Observable } from 'rxjs/Observable';

import { Storage } from '@ionic/storage';

import { PublicatedListCandidatesPage } from '../pages/14_publicated_list_candidates/14_publicated_list_candidates';
import { PublicatedListWithShopperPovShopperPage } from '../pages/11B_publicated_list_with_shopper_pov_shopper/11B_publicated_list_with_shopper_pov_shopper';
import { MaintenancePage } from '../pages/99_maintenance/99_maintenance';
import { ViewBigPicture } from "../pages/42_view_big_picture/42_view_big_picture";

import { Config, FeasyUser, FeasyList, Candidate, Candidature, Review, GenderType, StripForFirebase, Chat, Message, ChatMessageType, GenericWithKey, UnknownMan, UnknownWoman } from './Feasy';

export enum NotificationType { Accepted, HasNewCandidate }

@Injectable()
export class Globals {

  public config: Config = new Config();
  private config_db: FirebaseObjectObservable<any>;
  public root: any;

  public UID: string = "";
  public _user: firebase.User;
  public IsWeb: boolean = true;
  public LN_AlreadyLinked: boolean = false;

  public WatchersLinked: boolean = false;

  public User: FeasyUser = new FeasyUser("", "", "");
  public User_db: FirebaseObjectObservable<any>;

  public UserPicBig: string;
  public UserPicBig_db: FirebaseObjectObservable<any>;

  public PublishedLists: Array<FeasyList> = new Array<FeasyList>();
  public PublishedLists_db: FirebaseListObservable<any>;
  public NoPublishedLists: boolean = true;

  public UnpublishedLists: Array<FeasyList> = new Array<FeasyList>();
  public UnpublishedLists_db: FirebaseListObservable<any>;
  public NoUnpublishedLists: boolean = true;

  public TerminatedListsAsDemander: Array<FeasyList> = new Array<FeasyList>();
  public TerminatedListsAsDemander_db: FirebaseListObservable<any>;
  public NoTerminatedListsAsDemander: boolean = true;

  public TerminatedListsAsShopper: Array<FeasyList> = new Array<FeasyList>();
  public TerminatedListsAsShopper_db: FirebaseListObservable<any>;
  public NoTerminatedListsAsShopper: boolean = true;

  public AcceptedLists: Array<FeasyList> = new Array<FeasyList>();
  public NoAcceptedLists: boolean = true;

  public AppliedLists: Array<FeasyList> = new Array<FeasyList>();
  public NoAppliedLists: boolean = true;

  public Candidates: Array<Candidate> = new Array<Candidate>();
  public Candidates_db: FirebaseListObservable<any>;

  public Candidatures: Array<Candidature> = new Array<Candidature>();
  public Candidatures_db: FirebaseListObservable<any>;

  public Reviews: Array<Review> = new Array<Review>();
  public Reviews_db: FirebaseListObservable<any>;
  public ReviewsToLeaveAsDemander: Array<FeasyList> = new Array<FeasyList>();
  public ReviewsToLeaveAsShopper: Array<FeasyList> = new Array<FeasyList>();

  public UserChats: Array<GenericWithKey> = new Array<GenericWithKey>();
  public UserChats_db: FirebaseListObservable<any>;

  public Chats: Array<Chat> = new Array<Chat>();
  private chat_messages_refs: Array<firebase.database.Query> = new Array();
  
  public JustRegistered: boolean = false;
  public NotificationCounter: number = 0;

  public loading: Loading;

  // NATIVE PLUGINS
  public storage: Storage;
  public af: AngularFireDatabase;
  public afAuth: AngularFireAuth;
  public navCtrl: NavController;
  public alertCtrl: AlertController;
  public loadingCtrl: LoadingController;
  public http: Http;
  public localNotifications: LocalNotifications;
  public imagePicker: ImagePicker;
  public camera: Camera;
  public photoViewer: PhotoViewer;


  // CACHE VARIABLES
  public UsersCache: Object = {};
  public UsersPicBigCache: Object = {};

  constructor(platform: Platform, public applicationRef: ApplicationRef, public cd: ChangeDetectorRef) {
    this.IsWeb = platform.is("core");
  }

  public NotificationHandler(notification: ILocalNotification) {
    console.log(notification);
    let data = JSON.parse(notification.data);
    if (data.type == NotificationType.Accepted)
      this.navCtrl.push(PublicatedListWithShopperPovShopperPage, data);
    else if (data.type == NotificationType.HasNewCandidate)
      this.navCtrl.push(PublicatedListCandidatesPage, data);
  }

  public BIG_IMAGE_MAX_WIDTH(): number {
    return 700;
  }

  public BIG_IMAGE_MAX_HEIGHT(): number {
    return 700;
  }

  public SMALL_IMAGE_MAX_WIDTH(): number {
    return 128;
  }

  public SMALL_IMAGE_MAX_HEIGHT(): number {
    return 128;
  }

  public StartConfigWatcher() {
    this.config_db = this.af.object("/config");
    this.config_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      let old_config: Config = new Config();
      Object.assign(old_config, this.config);
      this.config = snapshot.val() || new Config();
      if (this.config.Maintenance && !old_config.Maintenance) {
        console.log("APP WENT UNDER MAINTENANCE")
        this.navCtrl.popToRoot().then(() => {
          this.navCtrl.setRoot(MaintenancePage);
        });
      } else if (!this.config.Maintenance && old_config.Maintenance) {
        console.log("APP RECOVERED FROM MAINTENANCE")
        this.navCtrl.popToRoot().then(() => {
          this.navCtrl.setRoot(this.root);
        });
      }
    });
  }

  public updateUser(): firebase.Promise<void> {
    if (this.User_db != null)
      return this.User_db.update(StripForFirebase(this.User)).then(() => {
        console.log("Globals.updateUser> User data updated");
      }).catch((err: Error) => {
        console.warn("Globals.updateUser> Cannot update user data: " + err.message);
      });
  }

  public ShowGenericError(): Promise<any> {
    let alert = this.alertCtrl.create({
      title: 'Info',
      subTitle: "Si è verificato un errore. Si prega di controllare la propria connettività e ritentare nuovamente.",
      buttons: ['Ok']
    });
    return alert.present();
  }

  public LinkAllWatchers(): void {
    if (!this.WatchersLinked) {
      this.LinkUserWatchers();
      this.LinkListsWatchers();
      this.LinkCandidatesWatchers();
      this.LinkCandidaturesWatchers();
      this.LinkReviewsWatchers();
      this.LinkUserChatsWatchers();
      this.WatchersLinked = true;
    }
  }


  //LINK WATCHERS SECTION

  private LinkUserWatchers(): void {
    this.User_db = this.af.object('/users/' + this.UID);
    this.User_db.$ref.on("value", (_user: firebase.database.DataSnapshot) => {
      let u = _user.val();
      if (u != null) {
        let user: FeasyUser = new FeasyUser("", "", "");
        Object.assign(user, u);
        this.User = user;
        console.log("User data fetched. Name: " + this.User.DisplayName);
        if (this.User.Gender == null)
          this.User.Gender = GenderType.Male;
        this.User.SetImageOrDefault();
      } else {
        console.warn("User data null");
      }
    });

    this.storage.get("UserPicBig").then((big_pic) => {
      if (big_pic == null) {
        this.UserPicBig_db = this.af.object('/pics/' + this.UID + "/Big");
        this.UserPicBig_db.$ref.once("value", (_pic: firebase.database.DataSnapshot) => {
          let pic: string = _pic.val();
          if (pic != null) {
            console.log("User big pic fetched");
            this.SetNewUserPicBig(pic);
          } else {
            console.warn("User big pic null");
          }
        });
      } else {
        this.UserPicBig = big_pic;
      }
    });
  }

  public SetNewUserPicBig(pic: string) {
    this.UserPicBig = pic;
    this.storage.set("UserPicBig", pic);
  }

  private LinkListsWatchers(): void {

    // PUBLISHED LISTS WATCHERS

    this.PublishedLists_db = this.af.list('/published_lists/' + this.UID);
    this.PublishedLists_db.$ref.on("child_added", (list: firebase.database.DataSnapshot) => {
      this.PublishedLists.push(this.copy_new_snapshot_list(list));
      this.NoPublishedLists = this.PublishedLists.length == 0;
      //this.PublishedLists[list.key] = this.copy_snapshot_list(list);
      //this.NoPublishedLists = Object.keys(this.PublishedLists).length == 0;
      this.RecopyArray(this.PublishedLists);
    });

    this.PublishedLists_db.$ref.on("child_changed", (list: firebase.database.DataSnapshot) => {
      let i: number = this.GetIndexByKey(this.PublishedLists, list.key);
      if (i != -1)
        this.copy_snapshot_list(list, this.PublishedLists[i]);
      else
        console.warn("Globals.LinkListsWatchers> Cannot find index for key <" + list.key + "> in PublishedLists:child_changed");
      //this.PublishedLists[list.key] = this.copy_snapshot_list(list);
      this.RecopyArray(this.PublishedLists);
    });

    this.PublishedLists_db.$ref.on("child_removed", (list: firebase.database.DataSnapshot) => {
      this.DeleteFromArrayByKey(this.PublishedLists, list.key);
      this.NoPublishedLists = this.PublishedLists.length == 0;
      //delete this.PublishedLists[list.key];
      //this.NoPublishedLists = Object.keys(this.PublishedLists).length == 0;
      this.RecopyArray(this.PublishedLists);
    });


    // UNPUBLISHED LISTS WATCHERS

    this.UnpublishedLists_db = this.af.list('/unpublished_lists/' + this.UID);
    this.UnpublishedLists_db.$ref.on("child_added", (list: firebase.database.DataSnapshot) => {
      this.UnpublishedLists.push(this.copy_new_snapshot_list(list));
      this.NoUnpublishedLists = this.UnpublishedLists.length == 0;
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      //this.NoPublishedLists = Object.keys(this.PublishedLists).length == 0;
      this.RecopyArray(this.UnpublishedLists);
    });

    this.UnpublishedLists_db.$ref.on("child_changed", (list: firebase.database.DataSnapshot) => {
      let i: number = this.GetIndexByKey(this.UnpublishedLists, list.key);
      if (i != -1)
        this.copy_snapshot_list(list, this.UnpublishedLists[i]);
      else
        console.warn("Globals.LinkListsWatchers> Cannot find index for key <" + list.key + "> in UnpublishedLists_db:child_changed");
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      this.RecopyArray(this.UnpublishedLists);
    });

    this.UnpublishedLists_db.$ref.on("child_removed", (list: firebase.database.DataSnapshot) => {
      this.DeleteFromArrayByKey(this.UnpublishedLists, list.key);
      this.NoUnpublishedLists = this.UnpublishedLists.length == 0;
      //delete this.UnpublishedLists[list.key];
      //this.NoUnpublishedLists = Object.keys(this.UnpublishedLists).length == 0;
      this.RecopyArray(this.UnpublishedLists);
    });


    // TERMINATED LISTS AS DEMANDER WATCHERS

    this.TerminatedListsAsDemander_db = this.af.list('/terminated_lists/' + this.UID + '/as_demander');
    this.TerminatedListsAsDemander_db.$ref.on("child_added", (list: firebase.database.DataSnapshot) => {
      this.TerminatedListsAsDemander.push(this.copy_new_snapshot_list(list));
      this.NoTerminatedListsAsDemander = this.TerminatedListsAsDemander.length == 0;
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      //this.NoPublishedLists = Object.keys(this.PublishedLists).length == 0;
      this.RecopyArray(this.TerminatedListsAsDemander);

      let list_d: FeasyList = list.val();
      if(list_d.ReviewLeft == false) {
          list_d.$key = list.key;
          this.af.object('/users/' + list_d.ChosenShopperUid).$ref.on("value", (_user: firebase.database.DataSnapshot) => {
              let user: FeasyUser = _user.val();
              if (user != null && user.PhotoURL != null)
                  (list_d as any).PhotoURL = user.PhotoURL;
              this.ReviewsToLeaveAsDemander.push(list_d);
              this.ForceAppChanges();
          });
      }

    });

    this.TerminatedListsAsDemander_db.$ref.on("child_changed", (list: firebase.database.DataSnapshot) => {
      let i: number = this.GetIndexByKey(this.TerminatedListsAsDemander, list.key);
      if (i != -1)
        this.copy_snapshot_list(list, this.TerminatedListsAsDemander[i]);
      else
        console.warn("Globals.LinkListsWatchers> Cannot find index for key <" + list.key + "> in TerminatedLists_db:child_changed");
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      this.RecopyArray(this.TerminatedListsAsDemander);

      let list_d: FeasyList = list.val();
      if(list_d.ReviewLeft == true) {
        this.DeleteFromArrayByKey(this.ReviewsToLeaveAsDemander, list.key);
        this.ForceAppChanges();
      }
    });

    this.TerminatedListsAsDemander_db.$ref.on("child_removed", (list: firebase.database.DataSnapshot) => {
      this.DeleteFromArrayByKey(this.TerminatedListsAsDemander, list.key);
      this.NoTerminatedListsAsDemander = this.TerminatedListsAsDemander.length == 0;
      //delete this.UnpublishedLists[list.key];
      //this.NoUnpublishedLists = Object.keys(this.UnpublishedLists).length == 0;
      this.RecopyArray(this.TerminatedListsAsDemander);
      this.ForceAppChanges();
    });


    // TERMINATED LISTS AS SHOPPER WATCHERS

    this.TerminatedListsAsShopper_db = this.af.list('/terminated_lists/' + this.UID + '/as_shopper');
    this.TerminatedListsAsShopper_db.$ref.on("child_added", (list: firebase.database.DataSnapshot) => {
      this.TerminatedListsAsShopper.push(this.copy_new_snapshot_list(list));
      this.NoTerminatedListsAsShopper = this.TerminatedListsAsShopper.length == 0;
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      //this.NoPublishedLists = Object.keys(this.PublishedLists).length == 0;
      this.RecopyArray(this.TerminatedListsAsShopper);

      let list_d: FeasyList = list.val();
      if(list_d.ReviewLeft == false) {
          list_d.$key = list.key;
          this.af.object('/users/' + list_d.owner).$ref.on("value", (_user: firebase.database.DataSnapshot) => {
              let user: FeasyUser = _user.val();
              if (user != null && user.PhotoURL != null)
                  (list_d as any).PhotoURL = user.PhotoURL;
              this.ReviewsToLeaveAsShopper.push(list_d);
              this.ForceAppChanges();
          });
      }
    });

    this.TerminatedListsAsShopper_db.$ref.on("child_changed", (list: firebase.database.DataSnapshot) => {
      let i: number = this.GetIndexByKey(this.TerminatedListsAsShopper, list.key);
      if (i != -1)
        this.copy_snapshot_list(list, this.TerminatedListsAsShopper[i]);
      else
        console.warn("Globals.LinkListsWatchers> Cannot find index for key <" + list.key + "> in TerminatedLists_db:child_changed");
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      this.RecopyArray(this.TerminatedListsAsShopper);

      let list_d: FeasyList = list.val();
      if(list_d.ReviewLeft == true) {
        this.DeleteFromArrayByKey(this.ReviewsToLeaveAsShopper, list.key);
        this.ForceAppChanges();
      }
    });

    this.TerminatedListsAsShopper_db.$ref.on("child_removed", (list: firebase.database.DataSnapshot) => {
      this.DeleteFromArrayByKey(this.TerminatedListsAsShopper, list.key);
      this.NoTerminatedListsAsShopper = this.TerminatedListsAsShopper.length == 0;
      //delete this.UnpublishedLists[list.key];
      //this.NoUnpublishedLists = Object.keys(this.UnpublishedLists).length == 0;
      this.RecopyArray(this.TerminatedListsAsShopper);
      this.ForceAppChanges();
    });
  }

  private updateBooleansAcceptedAndApplied() {
    //this.NoAcceptedLists = Object.keys(this.AcceptedLists).length == 0;
    //this.NoAppliedLists = Object.keys(this.AppliedLists).length == 0;
    this.NoAcceptedLists = this.AcceptedLists.length == 0;
    this.NoAppliedLists = this.AppliedLists.length == 0;
  }

  private LinkCandidaturesWatchers(): void {

    try {

      this.Candidatures_db = this.af.list('/candidatures/' + this.UID);
      this.AppliedLists = new Array<FeasyList>();
      this.AcceptedLists = new Array<FeasyList>();
      this.NoAcceptedLists = true;
      this.NoAppliedLists = true;

      this.Candidatures_db.$ref.on("child_removed", (removed_cand: firebase.database.DataSnapshot) => {
        let cand: Candidature = this.GetCandidatureByKey(removed_cand.key);
        this.DeleteFromArrayByKey(this.AppliedLists, cand.ListReferenceKey);
        this.DeleteFromArrayByKey(this.AcceptedLists, cand.ListReferenceKey);
        //delete this.AppliedLists[cand.ListReferenceKey];
        //delete this.AcceptedLists[cand.ListReferenceKey];
        this.DeleteFromArrayByKey(this.Candidatures, removed_cand.key);
        this.updateBooleansAcceptedAndApplied();
        this.RecopyArray(this.Candidatures);
      });

      this.Candidatures_db.$ref.on("child_added", (_candidature: firebase.database.DataSnapshot) => {
        console.log("Globals.LinkCandidaturesWatchers > user has candidated to new list!");
        let candidature: Candidature = _candidature.val();
        candidature.$key = _candidature.key;
        this.Candidatures.push(candidature);
        this.af.object("/published_lists/" + candidature.ListOwnerUid + "/" + candidature.ListReferenceKey).$ref.once("value", (_list: firebase.database.DataSnapshot) => {
          let list: FeasyList = this.copy_new_snapshot_list(_list);
          (list as any).Candidature = candidature;
          (list as any).ChosenAddress = list.DeliveryAddresses[candidature.AddressKey];
          if (list != null && list.ChosenShopperUid == this.UID)
            this.AcceptedLists.push(list);
          else
            this.AppliedLists.push(list);
          this.updateBooleansAcceptedAndApplied();
        });
        this.RecopyArray(this.Candidatures);
      });


      this.Candidatures_db.$ref.on("child_changed", (_candidature: firebase.database.DataSnapshot) => {
        //console.log("Globals.LinkCandidaturesWatchers > user has candidated to new list!");
        let candidature: Candidature = _candidature.val();
        let i: number = this.GetIndexByKey(this.Candidatures, _candidature.key);
        if (i != -1)
          Object.assign(this.Candidatures[i], candidature);
        else
          console.warn("Globals.LinkCandidaturesWatchers> Cannot find index for key <" + _candidature.key + "> in child_changed");
        if (candidature.Accepted == true) {
          // moves list from applied to accepted
          this.AcceptedLists.push(this.GetElementByKey(this.AppliedLists, candidature.ListReferenceKey));
          this.DeleteFromArrayByKey(this.AppliedLists, candidature.ListReferenceKey);
          //this.AcceptedLists[candidature.ListReferenceKey] = {};
          //Object.assign(this.AcceptedLists[candidature.ListReferenceKey], this.AppliedLists[candidature.ListReferenceKey]);
          //delete this.AppliedLists[candidature.ListReferenceKey];
          this.updateBooleansAcceptedAndApplied();

          if (this.IsWeb) {
            let alert: Alert = this.alertCtrl.create({
              title: "Sei stato accettato!",
              subTitle: "Vuoi vedere i dettagli?",
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.navCtrl.push(PublicatedListWithShopperPovShopperPage, { list_owner: candidature.ListOwnerUid, list_key: candidature.ListReferenceKey, candidature_key: _candidature.key, candidature: candidature });
                  }
                }]
            });
            alert.present();
          } else {
            //if (!this.IsWeb && !this.LN_AlreadyLinked) {
            //  this.LN_AlreadyLinked = true;
            //}
            // Schedule a single notification
            this.localNotifications.schedule({
              id: this.NotificationCounter++,
              title: "Sei stato accettato!",
              text: "Clicca per vedere i dettagli",
              icon: 'res://icon',
              data: { type: NotificationType.Accepted, list_owner: candidature.ListOwnerUid, list_key: candidature.ListReferenceKey, candidature_key: _candidature.key, candidature: candidature }
            });
          }
        }
        this.RecopyArray(this.Candidatures);
      });

    } catch (e) {
      console.log("Globals.LinkCandidaturesWatchers catch err: " + JSON.stringify(e));
    }
  }

  public IsAlreadyCandidate(list_key: string): boolean {
    for (let candidature of this.Candidatures)
      if (candidature.ListReferenceKey == list_key)
        return true;
    return false;
  }

  public AddCandidature(candidature: Candidature): Promise<boolean> {
    console.log("Globals.AddCandidature > adding candidature to list " + candidature.ListReferenceKey);

    return new Promise((resolve, reject) => {
      if (this.IsAlreadyCandidate(candidature.ListReferenceKey)) {
        reject(new Error("already_candidated"));
      } else {
        this.Candidatures_db.push(candidature).then(() => {
          console.log("Globals.AddCandidature > new candidature pushed");
          resolve(true);
        }).catch((err: Error) => {
          reject(new Error("cannot add candidature to db: " + err.message));
        });
      }
    });
  }

  private LinkCandidatesWatchers(): void {
    try {
      this.Candidates_db = this.af.list("/candidates/" + this.UID);
      //this.candidates_refs.push(this.Candidates_db.$ref.ref);

      this.Candidates_db.$ref.on("child_removed", (removed_list: firebase.database.DataSnapshot) => {
        this.DeleteFromArrayByKey(this.Candidates, removed_list.key);
        this.RecopyArray(this.Candidates);
      });

      this.Candidates_db.$ref.on("child_added", (_candidate: firebase.database.DataSnapshot) => {

        let candidate: Candidate = _candidate.val();
        candidate.$key = _candidate.key;
        this.Candidates.push(candidate);
        if (!candidate.Visualised) {
          if (this.IsWeb) {
            let alert: Alert = this.alertCtrl.create({
              title: 'Nuovo candidato!',
              subTitle: "Vuoi vedere i dettagli?",
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel'
                },
                {
                  text: 'Ok',
                  handler: () => {
                    this.navCtrl.push(PublicatedListCandidatesPage, { list_key: candidate.ListReferenceKey });
                  }
                }]
            });
            alert.present();
          } else {
            // Schedule a single notification
            this.localNotifications.schedule({
              id: this.NotificationCounter++,
              title: 'Nuovo candidato!',
              text: "Clicca per vedere i dettagli",
              icon: 'res://icon',
              data: { type: NotificationType.HasNewCandidate, list_key: candidate.ListReferenceKey }
            });
          }
        }
        this.RecopyArray(this.Candidates);
        //});
      });


      this.Candidates_db.$ref.on("child_changed", (_candidate: firebase.database.DataSnapshot) => {
        //console.log("Globals.LinkCandidaturesWatchers > user has candidated to new list!");
        let candidate: Candidate = _candidate.val();
        //this.Candidates[_candidate.key] = candidate;

        let i: number = this.GetIndexByKey(this.Candidates, _candidate.key);
        if (i != -1)
          Object.assign(this.Candidates[i], candidate);
        else
          console.warn("Globals.LinkCandidatesWatchers> Cannot find index for key <" + _candidate.key + "> in child_changed");

        this.RecopyArray(this.Candidates);
      });

    } catch (e) {
      console.log("Globals.LinkCandidatesWatchers catch err: " + JSON.stringify(e));
    }
  }

  public getAcceptedCandidateFromList(list_key: string): Candidate {
    let list: FeasyList = this.GetPublishedListByKey(list_key);
    for (let cand of this.Candidates) {
      if (cand.CandidatureReferenceKey == list.ChosenCandidatureKey)
        return cand;
    }
    return null;
  }

  public GetAllCandidatesForList(list_key: string): Array<Candidate> {
    let cands: Array<Candidate> = new Array<Candidate>();
    for (let cand of this.Candidates) {
      if (cand.ListReferenceKey == list_key)
        cands.push(cand);
    }
    return cands;
  }

  private LinkReviewsWatchers(): void {

    try {
      this.Reviews_db = this.af.list('/reviews/' + this.UID + '/done');

      this.Reviews_db.$ref.on("child_removed", (removed_review: firebase.database.DataSnapshot) => {
        this.DeleteFromArrayByKey(this.Reviews, removed_review.key);
        this.RecopyArray(this.Reviews);
      });

      this.Reviews_db.$ref.on("child_added", (_review: firebase.database.DataSnapshot) => {
        let review: Review = _review.val();
        review.$key = _review.key;
        if (review != null)
          this.Reviews.push(review);
        this.RecopyArray(this.Reviews);
      });

      this.Reviews_db.$ref.on("child_changed", (_review: firebase.database.DataSnapshot) => {
        let review: Review = _review.val();
        let i: number = this.GetIndexByKey(this.Reviews, _review.key);
        if (i != -1)
          Object.assign(this.Reviews[i], review);
        else
          console.warn("Globals.LinkReviewsWatchers> Cannot find index for key <" + _review.key + "> in child_changed");

        this.RecopyArray(this.Reviews);
      });

    } catch (e) {
      console.log("Globals.LinkReviewsWatchers catch err: " + JSON.stringify(e));
    }
  
  }

  private LinkUserChatsWatchers(): void {
  
  
    try {
      this.UserChats_db = this.af.list("user_chats/" + this.UID);
      this.UserChats_db.$ref.on("child_removed", (removed_chat: firebase.database.DataSnapshot) => {
        this.DeleteFromArrayByKey(this.UserChats, removed_chat.key);
        this.DeleteFromArrayByKey(this.Chats, removed_chat.key);
        this.storage.set("chat_" + removed_chat.key + "_Info", null);
        this.storage.set("chat_" + removed_chat.key + "_MessagesInOrder", null);
        for (let ref of this.chat_messages_refs) {
          if ((ref as any).$key == removed_chat.key)
            ref.off();
        }
        this.ForceAppChanges();
      });

      this.UserChats_db.$ref.on("child_added", (_chat: firebase.database.DataSnapshot) => {     
        let chat: GenericWithKey = new GenericWithKey();
        chat.$key = _chat.key;
        if (chat != null) {
          this.UserChats.push(chat);
          this.LinkChatWatchers(_chat.key);
        }
        this.ForceAppChanges();
      });

    } catch(e) {
      console.log("Globals.LinkUserChatsWatchers catch err: " + JSON.stringify(e));
    }
  }

  private LinkChatWatchers(chatId: string): void {
    
    
    try {
      let chat_db: FirebaseObjectObservable<any> = this.af.object("/chats/" + chatId);

      //(chat_db as any).$key = chatId;
      //this.chat_refs.push(chat_db);

      let chat: Chat = new Chat();
      chat.$key = chatId;
      this.Chats.push(chat);
      this.storage.get("chat_" + chatId + "_Info").then(info => {
        let promises: Array<firebase.Promise<any>> = new Array();

        if (info != null) {
          Object.assign(chat, JSON.parse(info));
          // get photo
          this.GetUser((chat.DemanderUid == this.UID ? chat.ShopperUid : chat.DemanderUid)).then((user) => {
            chat.PhotoURL = user.PhotoURL || (user.Gender == GenderType.Male ? UnknownMan : UnknownWoman);
          }).catch(() => { });

        } else {
          info = {};
          //Download single static(once) properties
          promises.push(this.af.object("/chats/" + chatId + "/DemanderName").$ref.once("value", (_val: firebase.database.DataSnapshot) => {
            info.DemanderName = _val.val();
          }));
          promises.push(this.af.object("/chats/" + chatId + "/ShopperName").$ref.once("value", (_val: firebase.database.DataSnapshot) => {
            info.ShopperName = _val.val();
          }));
          promises.push(this.af.object("/chats/" + chatId + "/DemanderUid").$ref.once("value", (_val: firebase.database.DataSnapshot) => {
            info.DemanderUid = _val.val();
          }));
          promises.push(this.af.object("/chats/" + chatId + "/ShopperUid").$ref.once("value", (_val: firebase.database.DataSnapshot) => {
            info.ShopperUid = _val.val();
          }));
          promises.push(this.af.object("/chats/" + chatId + "/ListKey").$ref.once("value", (_val: firebase.database.DataSnapshot) => {
            info.ListKey = _val.val();
          }));


          firebase.Promise.all(promises).then(() => {
            Object.assign(chat, info);
            this.storage.set("chat_" + chatId + "_Info", JSON.stringify(info));
            // get photo
            this.GetUser((chat.DemanderUid == this.UID ? chat.ShopperUid : chat.DemanderUid)).then((user) => {
              chat.PhotoURL = user.PhotoURL || (user.Gender == GenderType.Male ? UnknownMan : UnknownWoman);
            }).catch(() => { });
          });
        }


        let add_message = (_message: firebase.database.DataSnapshot) => {
          if (chat.Messages[_message.key] == null) {
            let message: Message = _message.val();
            message.$key = _message.key;
            //message.Date = new Date(message.timestamp);
            message.Type = message.Type || ChatMessageType.Text;
            chat.Messages[_message.key] = message;
            chat.MessagesInOrder.push(message);
            this.storage.set("chat_" + chatId + "_MessagesInOrder", JSON.stringify(chat.MessagesInOrder));
            this.ForceAppChanges();
          }
        }

        let chat_messages_ref: firebase.database.Query = this.af.list("/chats/" + chatId + "/Messages").$ref;
        (chat_messages_ref as any).$key = chatId;
        this.chat_messages_refs.push(chat_messages_ref);
        this.storage.get("chat_" + chatId + "_MessagesInOrder").then(messages_in_order => {
          if (messages_in_order == null) {
            //download all messages
            chat_messages_ref.orderByChild("timestamp").once("value", (_val: firebase.database.DataSnapshot) => {
              chat.Messages = _val.val() || {};
              for (let msgKey in chat.Messages) {
                chat.Messages[msgKey].$key = msgKey;
                //chat.Messages[msgKey].Date = new Date(chat.Messages[msgKey].timestamp);
                chat.Messages[msgKey].Type = chat.Messages[msgKey].Type || ChatMessageType.Text;
              }
              chat.MessagesInOrder = this.ObjToArray<Message>(chat.Messages);
              chat.LastMessage = chat.MessagesInOrder.length > 0 ? chat.MessagesInOrder[chat.MessagesInOrder.length - 1] : null;
              this.storage.set("chat_" + chatId + "_MessagesInOrder", JSON.stringify(chat.MessagesInOrder)).then(() => {
                if (chat.LastMessage != null)
                  chat_messages_ref.orderByChild("timestamp").startAt(chat.LastMessage.timestamp).on("child_added", add_message);
                else
                  chat_messages_ref.orderByChild("timestamp").on("child_added", add_message);
              });
            });
          } else {
            chat.MessagesInOrder = JSON.parse(messages_in_order);
            chat.Messages = this.ArrayToObj(chat.MessagesInOrder);
            chat.LastMessage = chat.MessagesInOrder.length > 0 ? chat.MessagesInOrder[chat.MessagesInOrder.length - 1] : null;
            if (chat.LastMessage != null)
              chat_messages_ref.orderByChild("timestamp").startAt(chat.LastMessage.timestamp).on("child_added", add_message);
            else
              chat_messages_ref.orderByChild("timestamp").on("child_added", add_message);
          }
        });
      });

    } catch (e) {
      console.log("Globals.LinkChatWatchers catch err: " + JSON.stringify(e));
    }
  }  

  //private SortMessageArrayByDate(_chat_key: string): void {
  //  let _chat: Chat = this.GetChatByKey(_chat_key);
  //  let _keys: Array<string> = Object.keys(_chat.Messages);
  //  let MessagesInOrder: Array<Message> = new Array<Message>();
  //  for (let i = 0; i < _keys.length; i++) {
  //    _chat.Messages[_keys[i]].Date = new Date(_chat.Messages[_keys[i]].timestamp);
  //    _chat.Messages[_keys[i]].Type = _chat.Messages[_keys[i]].Type || ChatMessageType.Text;
  //    if (i == 0) {
  //      MessagesInOrder.push(_chat.Messages[_keys[i]]);
  //    } else {
  //      for (let j = 0; j < MessagesInOrder.length; j++) {
  //        if (_chat.Messages[_keys[i]].Date > MessagesInOrder[j].Date) {
  //          MessagesInOrder.splice((_keys.length - j), 0, _chat.Messages[_keys[i]]);
  //          break;
  //        }
  //      }
  //    }
  //  }
  //  _chat.MessagesInOrder = MessagesInOrder;
  //  _chat.LastMessage = MessagesInOrder[MessagesInOrder.length - 1];
  //}

  // UNLINK WATCHERS SECTION

  public UnlinkAllWatchers(): void {
    if (this.WatchersLinked) {
      this.UnlinkUserWatchers();
      this.UnlinkListsWatchers();
      this.UnlinkCandidatesWatchers();
      this.UnlinkCandidaturesWatchers();
      this.UnlinkReviewsWatchers();
      this.UnlinkUserChatsWatchers();
      this.UnlinkChatsWatchers();
      this.WatchersLinked = false;
    }
  }

  private UnlinkUserWatchers(): void {
    this.User_db.$ref.off();
    this.User_db = null;
    this.User = new FeasyUser("", "", "");
  }

  private UnlinkListsWatchers(): void {
    this.PublishedLists_db.$ref.off();
    this.UnpublishedLists_db.$ref.off();
    this.TerminatedListsAsDemander_db.$ref.off();
    this.TerminatedListsAsShopper_db.$ref.off();
    this.PublishedLists.length = 0;
    this.PublishedLists_db = null;
    this.NoPublishedLists = true;
    this.UnpublishedLists.length = 0;
    this.UnpublishedLists_db = null;
    this.NoUnpublishedLists = true;
    this.TerminatedListsAsDemander.length = 0;
    this.TerminatedListsAsDemander_db = null;
    this.NoTerminatedListsAsDemander = true;
    this.TerminatedListsAsShopper.length = 0;
    this.TerminatedListsAsShopper_db = null;
    this.NoTerminatedListsAsShopper = true;
    this.AcceptedLists.length = 0;
    this.NoAcceptedLists = true;
    this.AppliedLists.length = 0;
    this.NoAppliedLists = true;
  }

  private UnlinkCandidatesWatchers(): void {
    this.Candidates_db.$ref.off();
    this.Candidates_db = null;
    this.Candidates.length = 0;
  }

  private UnlinkCandidaturesWatchers(): void {
    this.Candidatures_db.$ref.off();
    this.Candidatures_db = null;
    this.Candidatures.length = 0;
  }

  private UnlinkReviewsWatchers(): void {
    this.Reviews_db.$ref.off();
    this.Reviews_db = null;
    this.Reviews.length = 0;
  }

  private UnlinkUserChatsWatchers(): void {
    this.UserChats_db.$ref.off();
    this.UserChats_db = null;
    this.UserChats.length = 0;
  }

  private UnlinkChatsWatchers(): void {
    for (let ref of this.chat_messages_refs) {
      ref.off();
    }
    this.chat_messages_refs.length = 0;
    this.Chats.length = 0;
  }

  // END UNLINK WATCHERS SECTION


  private CopyObj(_what: any, _where: any, key: string): void {
    if (_where[key] == undefined) {
      _where[key] = _what;
      return;
    }
    for (let newkey in _what) {
      if (_where[key][newkey] == null)
        _where[key][newkey] = _what[newkey];
      else
        this.CopyObj(_what[newkey], _where[key], newkey);
    }
  }

  public ForceAppChanges() {
    //this.applicationRef.tick();
    //this.cd.detectChanges();
    this.cd.markForCheck();
  }

  private copy_new_snapshot_list(list: firebase.database.DataSnapshot): FeasyList {
    let _list: FeasyList = new FeasyList("");
    Object.assign(_list, list.val());
    _list.$key = list.key;
    _list.Name = _list.Name || "";
    _list.Items = _list.Items || {};
    _list.DeliveryAddresses = _list.DeliveryAddresses || {};
    _list.ItemsCount = Object.keys(_list.Items).length;
    return _list;
  }

  private copy_snapshot_list(list: firebase.database.DataSnapshot, _list: FeasyList): void {
    Object.assign(_list, list.val());
    _list.$key = list.key;
    _list.Name = _list.Name || "";
    _list.Items = _list.Items || {};
    _list.DeliveryAddresses = _list.DeliveryAddresses || {};
    _list.ItemsCount = Object.keys(_list.Items).length;
  }


  //ARRAY HELPERS

  public ArrayToObj(arr: Array<any>): Object {
    let obj: Object = {};
    for (let index in arr) {
      obj[arr[index].$key || index] = arr[index];
    }
    return obj;
  }

  public ObjToArray<T>(obj: Object, copyKeys: boolean = false): Array<T> {
    let arr: Array<T> = new Array<T>();
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (copyKeys != null && copyKeys == true)
          obj[key].$key = key;
        arr.push(obj[key]);
      }
    }
    return arr;
  }

  public RecopyArray(arr: Array<any>) {
    arr = arr.slice();
  }

  public GetIndexByKey(array: Array<any>, key: string): number {
    for (let i: number = 0; i < array.length; i++) {
      if (array[i].$key == key) {
        return i;
      }
    }
    return - 1;
  }

  public DeleteFromArrayByKey(array: Array<any>, key: string): number {
    let index: number = this.GetIndexByKey(array, key);
    if (index != -1)
      array.splice(index, 1);
    return index;
  }

  public GetElementByKey(array: Array<any>, key: string): any {
    let index: number = this.GetIndexByKey(array, key);
    if (index != -1)
      return array[index];
    else
      return null;
  }

  public GetPublishedListByKey(key: string): FeasyList {
    return this.GetElementByKey(this.PublishedLists, key);
  }

  public GetUnpublishedListByKey(key: string): FeasyList {
    return this.GetElementByKey(this.UnpublishedLists, key);
  }

  public GetTerminatedListAsDemanderByKey(key: string): FeasyList {
    return this.GetElementByKey(this.TerminatedListsAsDemander, key);
  }

  public GetTerminatedListAsShopperByKey(key: string): FeasyList {
    return this.GetElementByKey(this.TerminatedListsAsShopper, key);
  }

  public GetCandidateByKey(key: string): Candidate {
    return this.GetElementByKey(this.Candidates, key);
  }

  public GetCandidatureByKey(key: string): Candidature {
    return this.GetElementByKey(this.Candidatures, key);
  }

  public GetReviewByKey(key: string): Review {
    return this.GetElementByKey(this.Reviews, key);
  }

  public GetUserChatByKey(key: string): GenericWithKey {
    return this.GetElementByKey(this.UserChats, key);
  }

  public GetChatByKey(key: string): Chat {
    return this.GetElementByKey(this.Chats, key);
  }





  public ResizeImage(imgSrc: string, maxW: number, maxH: number): Promise<string> {

    return new Promise((resolve, reject) => {
      try {

        // create an off-screen canvas
        var canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');
        var cw = canvas.width;
        var ch = canvas.height;

        var img = new Image;
        img.onload = function () {
          var iw = img.width;
          var ih = img.height;
          var scale = Math.min((maxW / iw), (maxH / ih));
          var iwScaled = iw * scale;
          var ihScaled = ih * scale;
          canvas.width = iwScaled;
          canvas.height = ihScaled;
          ctx.drawImage(img, 0, 0, iwScaled, ihScaled);
          resolve(canvas.toDataURL());
        }
        img.onerror = function () {
          reject(new Error("Invalid image"));
        }
        img.src = imgSrc;

      } catch (e) {
        let err: Error = new Error("Error resizing image: " + e);
        reject(err);
      }
    });
  }



  public InputImage(maxW: number, maxH: number): Promise<string> {

    return new Promise((resolve, reject) => {
      try {

        let alert = this.alertCtrl.create({
          title: 'Choose one',
          message: 'How do you want to choose the image?',
          buttons: [
            {
              text: 'Camera',
              handler: () => {
                console.log('Globals.InputImage> camera chosen');
                const options: CameraOptions = {
                  quality: 90,
                  targetWidth: maxW,
                  targetHeight: maxH,
                  allowEdit: true,
                  destinationType: this.camera.DestinationType.DATA_URL,
                  encodingType: this.camera.EncodingType.JPEG,
                  mediaType: this.camera.MediaType.PICTURE
                }

                this.camera.getPicture(options).then((imageData) => {
                  resolve('data:image/jpeg;base64,' + imageData);
                }, (err) => {
                  reject(err);
                });

              }
            },
            {
              text: 'Gallery',
              handler: () => {
                console.log('Globals.InputImage> gallery chosen');

                if (this.IsWeb) {

                  // Create an input element
                  var inputElement = document.createElement("input");

                  // Set its type to file
                  inputElement.type = "file";

                  // set onchange event to call callback when user has selected file
                  inputElement.addEventListener("change", (event: any) => {

                    var fReader = new FileReader();
                    fReader.readAsDataURL(inputElement.files[0]);
                    fReader.onloadend = (e: any) => {
                      this.ResizeImage(e.target.result, maxW, maxH).then(img => {
                        resolve(img);
                      }).catch((err: Error) => {
                        reject(err);
                      });
                    }
                    fReader.onerror = () => {
                      reject(new Error("Cannot read file"));
                    }
                  });

                  // dispatch a click event to open the file dialog
                  inputElement.click();
                }
                else {


                  const options: CameraOptions = {
                    quality: 90,
                    targetWidth: maxW,
                    targetHeight: maxH,
                    allowEdit: true,
                    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                    destinationType: this.camera.DestinationType.DATA_URL,
                    encodingType: this.camera.EncodingType.JPEG,
                    mediaType: this.camera.MediaType.PICTURE
                  }

                  this.camera.getPicture(options).then((imageData) => {
                    resolve('data:image/jpeg;base64,' + imageData);
                  }, (err) => {
                    reject(err);
                  });

                  //let options = {
                  //  // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
                  //  // selection of a single image, the plugin will return it.
                  //  maximumImagesCount: 1,

                  //  // max width and height to allow the images to be.  Will keep aspect
                  //  // ratio no matter what.  So if both are 800, the returned image
                  //  // will be at most 800 pixels wide and 800 pixels tall.  If the width is
                  //  // 800 and height 0 the image will be 800 pixels wide if the source
                  //  // is at least that wide.
                  //  width: maxW,
                  //  height: maxH,

                  //  // quality of resized image, defaults to 100
                  //  quality: 90,

                  //  // output type, defaults to FILE_URIs.
                  //  // available options are 
                  //  // window.imagePicker.OutputType.FILE_URI (0) or 
                  //  // window.imagePicker.OutputType.BASE64_STRING (1)
                  //  outputType: 1
                  //};

                  //this.imagePicker.getPictures(options).then((results) => {
                  //  if (results == null || results.lenght == 0 || results[0] == null || results[0] == "")
                  //    reject(new Error("No image selected"));
                  //  else
                  //    resolve('data:image/jpeg;base64,' + results[0]);
                  //}, (err) => { reject(err) });
                }

              }
            }
          ]
        });
        alert.present();

        

      } catch (err) {
        reject(new Error(JSON.stringify(err)));
        //      observer.throw(new Error("Cannot load image: " + JSON.stringify(err)));
        //observer.complete();
      }

    });

  }
  
  public toHHMM(_date): string {
    let date: Date = new Date(_date);
    let hh: string = date.getHours().toString();
    let mm: string = date.getMinutes().toString();
    //let ss: string = date.getSeconds().toString();
    if (date.getHours() < 10) { hh = "0" + hh; }
    if (date.getMinutes() < 10) { mm = "0" + mm; }
    //if (date.getSeconds() < 10) { ss = "0" + ss; }
    return hh + ":" + mm;
  }

  public ViewBigImage(image: string, nav: NavController, title: string = "View Image"): void {
    if (this.IsWeb) {
      nav.push(ViewBigPicture, { image_content: image });
    }
    else {
      this.photoViewer.show(image, title, { share: true });
    }
  }

  public GetUser(userId: string): Promise<FeasyUser> {
    return new Promise<FeasyUser>((resolve, reject) => {
      //this.storage.get("user:" + userId).then((user) => {
      if (this.UsersCache[userId] != null)
        resolve(this.UsersCache[userId]);
      else {
        this.af.object("/users/" + userId).$ref.once("value", (_user: firebase.database.DataSnapshot) => {
          let user: FeasyUser = _user.val();
          if (user != null) {
            //user.PhotoURL = user.PhotoURL || (user.Gender == GenderType.Male ? UnknownMan : UnknownWoman);
            this.UsersCache[userId] = user;
            //this.storage.set(userId, user).then(() => {
            resolve(user);
            //});
          } else {
            reject(new Error("Null User"));
          }
        }).catch((err: Error) => {
          reject(err);
        });
      }
      //}).catch((err: Error) => {
      //  reject(err);
      //});
    });
  }

  public GetUserPicBig(userId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      //this.storage.get("user:" + userId).then((user) => {
      if (this.UsersPicBigCache[userId] != null)
        resolve(this.UsersPicBigCache[userId]);
      else {
        this.af.object("/pics/" + userId + "/Big").$ref.once("value", (_pic: firebase.database.DataSnapshot) => {
          let pic: string = _pic.val();
          if (pic != null) {
            //user.PhotoURL = user.PhotoURL || (user.Gender == GenderType.Male ? UnknownMan : UnknownWoman);
            this.UsersPicBigCache[userId] = pic;
            //this.storage.set(userId, user).then(() => {
            resolve(pic);
            //});
          } else {
            reject(new Error("Null User"));
          }
        }).catch((err: Error) => {
          reject(err);
        });
      }
      //}).catch((err: Error) => {
      //  reject(err);
      //});
    });
  }


  public ShowLoading(text: string = "Please wait...") {
    try {
      this.loading = this.loadingCtrl.create({
        spinner: 'dots',
        content: text
      });
      this.loading.present();
    } catch (e) {
      console.warn("Globals.ShowLoading> error: " + JSON.stringify(e));
    }
  }

  public DismissLoading() {
    try {
      this.loading.dismiss();
    } catch (e) {
      console.warn("Globals.DismissLoading> error: " + JSON.stringify(e));
    }
  }

}