
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/1_login/1_login';
import { SignupPage } from '../pages/3_signup/3_signup';
import { HomePage } from '../pages/5_home/5_home';
import { ListsPage } from '../pages/6_lists/6_lists';
import { ListPage } from '../pages/7_list/7_list';
import { PublicatedListNoShopperPage } from '../pages/10_publicated_list_no_shopper/10_publicated_list_no_shopper';
import { PublicatedListNoShopperPovShopperPage } from '../pages/10B_publicated_list_no_shopper_pov_shopper/10B_publicated_list_no_shopper_pov_shopper';
import { PublicatedListWithShopperPage } from '../pages/11_publicated_list_with_shopper/11_publicated_list_with_shopper';
import { PublicatedListWithShopperPovShopperPage } from '../pages/11B_publicated_list_with_shopper_pov_shopper/11B_publicated_list_with_shopper_pov_shopper';
import { PublicatedListProductsPage } from '../pages/12_publicated_list_products/12_publicated_list_products';
import { AddOrShowItemPage } from '../pages/13A_specific_product_demander/13A_specific_product_demander';
import { SpecificProductShopperPage } from '../pages/13B_specific_product_shopper/13B_specific_product_shopper';
import { PublicatedListCandidatesPage } from '../pages/14_publicated_list_candidates/14_publicated_list_candidates';
import { CandidateInfoUnacceptedPage } from '../pages/16_candidate_info_unaccepted/16_candidate_info_unaccepted';
import { UserProfilePage } from '../pages/17_user_profile/17_user_profile';
import { UserProfilePovOtherUsersPage } from '../pages/17B_user_profile_pov_other_users/17B_user_profile_pov_other_users';
import { DoShoppingPage } from '../pages/18A_do_shopping/18A_do_shopping';
import { ChatPage } from '../pages/19_chat_list/19_chat_list';
import { HistoryPage } from '../pages/22_history/22_history';
import { AddressViewPage } from '../pages/29_address_view/29_address_view';

import { TabsPage } from '../pages/tabs/tabs';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyDNIp5Lc0niVP3-G52b5ylvPiZ-bZLCH1Q",
  authDomain: "feasy-144313.firebaseapp.com",
  databaseURL: "https://feasy-144313.firebaseio.com",
  storageBucket: "feasy-144313.appspot.com",
  messagingSenderId: "921392403918"
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    ListsPage,
    ListPage,
    PublicatedListNoShopperPage,
    PublicatedListNoShopperPovShopperPage,
    PublicatedListWithShopperPage,
    PublicatedListWithShopperPovShopperPage,
    PublicatedListProductsPage,
    SpecificProductShopperPage,
    PublicatedListCandidatesPage,
    CandidateInfoUnacceptedPage,
    UserProfilePage,
    UserProfilePovOtherUsersPage,
    AddOrShowItemPage,
    DoShoppingPage,
    ChatPage,
    HistoryPage,
    AddressViewPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    ListsPage,
    ListPage,
    PublicatedListNoShopperPage,
    PublicatedListNoShopperPovShopperPage,
    PublicatedListWithShopperPage,
    PublicatedListWithShopperPovShopperPage,
    PublicatedListProductsPage,
    SpecificProductShopperPage,
    PublicatedListCandidatesPage,
    CandidateInfoUnacceptedPage,
    UserProfilePage,
    UserProfilePovOtherUsersPage,
    PublicateListPage,
    AddOrShowItemPage,
    DoShoppingPage,
    ChatPage,
    HistoryPage,
    AddressViewPage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {

}
