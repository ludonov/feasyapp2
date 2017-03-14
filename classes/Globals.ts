import { Injectable } from '@angular/core';
import { NavController, AlertController, Alert, LoadingController, Loading } from 'ionic-angular';
import { AngularFire, AuthProviders, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { LocalNotifications } from 'ionic-native';

import { FeasyUser, FeasyList, Candidate } from './Feasy';
import { PublicatedListCandidatesPage } from '../pages/14_publicated_list_candidates/14_publicated_list_candidates';

@Injectable()
export class Globals {

  public UID: string = "";

  public User: FeasyUser = new FeasyUser("", "", "");
  public User_db: FirebaseListObservable<any>;

  public PublishedLists: Object = {};
  public PublishedLists_db: FirebaseListObservable<any>;
  public NoPublishLists: boolean = true;

  public UnpublishedLists: Object = {};
  public UnpublishedLists_db: FirebaseListObservable<any>;
  public NoUnpublishLists: boolean = true;


  public Candidates: Object = {};
  public Candidates_db: FirebaseListObservable<any>;
  public candidates_refs: Array<firebase.database.Reference> = new Array();

  public JustRegistered: boolean = false;

  public af: AngularFire;
  public navCtrl: NavController;
  public alertCtrl: AlertController;
  public loadingCtrl: LoadingController;

  constructor() {
  }


  public LinkAllWatchers(): void {
    this.LinkUserWatchers();
    this.LinkListsWatchers();
    this.LinkCandidateWatchers();
  }


  //LINK WATCHERS SECTION

  private LinkUserWatchers(): void {
    this.User_db = this.af.database.list('/users/' + this.UID);
    this.User_db.$ref.on("value", (snapshot: firebase.database.DataSnapshot) => {
      this.User = snapshot.val();
      if (this.User != null)
        console.log("User data fetched. Name: " + this.User.DisplayName);
      else
        console.log("User data null");
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
        let _list: FeasyList = list.val();
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
      this.NoPublishLists = !snapshot.hasChildren();
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
        let _list: FeasyList = list.val();
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
      this.NoUnpublishLists = !snapshot.hasChildren();
      //loading2.dismiss();
    });
  }

  private LinkCandidateWatchers(): void {
    try {
      this.Candidates_db = this.af.database.list("/candidates/" + this.UID);
      this.candidates_refs.push(this.Candidates_db.$ref.ref);
      this.Candidates_db.$ref.on("value", (list: firebase.database.DataSnapshot) => {
        this.Candidates = list.val();
      });

      this.Candidates_db.$ref.on("child_added", (list: firebase.database.DataSnapshot) => {
        let ref_cand: FirebaseListObservable<any> = this.af.database.list("/candidates/" + this.UID + "/" + list.key);
        this.candidates_refs.push(ref_cand.$ref.ref);
        ref_cand.$ref.on("value", (candidates: firebase.database.DataSnapshot) => {
          let candidates_data = candidates.val();
          let new_candidates_number: number = 0;
          for (let candidate in candidates_data) {
            if (candidates_data[candidate] != null && !candidates_data[candidate].Visualised) {
              new_candidates_number++;
            }
          }
          if (new_candidates_number > 0) {
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
            //let alert: Alert = this.alertCtrl.create({
            //  title: new_candidates_number == 1 ? 'Nuovo candidato!' : "Nuovi candidati!",
            //  subTitle: "Vuoi vedere i dettagli?",
            //  buttons: [
            //    {
            //      text: 'Cancel',
            //      role: 'cancel'
            //    },
            //    {
            //      text: 'Ok',
            //      handler: () => {
            //        let candidates_list: any = list.val();
            //        this.navCtrl.push(PublicatedListCandidatesPage, { list_owner: this.globals.UID, list_key: list.key });
            //      }
            //    }]
            //});
            //alert.present();
          }
        });
      });

    } catch (e) {
      console.log("link catch err: " + JSON.stringify(e));
    }
  }  



  // UNLINK WATCHERS SECTION

  public UnlinkAllWatchers(): void {
    this.UnlinkUserWatchers();
    this.UnlinkListsWatchers();
    this.UnlinkCandidateWatchers();
  }

  private UnlinkUserWatchers(): void {
    this.User_db.$ref.off();
  }

  private UnlinkListsWatchers(): void {
    this.PublishedLists_db.$ref.off();
    this.UnpublishedLists_db.$ref.off();
  }

  private UnlinkCandidateWatchers(): void {
    for (let ref of this.candidates_refs) {
      ref.off();
    }
    this.candidates_refs.length = 0;
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