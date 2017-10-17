import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider/user-provider';


@Component({
  selector: 'page-chat-detail',
  templateUrl: 'chat-detail.html'
})
export class ChatDetailPage {
  uid: string;
  username: string;
  language1: string;
  language2: string;
  language3: string;
  languagecross1: string;
  languagecross2: string;
  languagecross3: string;
  biography: string;
  position: string;
  gender: string;
  picture: any;

  constructor(public navCtrl: NavController, params: NavParams, public userProvider: UserProvider) {
    // Get the interlocutor UID, passed as NavParams from previous page (User Page or Chats Page)
    this.uid = params.get('key');

    // Get and store interlocutor's data through their UID
    this.username = this.userProvider.getData(this.uid, "username");
    this.language1 = this.userProvider.getData(this.uid, "language1");
    this.language2 = this.userProvider.getData(this.uid, "language2");
    this.language3 = this.userProvider.getData(this.uid, "language3");
    this.biography = this.userProvider.getData(this.uid, "biography");
    this.picture = this.userProvider.getData(this.uid, "picture");
    this.position = this.userProvider.getData(this.uid, "position");
    this.languagecross1 = this.userProvider.getData(this.uid, "languagecross1");
    this.languagecross2 = this.userProvider.getData(this.uid, "languagecross2");
    this.languagecross3 = this.userProvider.getData(this.uid, "languagecross3");
    this.gender = this.userProvider.getData(this.uid, "gender");
  }

  closeModal() {
    this.navCtrl.pop();
  }
}
