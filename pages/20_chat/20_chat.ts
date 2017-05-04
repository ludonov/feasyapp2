import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';
import { FeasyUser, FeasyList, FeasyItem, Review, StripForFirebase, Chat, Message } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
    selector: 'page-chat',
    templateUrl: '20_chat.html'
})
export class ChatPage {

    public chat_key: string;
    public chat: Chat = new Chat();
    public Messages: Object = {};
    public PersonInContact: string;

    public new_message: string;

    constructor(public navCtrl: NavController, public globals: Globals, public alertCtrl: AlertController, public navParams: NavParams, public af: AngularFireDatabase) {
        this.chat_key = navParams.get('chat_key');
        this.chat = this.globals.GetChatByKey(this.chat_key);
        this.Messages = this.chat["Messages"];
        if (this.chat.DemanderUid == globals.UID) {
            this.PersonInContact = this.chat.ShopperName;
        } else {
            this.PersonInContact = this.chat.DemanderName;
        }
    }

    SendMessage(input: any): void {
        let mess: Message = new Message();
        mess.Text = this.new_message;
        mess.isMine = true;
        this.af.list("/chats/" + this.chat_key + "/Messages").push(StripForFirebase(mess)).then(res => {
            this.new_message = null;
            input.setFocus();
        }).catch((err: Error) => {
            console.log("Error: " + err.message);
        });
        
    }  


}
