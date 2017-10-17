/******************/
/* Code citations */
/******************/

/**
 *  The constructor, the updatePicture function and the logout function (only the last two function calls)
 *  are from https://github.com/ionic2blueprints/firebase-chat/blob/master/src/pages/account/account.ts
 *
 *  The function autoHeight is from Rob W's answer in
 *  http://stackoverflow.com/questions/7745741/auto-expanding-textarea
 *  Note that the function has been slightly modified according to our needs.
 */

import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';
import { FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { OptionsPage } from '../options/options';

@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})
export class AccountPage {
  private biography;
  loading: any;
  subscription: any;
  user = {};

  constructor(public nav: NavController,
              public auth: AuthProvider,
              public userProvider: UserProvider,
              public formBuilder: FormBuilder,
              public local:Storage,
              public utils: UtilProvider) {

    /**
     * Get a reference to the Current User object in Firebase Database (in users node)
     * and subscribe to it (start looking for any changes).
     */
    this.userProvider.getUser().then(userObservable => {
      this.subscription = userObservable.subscribe(user => {
          this.user = user;});
    });
  }


  // Update Current User's profile picture
  updatePicture() {
    this.userProvider.updatePicture();
  };

  goToOptions(){
    this.nav.push(OptionsPage);
  }

  // Update Current User's biography
  updateBiography(){
    this.userProvider.updateData(this.biography, this.userProvider.getUserUid(), "biography");

    let confirmAlert = this.utils.doAlert("Your biography has been updated.", "Ok", "cancel");
    confirmAlert.present();
  }

  // Log the current user out of the application.
  logout() {
    /**
      * Remove Current User's UID from Ionic Storage
      * (it was previously stored there upon user's login).
      */
    this.removeDeviceToken();
    this.local.remove('uid');
    this.auth.logoutUser();

    /**
    * Stop retrieving data from Firebase in order to avoid
    * requests when the user has logged out (which would result
    * in a permission error due to the configuration of Firebase Realtime Database rules).
    */
    this.subscription.unsubscribe();
  }

  removeDeviceToken() {
    this.userProvider.removeDeviceToken(this.userProvider.getUserUid());
  }

  // Automatically adjust the height of the element according to the scroll height
  autoHeight() {
    // Get UI elements
    var element   = document.getElementById('input');
    var textarea  = element.getElementsByTagName('textarea')[0];

    element.style.height = ""; // Reset the height
    element.style.height = textarea.scrollHeight + 10 + "px";
    textarea.style.height = ""; // Reset the height
    textarea.style.height = textarea.scrollHeight + 10 + "px";
  }
}
