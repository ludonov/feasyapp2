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
    public MessagesFromDB: Object = {};
    public Messages: Array<Message> = new Array<Message>();
    public MessagesInOrder: Array<Message> = new Array<Message>();
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
        this.SortMessageArrayByDate();
    }

    SendMessage(input: any): void {
        let mess: Message = new Message();
        mess.Text = this.new_message;
        mess.OwnerUid = this.globals.UID;
        mess.Date = (new Date()).toUTCString();
        this.af.list("/chats/" + this.chat_key + "/Messages").push(StripForFirebase(mess)).then(res => {
            this.new_message = null;
            input.setFocus();
        }).catch((err: Error) => {
            console.log("Error: " + err.message);
        });
    }  

    SortMessageArrayByDate(): void {
        for (let i = 0; i < this.Messages.length; i++) {
            if (this.Messages[i] != null) {
                if (i == 0) {
                    this.MessagesInOrder.push(this.Messages[i]);
                } else {
                    for (let j = 0; j < this.MessagesInOrder.length; j++){
                        if (this.Messages[i].Date > this.MessagesInOrder[j].Date) {
                            this.MessagesInOrder.splice((this.Messages.length - j), 0, this.Messages[i]);
                            break;
                        }
                    }
                }
            } else {
                return;
            }
        }    
    }

    GoToList(): void{
        this.navCtrl.push(PublicatedListWithShopperPage, { list_key: this.chat.ListKey });
    }

}
