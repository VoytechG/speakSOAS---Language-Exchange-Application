/******************/
/* Code citations */
/******************/
/**
 *  Functions getChats, addChats and getChatRef are from
 *  https://github.com/ionic2blueprints/firebase-chat/blob/master/src/providers/chats-provider/chats-provider.ts
 */

/*******************/
/* Code references */
/*******************/
/**
 *  Function removeConnections is from https://firebase.google.com/docs/reference/js/firebase.database.Reference#off
 */

import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { UserProvider } from '../user-provider/user-provider';
import firebase from 'firebase';

@Injectable()
export class ChatsProvider {
  constructor(public af: AngularFire,
              public userProvider: UserProvider) {}

  /**
   * Get the list of chats of a logged in User.
   * The chats are also stored under the users' node using this format:
   *  "users" : {
   *     "{uid1}" : {
   *       "biography" : "{biography}",
   *        "chats" : {
   *          "{uid2}" : true,
   *          "{uid3}" : true},
   *       "email" : "{email}",
   *       "emailVerified" : "{emailVerified",
   *       "gender" : "{gender}",
   *       "language1" : "{languge1}",
   *       "language2" : "{languge2}",
   *       "language3" : "{languge3}",
   *       "languagecross1" : "{langugecross1}",
   *       "languagecross2" : "{langugecross2}",
   *       "languagecross3" : "{langugecross3}",
   *       "position" : "{position}",
   *       "username" : "{usernames}"}
   * In this example, we can notice that {uid1} has already
   * started a chat with {uid2} and {uid3}.
   */
  getChats() {
     return this.userProvider.getUid().then(uid => {
        let chats = this.af.database.list(`/users/${uid}/chats`);
        return chats;
     });
  }

  /**
   * Add chat references to both users (in the users' node).
   * Each user can see if they have read the latest message from every other user they have started a chat with.
   * Set from user to interlocutor as seen, vice versa unseen.
   */
   addChats(uid,interlocutor) {
      // User
      this.af.database.object(`/users/${uid}/chats/${interlocutor}/seen`).set(true);
      // Interlocutor
      this.af.database.object(`/users/${interlocutor}/chats/${uid}/seen`).set(false);
    }

    /* Retrieve seen/unseen status of latest message for a user from an interlocutor.*/
    checkIfSeen(uid, interlocutor) {
      var seenSnapshot = this.af.database.object(`/users/${uid}/chats/${interlocutor}/seen`, { preserveSnapshot: true});
      var value;
      seenSnapshot.subscribe(snapshot => {
          value = snapshot.val();
      });
      return value;
    }

    /* Set seen/unseen status of latest message for a user from an interlocutor to value of 'seen'. */
    setSeenStatus(uid, interlocutor, seen) {
        this.af.database.object(`/users/${uid}/chats/${interlocutor}/seen`).set(seen);
    }

  /**
   * The chats are stored in the chats' node using this format:
   * "chats" : {
   *     "{uid1},{uid2}" : {
   *       "{message-unique-id-1}" : {
   *         "from" : "{uid1}",
   *         "message" : "message1",
   *         "type" : "message"},
   *      "{message-unique-id-2}" : {
   *         "from" : "{uid2}",
   *         "message" : "picture1",
   *         "type" : "picture" }}}
   * Check if under the chats' node there is a node "{uid},{interlocutor}" or "{interlocutor},{uid}"
   * (i.e. there is already a chat going on between {uid} and {interlocutor}).
   * Otherwise, add chat references to both users (in the user's node).
   * The function then returns a reference to the node (in the chat's node)
   * corresponding to the chat between {uid} and {interlocutor}.
   */
  getChatRef(uid, interlocutor) {
      let firstRef = this.af.database.object(`/chats/${uid},${interlocutor}`, {preserveSnapshot:true});
      let promise = new Promise((resolve, reject) => {
          firstRef.subscribe(snapshot => {
                let a = snapshot.exists();
                if(a) {
                    resolve(`/chats/${uid},${interlocutor}`);
                } else {
                    let secondRef = this.af.database.object(`/chats/${interlocutor},${uid}`, {preserveSnapshot:true});
                    secondRef.subscribe(snapshot => {
                        let b = snapshot.exists();
                        if(!b) {
                            this.addChats(uid,interlocutor);
                        }
                    });
                    resolve(`/chats/${interlocutor},${uid}`);
                }
            });
      });
      return promise;
  }

  /**
     * Stop retrieving data from Firebase in order to avoid
     * requests when the user has logged out (which would result
     * in a permission error due to the configuration of Firebase Realtime Database rules)
  */
  removeConnections(uid, interlocutor) {
    firebase.database().ref(`/chats/${uid},${interlocutor}`).off();
    firebase.database().ref(`/chats/${interlocutor},${uid}`).off();
  }
}
