// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var current_user;

var cordova_file, cordova_file_transfer;
var ionic_loading, ionic_history;

var my_lat = null;
var my_lng = null;

var UserStorage = function () { return Backendless.Persistence.of(Backendless.User) };
var AddressInfoStorage = function () { return Backendless.Persistence.of(window.Classes.AddressInfo) };
var PaymentInfoStorage = function () { return Backendless.Persistence.of(window.Classes.PaymentInfo) };
var ShoppingListStorage = function () { return Backendless.Persistence.of(window.Classes.ShoppingList) };
var ShoppingItemStorage = function () { return Backendless.Persistence.of(window.Classes.ShoppingItem) };
var MeasureUnitsStorage = function () { return Backendless.Persistence.of(window.Classes.MeasureUnits) };
var CandidateInfoStorage = function () { return Backendless.Persistence.of(window.Classes.CandidateInfo) };

angular.module('app', ['ionic', 'app.controllers.general', 'app.controllers.demander', 'app.controllers.shopper', 'app.routes', 'app.services', 'app.directives', 'ngCordova'])

.run(function ($ionicPlatform, $ionicLoading, $ionicLoading, $cordovaFile) {

  $ionicPlatform.ready(function () {

    console.log("Feasy is ready");



    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      console.log("keyboard stuff");
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //ionic.Platform.isFullScreen = true;

    try {
      if (window.cordova.platformId == "browser") {
        facebookConnectPlugin.browserInit("167576887016557", "v2.7");
        // version is optional. It refers to the version of API you may want to use.
      }
    } catch (e) {
      console.log("cannot init facebookConnectPlugin");
    }

    ionic_loading = $ionicLoading;
    cordova_file = $cordovaFile;

    $cordovaFile.getFreeDiskSpace()
      .then(function (success) {
        console.log("free space left: " + success);
      }, function (error) {
        console.log("free space query failed: " + error);
        // error
      });

  });

});
