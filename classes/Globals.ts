
import { PublicatedListCandidatesPage } from '../pages/14_publicated_list_candidates/14_publicated_list_candidates';
import { PublicatedListWithShopperPovShopperPage } from '../pages/11B_publicated_list_with_shopper_pov_shopper/11B_publicated_list_with_shopper_pov_shopper';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController, Alert, LoadingController, Loading, Platform } from 'ionic-angular';
import { AngularFire, AuthProviders, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { LocalNotifications } from 'ionic-native';

import { FeasyUser, FeasyList, Candidate, Candidature, StripForFirebase } from './Feasy';

@Injectable()
export class Globals {

  public UID: string = "";
  public IsWeb: boolean = true;

  public User: FeasyUser = new FeasyUser("", "", "");
  public User_db: FirebaseListObservable<any>;

  public PublishedLists: Object = {};
  public PublishedLists_db: FirebaseListObservable<any>;
  public NoPublishedLists: boolean = true;

  public UnpublishedLists: Object = {};
  public UnpublishedLists_db: FirebaseListObservable<any>;
  public NoUnpublishedLists: boolean = true;


  public Candidates: Object = {};
  public Candidates_db: FirebaseListObservable<any>;
  public candidates_refs: Array<firebase.database.Reference> = new Array();

  public Candidatures: Object = {};
  public Candidatures_db: FirebaseListObservable<any>;
  public candidatures_refs: Array<firebase.database.Reference> = new Array();

  public JustRegistered: boolean = false;

  public af: AngularFire;
  public navCtrl: NavController;
  public alertCtrl: AlertController;
  public loadingCtrl: LoadingController;
  public http: Http;

  constructor(platform: Platform) {
    this.IsWeb = platform.is("core");
  }


  public LinkAllWatchers(): void {
    this.LinkUserWatchers();
    this.LinkListsWatchers();
    this.LinkCandidatesWatchers();
    this.LinkCandidaturesWatchers();
  }


  //LINK WATCHERS SECTION

  private LinkUserWatchers(): void {
    this.User_db = this.af.database.list('/users/' + this.UID);
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

    //let loading: Loading = this.loadingCtrl.create({
    //  spinner: 'dots',
    //  content: 'Please wait...'
    //});
    //loading.present();

    this.PublishedLists_db = this.af.database.list('/published_lists/' + this.UID);
    this.PublishedLists_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.PublishedLists = {};
      //let old_keys: string[] = Object.keys(this.PublishedLists);
      snapshot.forEach(list => {
        let _list: FeasyList = new FeasyList("");
        Object.assign(_list, list.val());
        _list.$key = list.key;
        _list.Items = _list.Items || {};
        _list.DeliveryAddresses = _list.DeliveryAddresses || {};
        _list.ItemsCount = list.hasChild("Items") ? list.child("Items").numChildren() : 0;
        this.PublishedLists[list.key] = _list;
        //this.CopyObj(_list, this.PublishedLists, list.key);
        //let index: number = old_keys.indexOf(list.key);
        //if (index != -1)
        //  old_keys.splice(index, 1);
        return false;
      });
      //for (let key in old_keys)
      //  delete this.PublishedLists[key];
      this.NoPublishedLists = !snapshot.hasChildren();
      //loading.dismiss();
    });


    //let loading2: Loading = this.loadingCtrl.create({
    //  spinner: 'dots',
    //  content: 'Please wait...'
    //});
    //loading2.present();

    this.UnpublishedLists_db = this.af.database.list('/unpublished_lists/' + this.UID);
    this.UnpublishedLists_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.UnpublishedLists = {};
      //let old_keys: string[] = Object.keys(this.UnpublishedLists);
      snapshot.forEach(list => {
        let _list: FeasyList = new FeasyList("");
        Object.assign(_list, list.val());
        _list.$key = list.key;
        _list.Items = _list.Items || {};
        _list.DeliveryAddresses = _list.DeliveryAddresses || {};
        _list.ItemsCount = list.hasChild("Items") ? list.child("Items").numChildren() : 0;
        this.UnpublishedLists[list.key] = _list;
        //this.CopyObj(_list, this.UnpublishedLists, list.key);
        //let index: number = old_keys.indexOf(list.key);
        //if (index != -1)
        //  old_keys.splice(index, 1);
        return false;
      });
      //for (let key in old_keys)
      //  delete this.UnpublishedLists[key];
      this.NoUnpublishedLists = !snapshot.hasChildren();
      //loading2.dismiss();
    });
  }

  private LinkCandidaturesWatchers(): void {

    try {
      this.Candidatures_db = this.af.database.list("/candidatures/" + this.UID);
      this.candidatures_refs.push(this.Candidatures_db.$ref.ref);

      this.Candidatures_db.$ref.on("child_removed", (removed_cand: firebase.database.DataSnapshot) => {
        delete this.Candidatures[removed_cand.key];
        for (let ref_index = 0; ref_index < this.candidatures_refs.length; ref_index++) {
          if (this.candidatures_refs[ref_index].key == removed_cand.key) {
            this.candidatures_refs[ref_index].off();
            this.candidatures_refs.splice(ref_index, 1);
            break;
          }
        }
      });

      this.Candidatures_db.$ref.on("child_added", (_candidature: firebase.database.DataSnapshot) => {
        console.log("Globals.LinkCandidaturesWatchers > user has candidated to new list!");
        let candidature: Candidature = _candidature.val();
        this.Candidatures[_candidature.key] = candidature;
        let ref_cand_accepted: FirebaseObjectObservable<any> = this.af.database.object("/published_lists/" + candidature.ListOwnerUid + "/" + candidature.ListReferenceKey + "/ChosenCandidateKey");
        this.candidates_refs.push(ref_cand_accepted.$ref.ref);
        ref_cand_accepted.$ref.on("value", (accepted: firebase.database.DataSnapshot) => {
          let _cand_key: any = accepted.val();
          if (_cand_key != null && _cand_key == candidature.CandidateReferenceKey) {
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
        });
      });
    } catch (e) {
      console.log("Globals.LinkCandidaturesWatchers catch err: " + JSON.stringify(e));
    }
  }

  public IsAlreadyCandidate(list_key: string): boolean {
    for (let candidature_key in this.Candidatures)
      if ((<Candidature>this.Candidatures[candidature_key]).ListReferenceKey == list_key)
        return true;
    return false;
  }

  public AddCandidature(candidate: Candidate, candidature: Candidature): Promise<boolean> {
    console.log("Globals.AddCandidature > adding candidature to list " + candidature.ListReferenceKey);

    return new Promise((resolve, reject) => {
      if (this.IsAlreadyCandidate(candidature.ListReferenceKey)) {
        reject(new Error("already_candidated"));
      } else {
        let cand_db_promise = this.af.database.list("/candidates/" + candidature.ListOwnerUid + "/" + candidature.ListReferenceKey).push(StripForFirebase(candidate));
        cand_db_promise.then((cand_db) => {
          candidature.CandidateReferenceKey = cand_db_promise.key;
          this.Candidatures_db.push(candidature).then(() => {
            console.log("Globals.AddCandidature > new candidature pushed");
            resolve(true);
          }).catch((err: Error) => {
            reject(new Error("cannot add candidature to db: " + err.message));
          });
        }).catch((err: Error) => {
          reject(new Error("cannot add candidate to db: " + err.message));
        });
      }
    });
  }

  private LinkCandidatesWatchers(): void {
    try {
      this.Candidates_db = this.af.database.list("/candidates/" + this.UID);
      this.candidates_refs.push(this.Candidates_db.$ref.ref);

      this.Candidates_db.$ref.on("child_removed", (removed_list: firebase.database.DataSnapshot) => {
        delete this.Candidates[removed_list.key];
        for (let ref_index = 0; ref_index < this.candidates_refs.length; ref_index++) {
          if (this.candidates_refs[ref_index].key == removed_list.key) {
            this.candidates_refs[ref_index].off();
            this.candidates_refs.splice(ref_index, 1);
            break;
          }
        }
      });

      this.Candidates_db.$ref.on("child_added", (list: firebase.database.DataSnapshot) => {
        let ref_cand: FirebaseListObservable<any> = this.af.database.list("/candidates/" + this.UID + "/" + list.key);
        this.candidates_refs.push(ref_cand.$ref.ref);
        ref_cand.$ref.on("value", (candidates: firebase.database.DataSnapshot) => {
          let candidates_data = candidates.val();
          this.Candidates[list.key] = candidates_data;
          let new_candidates_number: number = 0;
          for (let candidate in candidates_data) {
            if (candidates_data[candidate] != null && !candidates_data[candidate].Visualised) {
              new_candidates_number++;
            }
          }
          if (new_candidates_number > 0) {
            if (this.IsWeb) {
              let alert: Alert = this.alertCtrl.create({
                title: new_candidates_number == 1 ? 'Nuovo candidato!' : "Nuovi candidati!",
                subTitle: "Vuoi vedere i dettagli?",
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel'
                  },
                  {
                    text: 'Ok',
                    handler: () => {
                      this.navCtrl.push(PublicatedListCandidatesPage, { list_key: list.key });
                    }
                  }]
              });
              alert.present();
            } else {
              // Schedule a single notification
              LocalNotifications.schedule({
                id: 1,
                title: new_candidates_number == 1 ? 'Nuovo candidato!' : "Nuovi candidati!",
                text: "Clicca per vedere i dettagli",
                data: { list_owner: this.UID, list_key: list.key },
                icon: 'res://icon'
              });
              LocalNotifications.on("click", (notification) => {
                this.navCtrl.push(PublicatedListCandidatesPage, { list_key: list.key });
              });
            }
          }
        });
      });

    } catch (e) {
      console.log("Globals.LinkCandidatesWatchers catch err: " + JSON.stringify(e));
    }
  }

  // UNLINK WATCHERS SECTION

  public UnlinkAllWatchers(): void {
    this.UnlinkUserWatchers();
    this.UnlinkListsWatchers();
    this.UnlinkCandidatesWatchers();
    this.UnlinkCandidaturesWatchers();
  }

  private UnlinkUserWatchers(): void {
    this.User_db.$ref.off();
  }

  private UnlinkListsWatchers(): void {
    this.PublishedLists_db.$ref.off();
    this.UnpublishedLists_db.$ref.off();
  }

  private UnlinkCandidatesWatchers(): void {
    for (let ref of this.candidates_refs) {
      ref.off();
    }
    this.candidates_refs.length = 0;
  }

  private UnlinkCandidaturesWatchers(): void {
    for (let ref of this.candidatures_refs) {
      ref.off();
    }
    this.candidatures_refs.length = 0;
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

}