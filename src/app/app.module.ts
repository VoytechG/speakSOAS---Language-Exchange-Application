import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

/* Pages */
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { UsersPage } from '../pages/users/users';
import { ChatsPage } from '../pages/chats/chats';
import { AccountPage } from '../pages/account/account';
import { ChatViewPage } from '../pages/chat-view/chat-view';
import { LicensesPage } from '../pages/licenses/licenses';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { TermsServicePage } from '../pages/terms-service/terms-service';
import { ChatDetailPage } from '../pages/chat-detail/chat-detail';
import { OptionsPage } from '../pages/options/options';

/* Providers */
import { AuthProvider } from '../providers/auth-provider/auth-provider';
import { ChatsProvider } from '../providers/chats-provider/chats-provider';
import { UserProvider } from '../providers/user-provider/user-provider';
import { UtilProvider } from '../providers/utils';


// Store Firebase Config Object
export const firebaseConfig = {
  // Please enter your Firebase details here
  apiKey: "AIzaSyD4Td-hTLDhlGh2oz2Hl_vA2tJzCrlAGHI",
  authDomain: "soas-lea-testing.firebaseapp.com",
  databaseURL: "https://soas-lea-testing.firebaseio.com",
  projectId: "soas-lea-testing",
  storageBucket: "soas-lea-testing.appspot.com",
  messagingSenderId: "58372507116"
};

/**
 * AngularFire2 Settings: we are using the
 * Email and Password provider for authentication
 */
const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    UsersPage,
    ChatsPage,
    AccountPage,
    ChatViewPage,
    SignupPage,
    ResetPasswordPage,
    LicensesPage,
    PrivacyPolicyPage,
    TermsServicePage,
    ChatDetailPage,
    OptionsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    UsersPage,
    ChatsPage,
    AccountPage,
    ChatViewPage,
    SignupPage,
    ResetPasswordPage,
    LicensesPage,
    PrivacyPolicyPage,
    TermsServicePage,
    ChatDetailPage,
    OptionsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
  AuthProvider, ChatsProvider, UserProvider, UtilProvider, Storage]
})
export class AppModule {}
