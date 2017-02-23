<<<<<<< HEAD
﻿import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, GoogleMapsMarker, GoogleMapsMarkerOptions } from 'ionic-native';
=======
import { Component } from '@angular/core';

import { NavController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';
>>>>>>> dani

import { DoShoppingFiltersPage } from '../18C_do_shopping_filters/18C_do_shopping_filters';


@Component({
  selector: 'page-doshopping',
  templateUrl: '18A_do_shopping.html'
})
<<<<<<< HEAD
export class DoShoppingPage {

  map: GoogleMap;

  constructor(public navCtrl: NavController, public platform: Platform) {
    platform.ready().then(() => {
      this.loadMap();
    });
  }

  loadMap() {

    let location = new GoogleMapsLatLng(41.9027835, 12.4963655);

    this.map = new GoogleMap('map', {
      'backgroundColor': 'white',
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': true,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'latLng': location,
        'tilt': 30,
        'zoom': 15,
        'bearing': 50
      }
    });

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      console.log('Map is ready!');

      // create new marker
      let markerOptions: GoogleMapsMarkerOptions = {
        position: location,
        title: 'BAILAAA'
      };

      this.map.addMarker(markerOptions)
        .then((marker: GoogleMapsMarker) => {
          marker.showInfoWindow();
        });

    });

  }
=======

export class DoShoppingPage {
 constructor(public navCtrl: NavController) {

 }

 filters(): void {
    console.log("apply filter on map");
    this.navCtrl.push(DoShoppingFiltersPage);
  }

>>>>>>> dani
}