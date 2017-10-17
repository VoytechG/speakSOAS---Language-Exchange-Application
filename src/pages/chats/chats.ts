/******************/
/* Code citations */
/******************/

/**
 *  The constructor method and the function openChat are from
 *  https://github.com/ionic2blueprints/firebase-chat/blob/master/src/pages/chats/chats.ts
 */

/*******************/
/* Code references */
/*******************/

/**
 *  Function openDetail is from https://ionicframework.com/docs/api/components/modal/ModalController/
 */

import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ChatsProvider } from '../../providers/chats-provider/chats-provider';
import { AngularFire } from 'angularfire2';
import 'rxjs/add/operator/map';
import { ChatViewPage }  from '../chat-view/chat-view';
import { ChatDetailPage } from '../chat-detail/chat-detail';


@Component({
    templateUrl: 'chats.html'
})
export class ChatsPage {
    chats:Observable<any[]>;
    interlocutor: string;

    constructor(public chatsProvider: ChatsProvider,
                public userProvider: UserProvider,
                public af:AngularFire,
                public nav: NavController,
                public modalCtrl: ModalController) {

        /**
         * Get the list of active chats of the current user and
         * map every interlocutor to their corresponding Firebase Object
         * in the users's node (using their UID).
         */
        this.chatsProvider.getChats().then(chats => {
                this.chats = chats.map(users => {
                    return users.map(user => {
                        user.info = this.af.database.object(`/users/${user.$key}`);

                        /* Retrieve seen/unseen status */
                        this.userProvider.getUid().then(uid => {
                          user.info.seen = this.chatsProvider.checkIfSeen(uid, user.$key);
                        });

                        return user;
                    });
                });
            });
        }
    /**
     * Open the Chat View page and pass as parameters the current User UID
     * and the interlocutor UID.
     */
    openChat(key) {
        this.userProvider.getUid().then(uid => {
            let param = {uid: uid, interlocutor: key};
            this.chatsProvider.setSeenStatus(uid, key, true);
            this.nav.push(ChatViewPage, param);
        });
    }

    /**
     * Open the Chat Detail page and pass as parameters just the interlocutor UID.
     */
    openDetail(key) {
        event.stopPropagation();
        let myModal = this.modalCtrl.create(ChatDetailPage, {key:key});
        myModal.present();
    }
}
