
import { Injectable, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController, Alert, LoadingController, Loading, Platform } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ImagePicker } from '@ionic-native/image-picker';
import { Observable } from 'rxjs/Observable';

import { PublicatedListCandidatesPage } from '../pages/14_publicated_list_candidates/14_publicated_list_candidates';
import { PublicatedListWithShopperPovShopperPage } from '../pages/11B_publicated_list_with_shopper_pov_shopper/11B_publicated_list_with_shopper_pov_shopper';
import { MaintenancePage } from '../pages/99_maintenance/99_maintenance';


import { Config, FeasyUser, FeasyList, Candidate, Candidature, Review, GenderType, StripForFirebase, Chat, Message, GenericWithKey, UnknownMan, UnknownWoman} from './Feasy';


@Injectable()
export class Globals {

  public config: Config = new Config();
  private config_db: FirebaseObjectObservable<any>;
  public root: any;

  public UID: string = "";
  public _user: firebase.User;
  public IsWeb: boolean = true;

  public WatchersLinked: boolean = false;

  public User: FeasyUser = new FeasyUser("", "", "");
  public User_db: FirebaseObjectObservable<any>;

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

  public UserChats: Array<GenericWithKey> = new Array<GenericWithKey>();
  public UserChats_db: FirebaseListObservable<any>;

  public Chats: Array<Chat> = new Array<Chat>();
  public Chats_db: FirebaseListObservable<any>;
  
  public JustRegistered: boolean = false;
  public NotificationCounter: number = 0;

  public af: AngularFireDatabase;
  public afAuth: AngularFireAuth;
  public navCtrl: NavController;
  public alertCtrl: AlertController;
  public loadingCtrl: LoadingController;
  public http: Http;
  public localNotifications: LocalNotifications;
  public imagePicker: ImagePicker;

