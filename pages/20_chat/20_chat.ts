import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';
import { FeasyUser, FeasyList, FeasyItem, Review, StripForFirebase, Chat, Message } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { PublicatedListWithShopperPage } from '../11_publicated_list_with_shopper/11_publicated_list_with_shopper';

@Component({
    selector: 'page-chat',
    templateUrl: '20_chat.html'
})
export class ChatPage {

    public chat_key: string;
    public chat: Chat = new Chat();
    //public MessagesFromDB: Object = {};
    //public Messages: Array<Message> = new Array<Message>();
    //public MessagesInOrder: Array<Message> = new Array<Message>();
    public PersonInContact: string;
    public new_message: string;

    constructor(public navCtrl: NavController, public globals: Globals, public alertCtrl: AlertController, public navParams: NavParams, public af: AngularFireDatabase) {
        this.chat_key = navParams.get('chat_key');
        this.chat = this.globals.GetChatByKey(this.chat_key);
        if (this.chat.DemanderUid == globals.UID) {
            this.PersonInContact = this.chat.ShopperName;
        } else {
            this.PersonInContact = this.chat.DemanderName;
        }
    }

    SendMessage(input: any): void {
        let mess: Message = new Message();
        mess.Text = this.new_message;
        //this.globals._user.getToken(true).then((_token) => {
          //(mess as any).Token = _token;
          mess.OwnerUid = this.globals.UID;
          mess.Date = (new Date());
          this.af.list("/chats/" + this.chat_key + "/Messages").push(StripForFirebase(mess)).then(res => {
            this.new_message = null;
            input.setFocus();
          }).catch((err: Error) => {
            console.log("Error: " + err.message);
          });
        //});
    }  

    GoToList(): void{
        this.navCtrl.push(PublicatedListWithShopperPage, { list_key: this.chat.ListKey });
    }

}
