/******************/
/* Code citations */
/******************/

/**
 *  The constructor method and the functions elementChanged and resetPassword are from
 *  https://github.com/javebratt/ionic-firebase-email-auth/blob/master/src/pages/reset-password/reset-password.ts
 *  Please note that the function resetPassword has been slightly modified in order to make it cleaner
 *  and simpler.
 */

import { NavController} from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UtilProvider } from '../../providers/utils';
import { validateEmail } from '../../validators/email';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  public resetPasswordForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;

  constructor(public authData: AuthProvider, 
              public formBuilder: FormBuilder, 
              public nav: NavController,
              public utils: UtilProvider) {
    /**
     * Form is used in order to check that the email field is not empty
     * In addition, there is a validator for the email field: only valid emails of particular
     * domains (from SOAS) are allowed.
     */
    this.resetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, validateEmail.isValid])],
    })
  }

  /**
   * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
   */
  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  /**
   *  If the form is valid, call the AuthData service to reset the user's password displaying a loading
   *  component while the user waits. If the form is invalid, display an error message.
   */
  resetPassword(){
    this.submitAttempt = true;

    if (!this.resetPasswordForm.valid){
      let errorAlert = this.utils.doAlert("Please enter a valid email.", "Ok", "cancel");
      errorAlert.present();
    } else {
      this.authData.resetPassword(this.resetPasswordForm.value.email).then((user) => {
        let alert = this.utils.doAlert("We just sent you a reset link to your email", "Ok", "cancel");
        alert.present();
      }, (error) => {
        let errorAlert = this.utils.doAlert(error.message, "Ok", "cancel");
        errorAlert.present();
      });
    }
  }
}
