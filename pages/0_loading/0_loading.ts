import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

declare var Backendless: any;
declare var start_splash;
declare var geo_localise;

@Component({
  selector: 'page-loading',
  templateUrl: '0_loading.html'
})
export class LoadingPage {

  public user: any;
  
  constructor(public navCtrl: NavController) {
  }

  //check_login(): void {

  //  //current_user = UserService.getUser();

  //  if (current_user.objectId != undefined) {
  //    $ionicHistory.nextViewOptions({
  //      disableBack: true,
  //      historyRoot: true
  //    });
  //    $state.go('tabsController.Home');
  //  } else {
  //    $ionicHistory.nextViewOptions({
  //      disableBack: true,
  //      historyRoot: true
  //    });
  //    $state.go('Login');
  //  }
  //}

  //start_splash();

  //hide_splash(): void {
  //  try {
  //    (<any>(<any>navigator).splashscreen).hide();
  //  } catch (e) {
  //    console.warn("hide splashscreen err: " + e.message);
  //    //$timeout(hide_splash, 500);
  //  }
  //  $timeout($scope.check_login, 3500);
  //}

  //$timeout(hide_splash, 500);

  //geo_localise();

}
