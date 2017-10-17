/******************/
/* Code citations */
/******************/

/**
 *  The constructor method and the functions elementChanged and loginUser are from
 *  https://github.com/javebratt/ionic-firebase-email-auth/blob/master/src/pages/login/login.ts
 *  Please note that the loginUser function has been greatly improved by introducing extra
 *  functionalities such as the email verification and the update of Firebase Database
 *  after a user has successfully verified their email.
 */

import { Storage } from '@ionic/storage';
import { NavController} from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { validateEmail } from '../../validators/email';
import firebase from 'firebase';

import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { ResetPasswordPage } from '../reset-password/reset-password';

import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;
  public fireAuth: any;
  signupPage = SignupPage;
  resetPasswordPage = ResetPasswordPage;

  constructor(public nav: NavController,
              public authData: AuthProvider,
              public formBuilder: FormBuilder,
              public userProvider: UserProvider,
              public utils: UtilProvider,
              public storage:Storage) {

    // Create an auth reference
    this.fireAuth = firebase.auth();

    /**
     * Forms are used in order to check that the email and password fields are not empty
     * and to ensure that the password field is made up by more than 6 characters.
     * In addition, there is a validator for the email field: only valid emails of particular
     * domains (from SOAS) are allowed.
     */
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, validateEmail.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }


  /**
   * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
   */
  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  /**
   * Log the user into the app. If the user's email is not verified or any other error occurs,
   * the corresponding error message is displayed. A loading indicator appears while trying
   * to log the user into the app.
   */
  loginUser(){
    this.submitAttempt = true;
    let credentials = this.loginForm.value;

    if (!this.loginForm.valid){
      let errorAlert = this.utils.doAlert("Please enter valid details.", "Ok", "cancel");
      errorAlert.present();
    } else {
        this.authData.loginUser(credentials.email, credentials.password).then((data) => {
          let user = this.fireAuth.currentUser;
          if (user.emailVerified){
            // Store Current User's UID from Ionic Storage
            this.storage.set('uid', data.uid);

            /**
             * If the user is logging in the application for the first time after they have
             * verified their email, update their corresponding node (in the users node) accordingly.
             */
            if (this.userProvider.getData(data.uid, "emailVerified") != "T") {
              this.userProvider.updateData("T", data.uid, "emailVerified");
            }
            this.userProvider.addDeviceToken(data.uid);
            this.nav.setRoot(TabsPage);
          } else { // User's email is not verified
              this.loading.dismiss().then( () => {
              let errorAlert = this.utils.doAlert("Email not verified, please check your inbox or spam messages.", "Ok", "cancel");
              errorAlert.present();
              });
            }
          }, error => {
            this.loading.dismiss().then( () => {
              let errorAlert = this.utils.doAlert(error.message, "Ok", "cancel");
              errorAlert.present();
            });
          });

          this.loading = this.utils.doLoading();
          this.loading.present();
      }
  }

  changePage (page){
    this.nav.push(page);
  }
}
