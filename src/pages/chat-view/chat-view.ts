/******************/
/* Code citations */
/******************/

/**
 *  The first two parts of the constructor method and the functions sendPicture and sendMessage are from
 *  https://github.com/ionic2blueprints/firebase-chat/blob/master/src/pages/chat-view/chat-view.ts
 */

/*******************/
/* Code references */
/*******************/

/**
 *  Function ionViewDidEnter is from
 *  https://ionicframework.com/docs/api/navigation/NavController/
 *  and https://ionicframework.com/docs/api/components/content/Content/
 */

import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ChatsProvider } from '../../providers/chats-provider/chats-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

declare var FCMPlugin:any;

@Component({
  templateUrl: 'chat-view.html',
})
export class ChatViewPage {
  message: string;
  uid:string;
  interlocutor:string;
  chats:FirebaseListObservable<any>;
  username: string;
  @ViewChild(Content) content: Content;

  constructor(public nav:NavController,
              params:NavParams,
              public chatsProvider:ChatsProvider,
              public af:AngularFire,
              public userProvider:UserProvider,
              public http: Http) {


    // Get current user UID and interlocutor UID, passed as NavParams from Chats page
    this.uid = params.data.uid;
    this.interlocutor = params.data.interlocutor;

    // Get chat reference between the current user and the interlocutor
    chatsProvider.getChatRef(this.uid, this.interlocutor).then((chatRef:any) => {
        this.chats = this.af.database.list(chatRef);
    });

    // Get interlocutor's username
    this.username = this.userProvider.getData(this.interlocutor, "username");
  }

  scrollDown() {
    this.content.resize();
    this.content.scrollToBottom(0);
  }

  // As soon as the page is entered, the content component is scrolled to the bottom
  ionViewDidEnter() {
    this.content.resize();
    this.content.scrollToBottom();
    this.chatsProvider.setSeenStatus(this.uid, this.interlocutor, true);
    var token = this.userProvider.getData(this.uid, "token");
    console.log(token);
  }

  // When the Chat View Page is no longer the active page, stop retrieving data from Firebase
  ionViewDidLeave() {
    this.chatsProvider.removeConnections(this.uid, this.interlocutor);
    this.chatsProvider.setSeenStatus(this.uid, this.interlocutor, true);
  }

  /**
   * If the message field is not empty, add the message to the corresponding
   * chat node (inside chats node) with the following format:
   * "chats" : {
   *    "{uid},{interlocutor}" : {
   *        "{message-unique-id-1}" : {
   *            "from" : "{uid}",
   *            "message" : "{message1}",
   *            "type" : "message"}}}
   */
  sendMessage() {
      if(this.message) {
          let chat = {
              from: this.uid,
              message: this.message,
              type: 'message'
          };
          this.chats.push(chat);
          this.message = ""; // Reset message field

          this.chatsProvider.setSeenStatus(this.interlocutor, this.uid, false);

          let devices = this.af.database.list(`/users/${this.interlocutor}/devices`, { preserveSnapshot: true });
          FCMPlugin.getToken((thistoken) => {
              devices.subscribe(snapshots => {
              snapshots.forEach(snapshot => {
                  this.sendNotification(snapshot.val());
              });
            });
          })
      }
  };

  sendNotification(interlocutorToken) {
    var bodyMessage = "You have a new message from " + this.username;
    var titleMessage = "SOAS Language Exchange";

    let headers = new Headers(
    {
      'Content-Type' : 'application/json',
      'Authorization' : 'key=AAAADZdFxew:APA91bFk4OXt0Mz-nRquQzMDRRwg0d_JRSav1LlUzgXyoVsEdvwKjr5Du34niK5lc0xblMYhdWMUK6Ft7LLfnIXHpqaNJZIb-Y4pcoLlFIzzPvERXOEvV3FwT6a0ZB6G7jKZYwdRwyUG'
    });
    let options = new RequestOptions({ headers: headers });

    let data = JSON.stringify({

        "notification":{
          "title": titleMessage,
          "body": bodyMessage,
          "sound": "default",
          "icon": "push_icon"
        },
        "data":{
          "name": this.username
        },
          "to": interlocutorToken,
          "priority":"high"

    });

    return new Promise((resolve, reject) => {
      this.http.post('https://fcm.googleapis.com/fcm/send', data, options)
      .toPromise()
      .then((response) =>
      {
        console.log('API Response : ', response.json());
        resolve(response.json());
      })
      .catch((error) =>
      {
        console.error('API Error : ', error.status);
        console.error('API Error : ', JSON.stringify(error));
        reject(error.json());
      });
    });
  }


  /**
   * Get a picture from the photo library of the User's device and add it to
   * the corresponding chat node (inside chats node) with the following format:
   * "chats" : {
   *    "{uid},{interlocutor}" : {
   *        "{message-unique-id-1}" : {
   *            "from" : "{uid}",
   *            "message" : "{picture1}",
   *            "type" : "picture"}}}
   */
  sendPicture() {
      let chat = {from: this.uid, type: 'picture', picture:null};
      this.userProvider.getPicture().then((image) => {
          chat.picture = image;
          this.chats.push(chat);
      });

      this.chatsProvider.setSeenStatus(this.interlocutor, this.uid, false);
  }
}