  constructor(platform: Platform, public applicationRef: ApplicationRef, public cd: ChangeDetectorRef) {
    this.IsWeb = platform.is("core");
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

  public updateUser(): void {
    if (this.User_db != null)
      this.User_db.update(StripForFirebase(this.User)).then(() => {
        console.log("Globals.updateUser> User data updated");
      }).catch((err: Error) => {
        console.warn("Globals.updateUser> Cannot update user data: " + err.message);
      });
  }

  public LinkAllWatchers(): void {
    if (!this.WatchersLinked) {
      this.LinkUserWatchers();
      this.LinkListsWatchers();
      this.LinkCandidatesWatchers();
      this.LinkCandidaturesWatchers();
      this.LinkReviewsWatchers();
      this.LinkUserChatsWatchers();
      this.LinkChatsWatchers();
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
        console.log("User data null");
      }
    });
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
    });

    this.TerminatedListsAsDemander_db.$ref.on("child_changed", (list: firebase.database.DataSnapshot) => {
      let i: number = this.GetIndexByKey(this.TerminatedListsAsDemander, list.key);
      if (i != -1)
        this.copy_snapshot_list(list, this.TerminatedListsAsDemander[i]);
      else
        console.warn("Globals.LinkListsWatchers> Cannot find index for key <" + list.key + "> in TerminatedLists_db:child_changed");
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      this.RecopyArray(this.TerminatedListsAsDemander);
    });

    this.TerminatedListsAsDemander_db.$ref.on("child_removed", (list: firebase.database.DataSnapshot) => {
      this.DeleteFromArrayByKey(this.TerminatedListsAsDemander, list.key);
      this.NoTerminatedListsAsDemander = this.TerminatedListsAsDemander.length == 0;
      //delete this.UnpublishedLists[list.key];
      //this.NoUnpublishedLists = Object.keys(this.UnpublishedLists).length == 0;
      this.RecopyArray(this.TerminatedListsAsDemander);
    });


    // TERMINATED LISTS AS SHOPPER WATCHERS

    this.TerminatedListsAsShopper_db = this.af.list('/terminated_lists/' + this.UID + '/as_shopper');
    this.TerminatedListsAsShopper_db.$ref.on("child_added", (list: firebase.database.DataSnapshot) => {
      this.TerminatedListsAsShopper.push(this.copy_new_snapshot_list(list));
      this.NoTerminatedListsAsShopper = this.TerminatedListsAsShopper.length == 0;
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      //this.NoPublishedLists = Object.keys(this.PublishedLists).length == 0;
      this.RecopyArray(this.TerminatedListsAsShopper);
    });

    this.TerminatedListsAsShopper_db.$ref.on("child_changed", (list: firebase.database.DataSnapshot) => {
      let i: number = this.GetIndexByKey(this.TerminatedListsAsShopper, list.key);
      if (i != -1)
        this.copy_snapshot_list(list, this.TerminatedListsAsShopper[i]);
      else
        console.warn("Globals.LinkListsWatchers> Cannot find index for key <" + list.key + "> in TerminatedLists_db:child_changed");
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      this.RecopyArray(this.TerminatedListsAsShopper);
    });

    this.TerminatedListsAsShopper_db.$ref.on("child_removed", (list: firebase.database.DataSnapshot) => {
      this.DeleteFromArrayByKey(this.TerminatedListsAsShopper, list.key);
      this.NoTerminatedListsAsShopper = this.TerminatedListsAsShopper.length == 0;
      //delete this.UnpublishedLists[list.key];
      //this.NoUnpublishedLists = Object.keys(this.UnpublishedLists).length == 0;
      this.RecopyArray(this.TerminatedListsAsShopper);
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
            // Schedule a single notification
            this.localNotifications.schedule({
              id: this.NotificationCounter++,
              title: "Sei stato accettato!",
              text: "Clicca per vedere i dettagli",
              icon: 'res://icon'
            });
            this.localNotifications.on("click", (notification) => {
              this.navCtrl.push(PublicatedListWithShopperPovShopperPage, { list_owner: candidature.ListOwnerUid, list_key: candidature.ListReferenceKey, candidature_key: _candidature.key, candidature: candidature });
              this.localNotifications.clearAll();
              console.log(JSON.stringify(notification));  
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
              data: { list_owner: this.UID, list_key: candidate.ListReferenceKey },
              icon: 'res://icon',
              at: new Date(new Date().getTime() + 10)
            });
            this.localNotifications.on("click", (notification) => {
              this.localNotifications.clearAll();
              this.navCtrl.push(PublicatedListCandidatesPage, { list_key: candidate.ListReferenceKey });
              console.log(JSON.stringify(notification));
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
        this.ForceAppChanges();
      });

      this.UserChats_db.$ref.on("child_added", (_chat: firebase.database.DataSnapshot) => {     
        let chat: GenericWithKey = new GenericWithKey();
        chat.$key = _chat.key;
        if (chat != null)
          this.UserChats.push(chat);
        this.ForceAppChanges();
      });

    } catch(e) {
      console.log("Globals.LinkUserChatsWatchers catch err: " + JSON.stringify(e));
    }
  }

  private LinkChatsWatchers(): void {
    
    // this.Chats_db = this.af.list("/chats");
    // this.Chats_db.$ref.on("value", (_chat: firebase.database.DataSnapshot) => {
    //   let chat: Chat = _chat.val();
    //   this.Chats[_chat.key] = chat;
    // });
    
    try {
      this.Chats_db = this.af.list("/chats");
      this.Chats_db.$ref.on("child_removed", (removed_chat: firebase.database.DataSnapshot) => {
        this.DeleteFromArrayByKey(this.Chats, removed_chat.key);
        this.ForceAppChanges();
      });

      this.Chats_db.$ref.on("child_added", (_chat: firebase.database.DataSnapshot) => {
        let chat: Chat = _chat.val();
        chat.$key = _chat.key;
        if (chat.DemanderUid == this.UID || chat.ShopperUid == this.UID) {
          if (chat != null) {
            chat.Messages = chat.Messages || {};
            this.Chats.push(chat);
          }
          this.af.object("/users/" + (chat.DemanderUid == this.UID ? chat.ShopperUid : chat.DemanderUid)).$ref.once("value", (_user: firebase.database.DataSnapshot) => {
            let user: FeasyUser = _user.val();
            if (user != null)
              (this.GetChatByKey(_chat.key) as any).PhotoURL = user.PhotoURL || (user.Gender == GenderType.Male ? UnknownMan : UnknownWoman);
          });
          this.SortMessageArrayByDate(_chat.key);
          this.ForceAppChanges();
        }
      });

      this.Chats_db.$ref.on("child_changed", (_chat: firebase.database.DataSnapshot) => {
        let chat: Chat = _chat.val();
        if (chat.DemanderUid == this.UID || chat.ShopperUid == this.UID) {
          let i: number = this.GetIndexByKey(this.Chats, _chat.key);
          if (i != -1)
            Object.assign(this.Chats[i], chat);
          else
            console.warn("Globals.LinkReviewsWatchers> Cannot find index for key <" + _chat.key + "> in child_changed");
          this.SortMessageArrayByDate(_chat.key);
          this.ForceAppChanges();
        }
      });

    } catch (e) {
      console.log("Globals.LinkChatsWatchers catch err: " + JSON.stringify(e));
    }
  }  

  private SortMessageArrayByDate(_chat_key: string): void {
    let _chat: Chat = this.GetChatByKey(_chat_key);
    let _keys: Array<string> = Object.keys(_chat.Messages);
    let MessagesInOrder: Array<Message> = new Array<Message>();
    for (let i = 0; i < _keys.length; i++) {
      _chat.Messages[_keys[i]].Date = new Date(_chat.Messages[_keys[i]].Date);
      if (i == 0) {
        MessagesInOrder.push(_chat.Messages[_keys[i]]);
      } else {
        for (let j = 0; j < MessagesInOrder.length; j++) {
          if (_chat.Messages[_keys[i]].Date > MessagesInOrder[j].Date) {
            MessagesInOrder.splice((_keys.length - j), 0, _chat.Messages[_keys[i]]);
            break;
          }
        }
      }
    }
    _chat.MessagesInOrder = MessagesInOrder;
    _chat.LastMessage = MessagesInOrder[MessagesInOrder.length - 1];
  }

  // UNLINK WATCHERS SECTION

  public UnlinkAllWatchers(): void {
    if (this.WatchersLinked) {
      this.UnlinkUserWatchers();
      this.UnlinkListsWatchers();
      this.UnlinkCandidatesWatchers();
      this.UnlinkCandidaturesWatchers();
      this.UnlinkReviewsWatchers();
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
    this.PublishedLists = [];
    this.PublishedLists_db = null;
    this.NoPublishedLists = true;
    this.UnpublishedLists = [];
    this.UnpublishedLists_db = null;
    this.NoUnpublishedLists = true;
    this.TerminatedListsAsDemander = [];
    this.TerminatedListsAsDemander_db = null;
    this.NoTerminatedListsAsDemander = true;
    this.TerminatedListsAsShopper = [];
    this.TerminatedListsAsShopper_db = null;
    this.NoTerminatedListsAsShopper = true;
    this.AcceptedLists = [];
    this.NoAcceptedLists = true;
    this.AppliedLists = [];
    this.NoAppliedLists = true;

  }

  private UnlinkCandidatesWatchers(): void {
    this.Candidates_db.$ref.off();
    this.Candidates_db = null;
    this.Candidates = [];
  }

  private UnlinkCandidaturesWatchers(): void {
    this.Candidatures_db.$ref.off();
    this.Candidatures_db = null;
    this.Candidatures = [];
  }

  private UnlinkReviewsWatchers(): void {
    this.Reviews_db.$ref.off();
    this.Reviews_db = null;
    this.Reviews = [];
  }

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

  public RecopyArray(arr: Array<any>) {
    arr = arr.slice();
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





  public ResizeImage(imgSrc: string): Promise<string> {

    return new Promise((resolve, reject) => {
      try {

        // create an off-screen canvas
        var canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');
        var cw = canvas.width;
        var ch = canvas.height;

        // limit the image size
        var maxW = 500;
        var maxH = 500;

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



  public InputImage(): Promise<string> {

    return new Promise((resolve, reject) => {
      try {

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
              this.ResizeImage(e.target.result).then(img => {
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
          let options = {
            // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
            // selection of a single image, the plugin will return it.
            maximumImagesCount: 1,

            // max width and height to allow the images to be.  Will keep aspect
            // ratio no matter what.  So if both are 800, the returned image
            // will be at most 800 pixels wide and 800 pixels tall.  If the width is
            // 800 and height 0 the image will be 800 pixels wide if the source
            // is at least that wide.
            width: 100,
            height: 100,

            // quality of resized image, defaults to 100
            quality: 90,

            // output type, defaults to FILE_URIs.
            // available options are 
            // window.imagePicker.OutputType.FILE_URI (0) or 
            // window.imagePicker.OutputType.BASE64_STRING (1)
            outputType: 1
          };

          this.imagePicker.getPictures(options).then((results) => {
            if (results == null || results.lenght == 0 || results[0] == null || results[0] == "")
              reject(new Error("No image selected"));
            else
              resolve('data:image/jpeg;base64,' + results[0]);
          }, (err) => { reject(err)});
        }

      } catch (err) {
        reject(new Error(JSON.stringify(err)));
        //      observer.throw(new Error("Cannot load image: " + JSON.stringify(err)));
        //observer.complete();
      }
    });
  }

}