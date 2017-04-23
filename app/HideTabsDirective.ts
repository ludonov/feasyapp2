import { Directive } from '@angular/core';
import { ViewController } from 'ionic-angular';


@Directive({
  selector: '[hideTabs]'
})
export class HideTabsDirective {
  constructor(private viewCtrl: ViewController) {
    // hide tabs when view loads
    this.viewCtrl.willEnter.subscribe(() => {
      let tabs = document.querySelectorAll('.tabbar');
      let footer = document.querySelectorAll('.footer');
      let scrollContent = document.querySelectorAll('.scroll-content');
      if (tabs !== null) {
        Object.keys(tabs).map((key) => {
          tabs[key].style.transform = 'translateY(56px)';
        });

        // fix for removing the margin if you got scorllable content
        setTimeout(() => {
          Object.keys(scrollContent).map((key) => {
            scrollContent[key].style.marginBottom = '0';
          });
          Object.keys(footer).map((key) => {
            footer[key].style.bottom = '0px';
          });
        })
      }
    });

    // show tabs when view exits
    this.viewCtrl.willLeave.subscribe(() => {
      let tabs = document.querySelectorAll('.tabbar');
      if ( tabs !== null ) {
        Object.keys(tabs).map((key) => {
          tabs[ key ].style.transform = 'translateY(0)';
        });
      } // end if
    });
  }
}