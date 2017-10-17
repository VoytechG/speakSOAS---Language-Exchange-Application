/******************/
/* Code citations */
/******************/

/**
 *  Function isValid is from
 *  https://github.com/ionic2blueprints/firebase-chat/blob/master/src/validators/email.ts
 *  Note that the file was also modified in order to also check the emails' domain.
 */

import { FormControl } from '@angular/forms';

export class validateEmail {

    static isValid(control: FormControl){

      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(control.value);
      var dom = control.value.substr(control.value.indexOf("@"));

      //RELEASE
      //if (re && dom == "@soas.ac.uk"){

      //TESTING
      if (re){
        return null;
      }

      return {"invalidEmail": true};
    }

}
