import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';
import { FeasyUser, FeasyList, FeasyItem, Review, StripForFirebase, Chat } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { ChatPage } from '../20_chat/20_chat';

@Component({
  selector: 'page-chat-list',
  templateUrl: '19_chat_list.html'
})
export class ChatListPage {
  
  constructor(public navCtrl: NavController,  public globals: Globals, public alertCtrl: AlertController) {

  }  

  GoToChat(_chat_key: any): void {
    this.navCtrl.push(ChatPage, { chat_key: _chat_key});
  }  


}
