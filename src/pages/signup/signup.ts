/******************/
/* Code citations */
/******************/

/**
 *  The first two parts of the constructor method and the functions elementChanged and signupUser are from
 *  https://github.com/javebratt/ionic-firebase-email-auth/blob/master/src/pages/signup/signup.ts
 *  Please note that the signupUser function has been greatly improved by introducing
 *  extra functionalities such as the email verification and the update of Firebase Database
 *  after a user has successfully created a new account.
 */

import { NavController} from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { validateEmail } from '../../validators/email';
import { UtilProvider } from '../../providers/utils';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm;
  public usernameForm;
  usernameChanged: boolean = false;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;
  public language1: string = "Null";
  public language2: string = "Null";
  public language3: string = "Null";
  public languagecross1: string = "Null";
  public languagecross2: string = "Null";
  public languagecross3: string = "Null";
  public gender: string = "Prefer not to say";
  public position: string;
  languages:Observable<any[]>;

  constructor(public nav: NavController,
              public authData: AuthProvider,
              public formBuilder: FormBuilder,
              public utils: UtilProvider,
              public storage: Storage,
              public userProvider: UserProvider,
              public af:AngularFire) {

    /**
     * Forms are used in order to check that the email and password fields are not empty
     * and to ensure that the password field is made up by more than 6 characters.
     * In addition, there is a validator for the email field: only valid emails of particular
     * domains (from SOAS) are allowed.
     */
    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, validateEmail.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    })

    /**
     * Form is used in order to check that the username field is not empty and to ensure
     * that the username is made up by minimum 5 characters.
     */
    this.usernameForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    })

    // Get a list of all the possible languages.
    this.languages = this.userProvider.getLanguages();
  }

  /**
   * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
   */
  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  isLetter(c) {
    return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z');
  }

  isNumber(c) {
    return ('0' <= c && c <= '9');
  }

  /**
   *  If the form is valid call the authData service to sign the user up, displaying a loading
   *  component while the user waits. If the chosen username is already taken or any other error occurs,
   *  the corresponding error message is displayed.
   */
  signupUser(){
    this.submitAttempt = true;
    let credentials = this.signupForm.value;
    let usernameCredentials = this.usernameForm.value;

    if (!this.usernameForm.valid){
      this.utils.doAlert("Please enter a valid username.", "Ok", "cancel");
    } else {
        this.authData.signupUser(credentials.email, credentials.password).then((data) => {
          // Set the user's position based on the domain of their email
          if (   this.isLetter(credentials.email[0])
              && this.isLetter(credentials.email[1])
              && this.isNumber(credentials.email[2])) {
            this.position = "SOAS Staff";
          } else {
            this.position = "SOAS Student";
          }

          /*
           * Try setting the user's data in their corresponding user node (in the users node). If the username is already
           * taken, delete the account created and display an error message. Note that before try setting the user's username,
           * this latter is converted to lower case, in order to facilitate the process of checking for username duplicates
           * (which is done with the help of Firebase Realtime Database rules and of the "usernames" node which keeps track of
           * the usernames already taken, by converting them to lower case first and associating them with the corresponding UID).
          */
          let currentUserRef = this.af.database.object(`/users/${data.uid}`);
          currentUserRef.set({email: credentials.email, username: usernameCredentials.username.toLowerCase(),
                              gender: this.gender, language1: this.language1, language2: this.language2,
                              language3: this.language3, biography: "Hey!", position: this.position,
                              languagecross1: this.languagecross1, languagecross2: this.languagecross2,
                              languagecross3: this.languagecross3, emailVerified: "F"}).then(() => {
          /**
           * Update the user's username field in their corresponding user node (in the users node)
           * with the correct username (not converted to lower case)
          */
          this.userProvider.updateData(usernameCredentials.username, data.uid, "username");
          // Update the usernames node with the new username (converted to lower case).
          this.userProvider.updateUsernames(usernameCredentials.username.toLowerCase(), data.uid);

          // Send email verification to the user
          this.authData.sendEmailVerification();
          let confirmAlert = this.utils.doAlert("Dear " + usernameCredentials.username + ", a confirmation email has been sent to " + credentials.email, "Ok", "cancel");
          confirmAlert.present();

          this.nav.pop();
          }, (error) => { // The username is already taken
                this.authData.deleteUser(credentials.email, credentials.password);
                this.loading.dismiss().then( () => {
                  let errorAlert = this.utils.doAlert("The username " + usernameCredentials.username + " is already taken. Try again.", "Ok", "cancel");
                  errorAlert.present();
                });
              });
      }, (error) => { // Any other error occurred while trying to sign up the user
        this.loading.dismiss().then( () => {
          let errorAlert = this.utils.doAlert(error.message, "Ok", "cancel");
          errorAlert.present();
        });
      });

      this.loading = this.utils.doLoading();
      this.loading.present();
    }
  }
}
