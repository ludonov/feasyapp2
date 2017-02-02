import { Component } from '@angular/core';

import { LoginPage } from '../1_login/1_login';
import { HomePage } from '../5_home/5_home';
import { ListsPage } from '../6_lists/6_lists';
import { DoShoppingPage } from '../18A_do_shopping/18A_do_shopping';
import { ChatPage } from '../19_chat_list/19_chat_list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = ListsPage;
  tab3Root: any = DoShoppingPage;
  tab4Root: any = ChatPage;

  constructor() {

  }
}
