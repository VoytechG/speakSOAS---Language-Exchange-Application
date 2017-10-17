/*******************/
/* Code references */
/*******************/

/**
 *  Functions doAlert is from
 *  https://ionicframework.com/docs/api/components/alert/AlertController/
 *  Function doLoading is from
 *  https://ionicframework.com/docs/api/components/loading/LoadingController/
 */

import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
@Injectable()
export class UtilProvider {
    constructor(public AlertCtrl:AlertController,
                public loadingCtrl: LoadingController) {}
    // Display an alert (i.e. a dialog that presents user with information)
    doAlert(message, buttonText, role) {
      let alert = this.AlertCtrl.create({
          message: message,
          buttons: [
            {
              text: buttonText,
              role: role
            }]
      });
      return alert; 
    }

    // Display a loading component
    doLoading() {
      let loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      return loading; 
    }
}