import { Component } from '@angular/core';

import { LoginPage } from '../1_login/1_login';
import { ListsPage } from '../6_lists/6_lists';
import { DoShoppingPage } from '../18A_do_shopping/18A_do_shopping';
import { ChatListPage } from '../19_chat_list/19_chat_list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ListsPage;
  tab2Root: any = DoShoppingPage;
  tab3Root: any = ChatListPage;

  constructor() {

  }
}
