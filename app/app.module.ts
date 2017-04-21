
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { KeysPipe } from '../app/pipes';

import { Globals } from '../classes/Globals';

import { LoginPage } from '../pages/1_login/1_login';
import { ForgotPassPage } from '../pages/2_forgot_pass/2_forgot_pass';
import { SignupPage } from '../pages/3_signup/3_signup';
import { SetPersonalDetailsPage } from '../pages/4A_set_personal_details/4A_set_personal_details';
import { SetAddressPage } from '../pages/4B_set_address/4B_set_address';
import { SetPaymentMethodPage } from '../pages/4C_set_payment_method/4C_set_payment_method';
import { ListsPage } from '../pages/6_lists/6_lists';
import { ListPage } from '../pages/7_list/7_list';
import { PublicateListFirstPage } from '../pages/9A_publicate_list/9A_publicate_list';
import { PublicateListSecondPage } from '../pages/9B_publicate_list/9B_publicate_list';
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
import { MapTabsPage } from '../pages/18_tabs/18_tabs';
import { DoShoppingPage } from '../pages/18A_do_shopping/18A_do_shopping';
import { DoShoppingListsPage } from '../pages/18B_do_shopping_lists/18B_do_shopping_lists';
import { DoShoppingFiltersPage } from '../pages/18C_do_shopping_filters/18C_do_shopping_filters';
import { ChatListPage } from '../pages/19_chat_list/19_chat_list';
import { SettingsPage } from '../pages/23_settings/23_settings';
import { EditProfilePage } from '../pages/24_edit_profile/24_edit_profile';
import { PasswordResetPage } from '../pages/25_password_reset/25_password_reset';
import { TermsAndConditionsPage } from '../pages/26_terms_and_conditions/26_terms_and_conditions';
import { HistoryPage } from '../pages/22_history/22_history';
import { ReviewsPage } from '../pages/30_reviews/30_reviews';
import { SingleReviewDisplayPage } from '../pages/31A_single_review_display/31A_single_review_display';
import { SingleReviewInputPage } from '../pages/31B_single_review_input/31B_single_review_input';
import { PaymentPage } from '../pages/32_payment/32_payment';
import { PaymentSummaryPage } from '../pages/33_payment_summary/33_payment_summary';
import { AddressViewPage } from '../pages/29_address_view/29_address_view';
import { ListFromMapPage } from '../pages/28_list_from_map_details/28_list_from_map_details';
import { AddressViewStaticPage } from '../pages/30_address_view_static/30_address_view_static';

import { AddressesFromProfilePage } from '../pages/34_addresses_from_profile/34_addresses_from_profile';
import { SpecificAddressFromProfilePage } from '../pages/35_specific_address_from_profile/35_specific_address_from_profile';
import { AddressesFromEditProfilePage } from '../pages/36_addresses_from_edit_profile/36_addresses_from_edit_profile';
import { SpecificAddressFromEditProfilePage } from '../pages/37_specific_address_from_edit_profile/37_specific_address_from_edit_profile';
import { AddNewAddressPage } from '../pages/38_add_new_address/38_add_new_address';
import { ReviewsToLeavePage } from '../pages/39_reviews_to_leave/39_reviews_to_leave';

import { TabsPage } from '../pages/tabs/tabs';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyB-GTECPmK-YrUDH_-roy0MGXdgUMqgCDc",
  authDomain: "feasy-748cf.firebaseapp.com",
  databaseURL: "https://feasy-748cf.firebaseio.com",
  storageBucket: "feasy-748cf.appspot.com",
  messagingSenderId: "1081025975065"
};

@NgModule({
  declarations: [
    MyApp,
    KeysPipe,
    LoginPage,
    ForgotPassPage, 
    SignupPage,
    SetPersonalDetailsPage,
    SetAddressPage,
    SetPaymentMethodPage,
    ListsPage,
    ListPage,
    PublicateListFirstPage,
    PublicateListSecondPage,
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
    MapTabsPage,
    DoShoppingPage,
    DoShoppingListsPage,
    DoShoppingFiltersPage,
    ListFromMapPage,
    ChatListPage,
    SettingsPage,
    EditProfilePage,
    PasswordResetPage,
    TermsAndConditionsPage,
    HistoryPage,
    ReviewsPage,
    SingleReviewDisplayPage,
    SingleReviewInputPage,
    PaymentPage,
    PaymentSummaryPage,
    AddressViewPage,
    AddressViewStaticPage,
    AddressesFromProfilePage,
    SpecificAddressFromProfilePage,
    AddressesFromEditProfilePage,
    SpecificAddressFromEditProfilePage,
    AddNewAddressPage,
    ReviewsToLeavePage,
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
    ForgotPassPage ,
    SignupPage,
    SetPersonalDetailsPage,
    SetPaymentMethodPage,
    SetAddressPage,
    ListsPage,
    ListPage,
    PublicateListFirstPage,
    PublicateListSecondPage,
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
    MapTabsPage,
    DoShoppingPage,
    DoShoppingListsPage,
    DoShoppingFiltersPage,
    ChatListPage,
    ListFromMapPage,
    SettingsPage,
    EditProfilePage,
    PasswordResetPage,
    TermsAndConditionsPage,
    HistoryPage,
    ReviewsPage,
    SingleReviewDisplayPage,
    SingleReviewInputPage,
    AddressViewPage,
    PaymentPage,
    PaymentSummaryPage,
    AddressViewStaticPage,
    AddressesFromProfilePage,
    SpecificAddressFromProfilePage,
    AddressesFromEditProfilePage,
    SpecificAddressFromEditProfilePage,
    AddNewAddressPage,
    ReviewsToLeavePage,
    TabsPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Globals]
})
export class AppModule {

}
