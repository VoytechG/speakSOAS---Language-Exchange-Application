/******************/
/* Code citations */
/******************/

/**
 *  Function initialize is from
 *  https://github.com/ionic2blueprints/firebase-chat/blob/master/src/app/app.component.ts
 *  Please note that this function has been slightly modified in order to ensure that a user
 *  is redirected to the home page only if their email is verified.
 */

import { Component, ViewChild } from '@angular/core';
import { Platform, Nav} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { App } from 'ionic-angular';


/* Pages */
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { ChatViewPage } from '../pages/chat-view/chat-view';


/* Providers */
import { UserProvider } from '../providers/user-provider/user-provider';
import { UtilProvider } from '../providers/utils';

declare var FCMPlugin:any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;
  rootPage:any;

  constructor(platform: Platform,
              public af: AngularFire,
              public userProvider: UserProvider,
              public utilProvider: UtilProvider,
              private app: App) {
    platform.ready().then(() => {
      StatusBar.backgroundColorByHexString('#ffbb11');
      Splashscreen.hide();
      this.intialize();
    });
  }



  /**
   * If the user's email is verified and they were previously logged in,
   * go to the home page. Otherwise, go to the login page.
   */
  intialize() {
    this.af.auth.subscribe(auth => {
         if(auth && this.userProvider.isUserVerified()) {
            this.rootPage = TabsPage;
          } else {
            this.rootPage = LoginPage;
          }
    });
  //  this.getToken();

    let app = this.app;
    let userProvider = this.userProvider;

    var pushPageNew = function (parameters) {
      let nav = app.getActiveNav();
      nav.push(ChatViewPage, parameters);
    }

    FCMPlugin.onNotification(function(data){
      if(data.wasTapped){
        //Notification was received on device tray and tapped by the user.
        alert( JSON.stringify(data) );
      } else {
        var interlocutor = data.interlocutor;
        //Notification was received in foreground. Maybe the user needs to be notified.
        window['plugins'].toast.showWithOptions(
          {
            message: "You have received a new message from " + data.name,
            duration: 3000, // ms
            position: "top",
            addPixelsY: -40,  // (optional) added a negative value to move it up a bit (default 0)
          },
          // implement the success callback
          function(result) {
            if (result && result.event == "touch") {
              let uid = userProvider.getUserUid();
              let param = {uid: uid, interlocutor: interlocutor};
              pushPageNew(param);
            }
          }
        );
      }
    });
  }

  /*getToken() {
    this.userProvider.getUid().then(uid => {
      FCMPlugin.getToken((token) => {
        this.userProvider.updateData(token, uid, "token");
      });
    });
  }*/
}
