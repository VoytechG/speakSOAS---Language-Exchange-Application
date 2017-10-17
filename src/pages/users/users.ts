/******************/
/* Code citations */
/******************/

/**
 *  The first part of the constructor method and the function openChat are from
 *  https://github.com/ionic2blueprints/firebase-chat/blob/master/src/pages/users/users.ts
 *
 *  Function filter is from RanchoSoftware's answer in
 *  http://stackoverflow.com/questions/39549729/how-to-filter-firebaselistobservable-on-client-side
 *  but it has been modified according to our problem.
 */

/*******************/
/* Code references */
/*******************/

/**
 *  Function openDetail is from https://ionicframework.com/docs/api/components/modal/ModalController/
 */



import { Component} from '@angular/core';
import { ModalController, NavController } from 'ionic-angular/index';
import { Observable } from 'rxjs/Observable';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ChatViewPage } from '../chat-view/chat-view';
import { ChatDetailPage } from '../chat-detail/chat-detail';

@Component({
    selector: 'page-users',
    templateUrl: 'users.html',
})

export class UsersPage {
    users:Observable<any[]>;
    languages:Observable<any[]>;
    uid:string;
    languageToLearn: string = "Afrikaans";

    constructor(public nav: NavController,
                public userProvider: UserProvider,
                public modalCtrl: ModalController) {

      // Set Current User's UID and get a list of all the users of the app
      this.userProvider.getUid().then(uid => {
            this.uid = uid;
            this.users = this.userProvider.getAllUsers();
      });

      // Get a list of all the possible languages.
      this.languages = this.userProvider.getLanguages();
    }


    /**
     * Each user is associated with three languages they speak proficiently
     * (languagecross1, languagecross2, languagecross3) and three languages
     * they would like to practise speaking (language1, language2, language3).
     * If user B email is not verified or user B can't speak proficiently the language
     * chosen by user A, user B won't be displayed in the users list.
     * For example, if user A wants to learn English but user B can't speak English proficiently
     * (i.e. languagecross1, languagecross2 and languagecross3 of user B are not equal to English),then
     * user A won't be able to see (or to contact) user B when they select "English" in the "I want to chat in" menu.
     */
    filter (user): boolean {
        if (user.emailVerified == "F" || user.username == this.userProvider.getData(this.uid, "username") ||
           (user.languagecross1 != this.languageToLearn && user.languagecross2 != this.languageToLearn
            && user.languagecross3 != this.languageToLearn)) {
            return true;
        }
        return false;
    }

    /**
     *  If user B can speak proficiently a language that user A wants to practice speaking and
     *  user A can speak proficiently a language that user B wants to practice speaking, then
     *  user A will see user B in the users list with a star next to their username (double-match/crossmatch).
     *  For example, if user A, who can speak proficiently Italian, Spanish and French, select "English" in the
     *  "I want to chat in" menu, all users who can speak proficiently English will be displayed in the users list.
     *  However, if a user B speaks proficiently English and would like to practise speaking French, user A
     *  will see a star next to user B username, meaning that the match is considered as a double-match.
     */
    crossMatch(user) : boolean {
        var languagecross1 = this.userProvider.getData(this.uid, "languagecross1");
        var languagecross2 = this.userProvider.getData(this.uid, "languagecross2");
        var languagecross3 = this.userProvider.getData(this.uid, "languagecross3");
        if ((languagecross1 == user.language1 && languagecross1 != "Null") || (languagecross1 == user.language2 && languagecross1 != "Null") || (languagecross1 == user.language3 && languagecross1 != "Null") ||
            (languagecross2 == user.language1 && languagecross2 != "Null") || (languagecross2 == user.language2 && languagecross2 != "Null") || (languagecross2 == user.language3 && languagecross2 != "Null") ||
            (languagecross3 == user.language1 && languagecross3 != "Null") || (languagecross3 == user.language2 && languagecross3 != "Null") || (languagecross3 == user.language3 && languagecross3 != "Null")) {
            return true;
        }
        return false;
    }


    /**
     * Open the Chat View page and pass as parameters the current User UID
     * and the interlocutor UID.
     */
    openChat(key) {
        let param = {uid: this.uid, interlocutor: key};
        this.nav.push(ChatViewPage,param);
    }

    /**
     * Open the Chat Detail page and pass as parameters just the interlocutor UID.
     */
    openDetail(key) {
        event.stopPropagation();
        let myModal = this.modalCtrl.create(ChatDetailPage, {key:key});
        myModal.present();
    }
}
