
import { PublicatedListCandidatesPage } from '../pages/14_publicated_list_candidates/14_publicated_list_candidates';
import { PublicatedListWithShopperPovShopperPage } from '../pages/11B_publicated_list_with_shopper_pov_shopper/11B_publicated_list_with_shopper_pov_shopper';
import { MaintenancePage } from '../pages/99_maintenance/99_maintenance';

import { Injectable, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController, Alert, LoadingController, Loading, Platform } from 'ionic-angular';
import { AngularFire, AuthProviders, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { LocalNotifications } from 'ionic-native';

import { Config, FeasyUser, FeasyList, Candidate, Candidature, Review, StripForFirebase } from './Feasy';

@Injectable()
export class Globals {

  public config: Config = new Config();
  private config_db: FirebaseObjectObservable<any>;
  public root: any;

  public UID: string = "";
  public IsWeb: boolean = true;

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

  public JustRegistered: boolean = false;

  public af: AngularFire;
  public navCtrl: NavController;
  public alertCtrl: AlertController;
  public loadingCtrl: LoadingController;
  public http: Http;

  constructor(platform: Platform, public applicationRef: ApplicationRef, public cd: ChangeDetectorRef) {
    this.IsWeb = platform.is("core");
  }


  public StartConfigWatcher() {
    this.config_db = this.af.database.object("/config");
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

  public LinkAllWatchers(): void {
    this.LinkUserWatchers();
    this.LinkListsWatchers();
    this.LinkCandidatesWatchers();
    this.LinkCandidaturesWatchers();
    this.LinkReviewsWatchers();
  }


  //LINK WATCHERS SECTION

  private LinkUserWatchers(): void {
    this.User_db = this.af.database.object('/users/' + this.UID);
    this.User_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      let _user = snapshot.val();
      if (_user != null) {
        console.log("User data fetched. Name: " + this.User.DisplayName);
        this.User = _user;
      } else {
        console.log("User data null");
      }
    });
  }

  private LinkListsWatchers(): void {
    
    // PUBLISHED LISTS WATCHERS

    this.PublishedLists_db = this.af.database.list('/published_lists/' + this.UID);
    this.PublishedLists_db.$ref.on("child_added", (list: firebase.database.DataSnapshot) => {
      this.PublishedLists.push(this.copy_new_snapshot_list(list));
      this.NoPublishedLists = this.PublishedLists.length == 0;
      //this.PublishedLists[list.key] = this.copy_snapshot_list(list);
      //this.NoPublishedLists = Object.keys(this.PublishedLists).length == 0;
      this.ForceAppChanges();
    });

    this.PublishedLists_db.$ref.on("child_changed", (list: firebase.database.DataSnapshot) => {
      let i: number = this.GetIndexByKey(this.PublishedLists, list.key);
      if (i != -1)
        this.copy_snapshot_list(list, this.PublishedLists[i]);
      else
        console.warn("Globals.LinkListsWatchers> Cannot find index for key <" + list.key + "> in PublishedLists:child_changed");
      //this.PublishedLists[list.key] = this.copy_snapshot_list(list);
      this.ForceAppChanges();
    });

    this.PublishedLists_db.$ref.on("child_removed", (list: firebase.database.DataSnapshot) => {
      this.DeleteFromArrayByKey(this.PublishedLists, list.key);
      this.NoPublishedLists = this.PublishedLists.length == 0;
      //delete this.PublishedLists[list.key];
      //this.NoPublishedLists = Object.keys(this.PublishedLists).length == 0;
      this.ForceAppChanges();
    });


    // UNPUBLISHED LISTS WATCHERS

    this.UnpublishedLists_db = this.af.database.list('/unpublished_lists/' + this.UID);
    this.UnpublishedLists_db.$ref.on("child_added", (list: firebase.database.DataSnapshot) => {
      this.UnpublishedLists.push(this.copy_new_snapshot_list(list));
      this.NoUnpublishedLists = this.UnpublishedLists.length == 0;
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      //this.NoPublishedLists = Object.keys(this.PublishedLists).length == 0;
      this.ForceAppChanges();
    });

    this.UnpublishedLists_db.$ref.on("child_changed", (list: firebase.database.DataSnapshot) => {
      let i: number = this.GetIndexByKey(this.UnpublishedLists, list.key);
      if (i != -1)
        this.copy_snapshot_list(list, this.UnpublishedLists[i]);
      else
        console.warn("Globals.LinkListsWatchers> Cannot find index for key <" + list.key + "> in UnpublishedLists_db:child_changed");
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      this.ForceAppChanges();
    });

    this.UnpublishedLists_db.$ref.on("child_removed", (list: firebase.database.DataSnapshot) => {
      this.DeleteFromArrayByKey(this.UnpublishedLists, list.key);
      this.NoUnpublishedLists = this.UnpublishedLists.length == 0;
      //delete this.UnpublishedLists[list.key];
      //this.NoUnpublishedLists = Object.keys(this.UnpublishedLists).length == 0;
      this.ForceAppChanges();
    });


    // TERMINATED LISTS AS DEMANDER WATCHERS

    this.TerminatedListsAsDemander_db = this.af.database.list('/terminated_lists/' + this.UID + '/as_demander');
    this.TerminatedListsAsDemander_db.$ref.on("child_added", (list: firebase.database.DataSnapshot) => {
      this.TerminatedListsAsDemander.push(this.copy_new_snapshot_list(list));
      this.NoTerminatedListsAsDemander = this.TerminatedListsAsDemander.length == 0;
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      //this.NoPublishedLists = Object.keys(this.PublishedLists).length == 0;
      this.ForceAppChanges();
    });

    this.TerminatedListsAsDemander_db.$ref.on("child_changed", (list: firebase.database.DataSnapshot) => {
      let i: number = this.GetIndexByKey(this.TerminatedListsAsDemander, list.key);
      if (i != -1)
        this.copy_snapshot_list(list, this.TerminatedListsAsDemander[i]);
      else
        console.warn("Globals.LinkListsWatchers> Cannot find index for key <" + list.key + "> in TerminatedLists_db:child_changed");
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      this.ForceAppChanges();
    });

    this.TerminatedListsAsDemander_db.$ref.on("child_removed", (list: firebase.database.DataSnapshot) => {
      this.DeleteFromArrayByKey(this.TerminatedListsAsDemander, list.key);
      this.NoTerminatedListsAsDemander = this.TerminatedListsAsDemander.length == 0;
      //delete this.UnpublishedLists[list.key];
      //this.NoUnpublishedLists = Object.keys(this.UnpublishedLists).length == 0;
      this.ForceAppChanges();
    });


    // TERMINATED LISTS AS SHOPPER WATCHERS

    this.TerminatedListsAsShopper_db = this.af.database.list('/terminated_lists/' + this.UID + '/as_shopper');
    this.TerminatedListsAsShopper_db.$ref.on("child_added", (list: firebase.database.DataSnapshot) => {
      this.TerminatedListsAsShopper.push(this.copy_new_snapshot_list(list));
      this.NoTerminatedListsAsShopper = this.TerminatedListsAsShopper.length == 0;
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      //this.NoPublishedLists = Object.keys(this.PublishedLists).length == 0;
      this.ForceAppChanges();
    });

    this.TerminatedListsAsShopper_db.$ref.on("child_changed", (list: firebase.database.DataSnapshot) => {
      let i: number = this.GetIndexByKey(this.TerminatedListsAsShopper, list.key);
      if (i != -1)
        this.copy_snapshot_list(list, this.TerminatedListsAsShopper[i]);
      else
        console.warn("Globals.LinkListsWatchers> Cannot find index for key <" + list.key + "> in TerminatedLists_db:child_changed");
      //this.UnpublishedLists[list.key] = this.copy_snapshot_list(list);
      this.ForceAppChanges();
    });

    this.TerminatedListsAsShopper_db.$ref.on("child_removed", (list: firebase.database.DataSnapshot) => {
      this.DeleteFromArrayByKey(this.TerminatedListsAsShopper, list.key);
      this.NoTerminatedListsAsShopper = this.TerminatedListsAsShopper.length == 0;
      //delete this.UnpublishedLists[list.key];
      //this.NoUnpublishedLists = Object.keys(this.UnpublishedLists).length == 0;
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
      
      this.Candidatures_db = this.af.database.list('/candidatures/' + this.UID);
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
        this.ForceAppChanges();
      });

      this.Candidatures_db.$ref.on("child_added", (_candidature: firebase.database.DataSnapshot) => {
        console.log("Globals.LinkCandidaturesWatchers > user has candidated to new list!");
        let candidature: Candidature = _candidature.val();
        candidature.$key = _candidature.key;
        this.Candidatures.push(candidature);
        this.af.database.object("/published_lists/" + candidature.ListOwnerUid + "/" + candidature.ListReferenceKey).$ref.once("value", (_list: firebase.database.DataSnapshot) => {
          let list: FeasyList = this.copy_new_snapshot_list(_list);
          (list as any).Candidature = candidature;
          (list as any).ChosenAddress = list.DeliveryAddresses[candidature.AddressKey];
          if (list != null && list.ChosenShopperUid == this.UID)
            this.AcceptedLists.push(list);
          else
            this.AppliedLists.push(list);
          this.updateBooleansAcceptedAndApplied();
        });
        this.ForceAppChanges();
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
            LocalNotifications.schedule({
              id: 1,
              title: "Sei stato accettato!",
              text: "Clicca per vedere i dettagli",
              icon: 'res://icon'
            });
            LocalNotifications.on("click", (notification) => {
              this.navCtrl.push(PublicatedListWithShopperPovShopperPage, { list_owner: candidature.ListOwnerUid, list_key: candidature.ListReferenceKey, candidature_key: _candidature.key, candidature: candidature });
            });
          }
        }
        this.ForceAppChanges();
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
      this.Candidates_db = this.af.database.list("/candidates/" + this.UID);
      //this.candidates_refs.push(this.Candidates_db.$ref.ref);

      this.Candidates_db.$ref.on("child_removed", (removed_list: firebase.database.DataSnapshot) => {
        this.DeleteFromArrayByKey(this.Candidates, removed_list.key);
        this.ForceAppChanges();
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
              LocalNotifications.schedule({
                id: 1,
                title: 'Nuovo candidato!',
                text: "Clicca per vedere i dettagli",
                data: { list_owner: this.UID, list_key: candidate.ListReferenceKey },
                icon: 'res://icon'
              });
              LocalNotifications.on("click", (notification) => {
                this.navCtrl.push(PublicatedListCandidatesPage, { list_key: candidate.ListReferenceKey });
              });
            }
        }
        this.ForceAppChanges();
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

        this.ForceAppChanges();
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
      this.Reviews_db = this.af.database.list('/reviews/' + this.UID + '/done');

      this.Reviews_db.$ref.on("child_removed", (removed_review: firebase.database.DataSnapshot) => {
        this.DeleteFromArrayByKey(this.Reviews, removed_review.key);
        this.ForceAppChanges();
      });

      this.Reviews_db.$ref.on("child_added", (_review: firebase.database.DataSnapshot) => {
        let review: Review = _review.val();
        if (review != null)
          this.Reviews.push(review);
        this.ForceAppChanges();
      });

      this.Reviews_db.$ref.on("child_changed", (_review: firebase.database.DataSnapshot) => {
        let review: Review = _review.val();
        let i: number = this.GetIndexByKey(this.Reviews, _review.key);
        if (i != -1)
          Object.assign(this.Reviews[i], review);
        else
          console.warn("Globals.LinkReviewsWatchers> Cannot find index for key <" + _review.key + "> in child_changed");

        this.ForceAppChanges();
      });

    } catch (e) {
      console.log("Globals.LinkReviewsWatchers catch err: " + JSON.stringify(e));
    }
  
  }

  // UNLINK WATCHERS SECTION

  public UnlinkAllWatchers(): void {
    this.UnlinkUserWatchers();
    this.UnlinkListsWatchers();
    this.UnlinkCandidatesWatchers();
    this.UnlinkCandidaturesWatchers();
    this.UnlinkReviewsWatchers();
  }

  private UnlinkUserWatchers(): void {
    this.User_db.$ref.off();
  }

  private UnlinkListsWatchers(): void {
    this.PublishedLists_db.$ref.off();
    this.UnpublishedLists_db.$ref.off();
    this.TerminatedListsAsDemander_db.$ref.off();
    this.TerminatedListsAsShopper_db.$ref.off();
  }

  private UnlinkCandidatesWatchers(): void {
    this.Candidates_db.$ref.off();
  }

  private UnlinkCandidaturesWatchers(): void {
    this.Candidatures_db.$ref.off();
  }

  private UnlinkReviewsWatchers(): void {
    this.Reviews_db.$ref.off();
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
    this.cd.detectChanges();
    //this.cd.markForCheck();
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

}