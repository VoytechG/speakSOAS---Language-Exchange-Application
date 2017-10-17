/******************/
/* Code citations */
/******************/

/**
 *  Class TabsPage is from
 *  https://github.com/ionic2blueprints/firebase-chat/blob/master/src/pages/tabs/tabs.ts
 */

import { Component } from '@angular/core';
import { ChatsPage } from '../chats/chats'; 
import { AccountPage } from '../account/account';
import { UsersPage } from '../users/users';

@Component({
	selector: 'tabs-page',
	templateUrl: 'tabs.html'
})
export class TabsPage {
	chats = ChatsPage;
	users = UsersPage;
  profile = AccountPage;
}