/*******************/
/* Code references */
/*******************/

/**
 *  Functions loginUser, signupUser and logoutUser are from 
 *  https://firebase.google.com/docs/reference/js/firebase.auth.Auth
 * 
 *  Functions resetPassword, deleteUser and sendEmailVerification are from 
 *  https://firebase.google.com/docs/auth/web/manage-users
 */

import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';

@Injectable()
export class AuthProvider {
  public fireAuth: any;
  
  constructor(public af:AngularFire, 
              public local:Storage) {
    // Create an auth reference.
    this.fireAuth = firebase.auth();
  }

  /**
   * This function will take an email and password and log the user into the app.
   */
  loginUser(email, password) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * This function will take the user's email and password and create a new account on Firebase.
   */
  signupUser(email, password) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  /**
   * This function will take the user's email address and send a password reset link.
   * Firebase will then handle the email reset part.
   */
  resetPassword(email) {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  /**
   * This function will just log the current user out of the app.
   */
  logoutUser() {
    return this.fireAuth.signOut();
  }

  /**
   * This function will take the current user's email and password and delete the current account.
   * It will be used during the signup process to delete accounts, in the case of username duplicates.
   */
  deleteUser(email, password) {
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
                        email, 
                        password);
    /**
     * Deleting an account require that the user has recently signed in. 
     * That's why the reauthenticate method must be called before deleting the account.
    */
    user.reauthenticate(credential).then(function() {
          user.delete();
        }, function(error) {
          console.log(error);
        });
   }

    /**
      * Email verification: send an email to the user. The email will contain a link,
      * and once the user clicks on that link, the account will be verified.
    */
    sendEmailVerification(){
      let user = this.fireAuth.currentUser;
      user.sendEmailVerification();
    }
}
