import { Component } from '@angular/core';


import { DoShoppingPage } from '../18A_do_shopping/18A_do_shopping';
import { DoShoppingListsPage } from '../18B_do_shopping_lists/18B_do_shopping_lists';


@Component({
  templateUrl: '18_tabs.html'
})
export class MapTabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = DoShoppingPage;
  tab2Root: any = DoShoppingListsPage ;

  constructor() {

  }
}
