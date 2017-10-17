import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LicensesPage } from '../licenses/licenses';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { TermsServicePage } from '../terms-service/terms-service';

@Component({
  selector: 'page-options',
  templateUrl: 'options.html'
})
export class OptionsPage {
  licensesPage = LicensesPage;
  privacyPolicyPage = PrivacyPolicyPage;
  termsServicePage = TermsServicePage;

  constructor(public nav: NavController) {}

  changePage (page){
    this.nav.push(page);
  }
}
