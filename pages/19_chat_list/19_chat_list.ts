import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, FeasyItem, Review, StripForFirebase, Chat } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

@Component({
  selector: 'page-chat-list',
  templateUrl: '19_chat_list.html'
})
export class ChatListPage {

  public MyChats: Array<any> = new Array<any>();
  public SingleChat: any;

  constructor(public navCtrl: NavController, public af: AngularFire, public globals: Globals, public alertCtrl: AlertController) {
    console.log("jhl");
  }

  ionViewDidEnter() {
    console.log("jhl2");
    for (let userchat_key in this.globals.UserChats_db) {
      console.log("jhl3");
      let chat: Chat = this.globals.Chats[userchat_key];
      this.SingleChat = chat;
      if (chat.DemanderUid == this.globals.UID) {
        this.SingleChat.OtherPerson = chat.ShopperName;
      } else {
        this.SingleChat.OtherPerson = chat.DemanderName;
      }
      this.MyChats.push(this.SingleChat);
    }
    console.log("jhl4");
  }  


}
