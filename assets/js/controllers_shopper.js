﻿angular.module('app.controllers.shopper', [])
  
  // 12_lista_prodotti_gia_pubblicata.html
  .controller('ProductsPublicatedListShopperCtrl', function ($scope, $rootScope, $state, UserService, DataExchange, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicHistory) {

    $scope.list = $rootScope.shopper_list;

    $scope.view_product_details = function (product) {
      $state.go('tabsController.ElementDetailsShopper', { ProductId: product.objectId });
    }

  })
  
  // 13_prodotto_specifico_demander.html
  .controller('ElementDetailsShopperCtrl', function ($scope, $rootScope, $state, UserService, DataExchange, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicHistory) {

    $scope.product = { unit: {} };

    $scope.product_idx = arrayObjectIndexOf($rootScope.shopper_list.items, $state.params.ProductId, "objectId");
    $scope.units = getUnitsNames();

    $scope.product = angular.copy($rootScope.shopper_list.items[$scope.product_idx]);
    if ($scope.product.unit == null)
      $scope.product.unit = {};

  })
  
  // 18A_fai_la_spesa.html
  .controller('FindListOnMapCtrl', function ($scope, $rootScope, $state, $compile, UserService, DataExchange, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicHistory, $cordovaGeolocation) {

    var map;
    var infoWindow = new google.maps.InfoWindow();
    var options = { timeout: 10000, enableHighAccuracy: true };
    var markers = {};

    $scope.$on("$ionicView.enter", function (event, data) {
      if (map == null) {
        if (my_lat == null || my_lng == null) {
          $ionicLoading.show({
            content: 'Finding current location...',
            showBackdrop: false
          });
          geo_localise(function () {
            $ionicLoading.hide();
            create_map(my_lat, my_lng);
          }, function (err) {
            ionic_loading.hide();
            console.warn("Cannot find location: " + err);
            navigator.notification.alert("Impossibile trovare la posizione attuale", function () {
              $ionicHistory.goBack();
            }, "Oops", 'Ok');
          });
        } else {
          create_map(my_lat, my_lng);
        }
      } else {
        google.maps.event.trigger(map, 'resize');
      }
    });

    $scope.open_list = function (geopointId) {
      $rootScope.shopper_list = markers[geopointId].geo_metadata;
      $rootScope.shopper_list.geopoint_id = geopointId;
      $state.go("tabsController.ShopperListView", { confirmed: false });
    }

    // Sets the map on all markers in the array.
    function setMapOnAll(new_map) {
      for (var i in markers) {
        markers[i].setMap(new_map);
      }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
      setMapOnAll(null);
    }

    // Shows any markers currently in the array.
    function showMarkers() {
      setMapOnAll(map);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
      clearMarkers();
      markers = {};
    }

    var add_marker = function (_lat, _lng, geopoint, permanent) {

      var marker = new google.maps.Marker({
        map: map,
        //animation: google.maps.Animation.DROP,
        icon: 'images/map_marker.png',
        position: new google.maps.LatLng(_lat, _lng)
      });

      google.maps.event.addListener(marker, 'click', function () {
        var content = '<button ng-click=\"open_list(\'' + geopoint.objectId + '\')\">Apri lista</button>';
        infoWindow.setContent($compile(content)($scope)[0]);
        infoWindow.open($scope.map, marker);
      }, function (error) {
        console.warn("Could not get location");
      });

      marker.geo_metadata = geopoint.metadata;
      marker.objectId = geopoint.objectId;
      markers[geopoint.objectId] = marker;

    }

    var add_marker_position = function (myLat, myLong, text, permanent) {

      var marker = new google.maps.Marker({
        map: map,
        //animation: google.maps.Animation.DROP,
        icon: 'images/map_marker_circle.png',
        zIndex: 99999999,
        position: new google.maps.LatLng(myLat, myLong)
      });

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(text);
        infoWindow.open($scope.map, marker);
      }, function (error) {
        console.warn("Could not get location");
      });

    }

    var create_map = function (lat, long) {

      $ionicLoading.hide();

      var mapOptions = {
        center: new google.maps.LatLng(lat, long),
        zoom: 15,
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function () {

        //map.addListener('dragend', function () { update_geopoints(); });
        //map.addListener('zoom_changed', function () { update_geopoints(); });
        map.addListener('idle', function () { update_geopoints(); });

        google.maps.event.addListener(map, 'click', function () { infoWindow.close(); });

        add_marker_position(lat, long, "I'm here!", true);

        update_geopoints();

      });
    }

    var update_geopoints = function () {
      console.log("Updating geopoints...");
      //deleteMarkers();
      var bounds = map.getBounds();
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      //console.log("New bounds: (" + ne.lat() + " - " + ne.lng() + ") - (" + sw.lat() + " - " + sw.lng() + ")");
      //condition: "objectId = '1C98DB3E-1968-8124-FFB9-82F23B079100'",
      var geoQuery = {
        searchRectangle: [ne.lat(), sw.lng(), sw.lat(), ne.lng()],
        categories: ["lists"],
        includeMetadata: true
      };
      Backendless.Geo.find(geoQuery, new Backendless.Async(onGeoFind, onGeoError))
    }

    var onGeoFind = function (result) {

      var keys = Object.keys(markers);
      var markers_to_remove = {};
      for (var key_index in keys) {
        markers_to_remove[keys[key_index]] = "";
      }

      console.log("Found " + result.data.length + " geopoints");
      for (var i in result.data) {
        var is_new = true;
        for (var k in markers) {
          if (result.data[i].objectId == markers[k].objectId) {
            is_new = false;
            delete markers_to_remove[k];
            break;
          }
        }
        if (is_new) {
          //console.log("Geopoint: " + i + "> " + JSON.stringify(result.data[i]));
          add_marker(result.data[i].latitude, result.data[i].longitude, result.data[i]);
        }
      }

      for (var marker_to_remove in markers_to_remove) {
        markers[marker_to_remove].setMap(null);
        delete markers[marker_to_remove];
      }

    }

    var onGeoError = function (result) {
      console.log("Cannot update geopoints..." + result.message);
      navigator.notification.alert("Impossibile aggiornare le liste", null, "Oops", 'Ok');
    }

    $scope.goto_list = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $state.go("tabsController.MyListsToDo");
    }

  })

  // 18B_fai_la_spesa.html
  .controller('MyListsToDoCtrl', function ($scope, $rootScope, $state, UserService, DataExchange, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicHistory) {
    
    $scope.$on("$ionicView.enter", function (event, data) {
      $scope.candidatures = current_user.candidatures;
      $scope.accepted_candidatures = current_user.accepted_candidatures;
    });

    $scope.goto_map = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $state.go("tabsController.FindListOnMap");
    }

    $scope.view_candidature = function (candy) {
      $ionicLoading.show({
        content: 'Please wait...',
        showBackdrop: false
      });
      Backendless.Geo.findById(geoQuery, new Backendless.Async(onGeoFind, onGeoError))
      $rootScope.shopper_list = list;
      $state.go("tabsController.ShopperListView", { confirmed: false });
    }

    $scope.view_confirmed_candidature = function (candy) {
      $rootScope.shopper_list = list;
      $state.go("tabsController.ShopperListView", { confirmed: false });
    }

  })

  // 28_spesario_info_lista.html
  .controller('ShopperListViewCtrl', function ($scope, $rootScope, $state, UserService, DataExchange, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicHistory) {

    $scope.list = $rootScope.shopper_list;
    $scope.confirmed = !($state.params.confirmed == null || $state.params.confirmed === false || $state.params.confirmed == "false");

    $scope.list.___class = "ShoppingList";
    $scope.list.active = true;

    $scope.view_products = function () {
      $state.go("tabsController.ProductsPublicatedListShopper");
    }

    $scope.accept_list = function () {
      var candy = new window.Classes.CandidateInfo({
        "birthday": current_user.birthday,
        "gender": current_user.gender,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "full_name": current_user.full_name,
        "nationality": current_user.nationality,
        "profile_pic_url": current_user.profile_pic_url,
        "rating": current_user.rating,
        "accomplished_tasks": current_user.accomplished_tasks,
        "requested_tasks": current_user.requested_tasks,
        "author_first_name": $scope.list.author_first_name,
        "author_last_name": $scope.list.author_last_name,
        "geopoint_id": $scope.list.geopoint_id
      });

      $ionicLoading.show({
        content: 'Please wait...',
        showBackdrop: false
      });

      candy.save(new Backendless.Async(candySaved, candyError));

    }

    var candySaved = function (saved_candy) {
      $ionicLoading.hide();
      //var temp_usr = angular.copy(current_user);
      //if (temp_usr.bidden_lists == null)
      //  temp_usr.bidden_lists = [];
      //temp_usr.bidden_lists.push(new window.Classes.ShoppingList({ "objectId": $scope.list.objectId, "ownerId": $scope.list.ownerId }));
      //if (temp_usr.candidatures == null)
      //  temp_usr.candidatures = [];
      //temp_usr.candidatures.push(saved_candy);
      //var temp_usr = backendlessify_user(temp_usr);
      //Backendless.UserService.update(temp_usr, new Backendless.Async(userUpdated, onError));
    }

    var candyError = function (err) {
      $ionicLoading.hide();
      console.warn("Cannot save candy: " + err.message);
    }

    var userUpdated = function (saved_user) {
      $ionicLoading.hide();
      console.log("user updated, bidden list added");
      console.log(saved_user);
      current_user = saved_user;
      $rootScope.lists = current_user.lists;
      $state.go("tabsController.MyListsToDo");
    }

    var onError = function (err) {
      $ionicLoading.hide();
      console.warn("Cannot update user: " + err.message);
    }

    $scope.withdraw_bid = function () {

    }

  })

  // 18C_fai_la_spesa_filtri.html
  .controller('FilterListOnMapCtrl', function ($scope, $rootScope, $state, UserService, DataExchange, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicHistory) {

  })

  // 27_spesa_selezionata_da_mappa.html
  .controller('ListInfoFromMapCtrl', function ($scope, $rootScope, $state, UserService, DataExchange, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicHistory) {

  })