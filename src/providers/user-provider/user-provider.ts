/******************/
/* Code citations */
/******************/

/**
 *  Functions getUid, getUser, getAllUsers, getPicture and updatePicture are from
 *  https://github.com/ionic2blueprints/firebase-chat/blob/master/src/providers/user-provider/user-provider.ts
 */


/*******************/
/* Code references */
/*******************/

/**
 *  Function isUserVerified is from https://firebase.google.com/docs/reference/js/firebase.User
 *
 *  Function getUserUid is from https://firebase.google.com/docs/reference/js/firebase.UserInfo#uid and
 *  https://firebase.google.com/docs/reference/js/firebase.auth.Auth#currentUser
 *
 *  Functions getData and updateData are from https://github.com/angular/angularfire2/blob/master/docs/2-retrieving-data-as-objects.md
 *
 *  Function getLanguages is from https://github.com/angular/angularfire2/blob/master/docs/3-retrieving-data-as-lists.md
 *
 *  Function updateUsernames is from https://firebase.google.com/docs/reference/js/firebase.database.Reference#update
 */

import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { Camera } from 'ionic-native';
import firebase from 'firebase';

declare var FCMPlugin:any;

@Injectable()
export class UserProvider {
  public fireAuth: any;

  constructor(public af:AngularFire,
              public local:Storage) {
    // Create an auth reference
    this.fireAuth = firebase.auth();
  }

  /**
   * Get Current User's UID, previously stored in Ionic Storage upon login
   */
  getUid() {
    return this.local.get('uid');
  }

  /**
   * Check if the Current User's email is verified
   */
  isUserVerified() {
    return this.fireAuth.currentUser.emailVerified;
  }


  /**
   * Get the desired information of a user from Firebase database
   * Users are stored using this format:
   *  "users" : {
   *     "{uid1}" : {
   *       "biography" : "{biography}",
   *        "chats" : {
   *          "{uid2}" : true,
   *          "{uid3}" : true},
   *       "email" : "{email}",
   *       "emailVerified" : "{emailVerified}",
   *       "gender" : "{gender}",
   *       "language1" : "{languge1}",
   *       "language2" : "{languge2}",
   *       "language3" : "{languge3}",
   *       "languagecross1" : "{langugecross1}",
   *       "languagecross2" : "{langugecross2}",
   *       "languagecross3" : "{langugecross3}",
   *       "position" : "{position}",
   *       "username" : "{usernames}"}
   */
  getData(uid, data) {
    let item = this.af.database.object(`/users/${uid}/${data}`, { preserveSnapshot: true });
    var data;
    var subscription;
    subscription = item.subscribe(snapshot => {
      data = snapshot.val()
    });

    /**
     * Stop retrieving data from Firebase in order to avoid
     * requests when the user has logged out (which would result
     * in a permission error due to the configuration of Firebase Realtime Database rules)
     * -->retrieve data only once.
     */
    subscription.unsubscribe();

    return data;
  }

  /**
   * Update the desired information of a user in Firebase database.
   */
  updateData (data, uid, field) {
    let currentUserRef = this.af.database.object(`/users/${uid}`);
    if (field == "biography") { currentUserRef.update({biography: data});}
    else if (field == "emailVerified") { currentUserRef.update({emailVerified: data});}
    else if (field == "username") { currentUserRef.update({username: data});}
    else if (field == "token") { currentUserRef.update({token: data});}
  }

  addDeviceToken(uid) {
    let currentUserRef = this.af.database.list(`/users/${uid}/devices`);
    FCMPlugin.getToken((thistoken) => {
      currentUserRef.push(thistoken);
    });
  }

  removeDeviceToken(uid) {
    let devices = this.af.database.list(`/users/${uid}/devices`, { preserveSnapshot: true });
    FCMPlugin.getToken((thistoken) => {
      devices.subscribe(snapshots => {
        var todelete;
        snapshots.forEach(snapshot => {
          if (snapshot.val() == thistoken)
            todelete = snapshot.key;
        });
    //  console.log('Hello there');
      devices.remove(todelete);
      });
    })
  }

  /**
   * Get info of a single user.
   */
  getUser() {
    return this.getUid().then(uid => {
      return this.af.database.object(`/users/${uid}`);
    });
  }

  /**
   * Get current user's UID.
   */
  getUserUid(){
    let user = this.fireAuth.currentUser;
    return user.uid;
  }

  /**
   * Get a list of all the users of the app.
   */
  getAllUsers() {
    return this.af.database.list('/users');
  }

  /**
   * Get a list of all the possible languages.
   */
  getLanguages() {
    return this.af.database.list('/languages');
  }

  /**
   * Keep track of the usernames already used also in a different node.
   * Usernames are stored using this format:
   * "usernames" : {
   *    "{username}" : "{uid}" }
   * This will be used to check for username duplicates.
   */
  updateUsernames(usernameCredentials, uid)
  {
    var username = {}
    username[usernameCredentials] = uid;
    firebase.database().ref().child('usernames').update(username);
  }

  /**
   * Get a base64 Picture from the photo library of the User's device.
   */
  getPicture() {
      let base64Picture;
      let options = {
          destinationType: 0, // Return base64 encoded string
          sourceType: 0, // Choose image from the devices's photo library
          encodingType:0  // JPEG econded image
      };

      let promise = new Promise((resolve, reject) => {
           Camera.getPicture(options).then((imageData) => {
                base64Picture = "data:image/jpeg;base64," + imageData;
                resolve(base64Picture);
            }, (error) => {
                reject(error);
          });

      });
      return promise;
  }

  /**
   * Allow the User to choose a photo from their photo library
   * and update their profile picture.
   */
  updatePicture() {
    this.getUid().then(uid => {
      let pictureRef = this.af.database.object(`/users/${uid}/picture`);
      this.getPicture().then((image) => {
          pictureRef.set(image);
      });
    });
  }
}
