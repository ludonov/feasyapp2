
﻿import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Alert, AlertController, LoadingController, Loading, Platform } from 'ionic-angular';

import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';

import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker, GoogleMapsAnimation } from '@ionic-native/google-maps';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { FeasyUser, FeasyList, GeoPoint } from '../../classes/Feasy';

import { DoShoppingListsPage } from '../18B_do_shopping_lists/18B_do_shopping_lists';
import { DoShoppingFiltersPage } from '../18C_do_shopping_filters/18C_do_shopping_filters';
import { ListFromMapPage } from '../28_list_from_map_details/28_list_from_map_details';

import { Globals } from '../../classes/Globals';


@Component({
  selector: 'page-doshopping',
  templateUrl: '18A_do_shopping.html'
})

export class DoShoppingPage {

  map: GoogleMap;

  @ViewChild('map') mapElement: ElementRef;
  public map_browser: google.maps.Map;
  public map_ready: boolean = false;
  public is_web: boolean = true;
  private markers: Array<Marker> = [];
  private markers_browser: Array<google.maps.Marker> = [];
  private marker_position: Marker;
  private marker_position_browser: google.maps.Marker;
  private infoWindow = new google.maps.InfoWindow({content: ""});

  private geopoints: Object = {};
  private geopoints_db: FirebaseListObservable<any>;
  private no_geopoints: boolean = true;

  constructor(public navCtrl: NavController, private platform: Platform, public geolocation: Geolocation, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public globals: Globals, public diagnostic: Diagnostic) {
    this.is_web = this.platform.is("core");
    this.platform.ready().then(() => {
      if (this.is_web) {
        this.geolocate();
      } else {
        diagnostic.isLocationEnabled().then((data) => {
          this.geolocate();
        }).catch((err: Error) => {
          console.log('Geolocation seems not enabled: ' + err.message);
          let alert: Alert = alertCtrl.create({
            title: 'Info',
            subTitle: "Impossibile trovare la posizione, assicurarsi che la geolocalizzazione sia attiva.",
            buttons: ['Ok']
          });
          alert.onDidDismiss(() => {
            this.loadMap(41.872411, 12.480225, true);
          });
          alert.present();
        });
      }
    });
    this.geopoints_db = globals.af.list('/geopoints');
    this.geopoints_db.subscribe(snapshots => {
      this.geopoints = {};
      snapshots.forEach( (geo: GeoPoint) => {
        this.geopoints[geo.$key] = geo;
        return false;
      });
      this.no_geopoints = Object.keys(this.geopoints).length == 0;
      this.update_geopoints();
    });
  }

  geolocate(): void {

    let loading: Loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Getting location...'
    });
    loading.present();

    this.geolocation.getCurrentPosition({
      timeout: 5000
    }).then(pos => {
      console.log('POSITION OK: lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
      loading.dismiss();
      this.loadMap(pos.coords.latitude, pos.coords.longitude);
    }).catch((err: Error) => {
      console.log('POSITION ERROR: ' + err.message);
      loading.dismiss();
      let alert: Alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Impossibile trovare la posizione, assicurarsi che la geolocalizzazione sia attiva.",
        buttons: ['Ok']
      });
      alert.onDidDismiss(() => {
        this.loadMap(41.872411, 12.480225, true);
      });
      alert.present();
    });
  }

  loadMap(lat: number, lng: number, far: boolean = false) {

    let location = new LatLng(lat, lng);

    if (this.is_web) {

      console.log("Loading map for browser...");
      let latLng = new google.maps.LatLng(lat, lng);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map_browser = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      //Wait until the map is loaded
      google.maps.event.addListenerOnce(this.map_browser, 'idle', () => {
        console.log('Browser Map is ready!');
        this.map_ready = true;
        this.addMarkerPosition(location);
        google.maps.event.addListener(this.map_browser, 'click', () => { this.infoWindow.close(); });
        //this.map_browser.addListener('idle', function () { this.update_geopoints(); });
        this.update_geopoints();
      });

    } else {

      console.log("Loading map for device...");

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
          'tilt': 0,
          'zoom': far ? 5 : 15
        }
      });

      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
        console.log('Mobile Map is ready!');
        this.map_ready = true;

        // create new marker
        //this.addMarker(location, "<h4>I'm here!</h4>", true);
        //this.map.on(GoogleMapsEvent.CAMERA_IDLE).subscribe(() => this.update_geopoints())
        this.update_geopoints();
        
        //this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(() => {
        //  this.CloseAllMarkers();
        //});
      });
    }

  }

  addMarkerPosition(pos: LatLng): void {

    let marker = new google.maps.Marker({
      map: this.map_browser,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(pos.lat, pos.lng)
    });

    google.maps.event.addListener(marker, 'click', () => {
      this.infoWindow.setContent("I'm here!");
      this.infoWindow.open(this.map_browser, marker);
    });
    this.marker_position_browser = marker;
  }

  addMarker(pos: LatLng, key: string, listowner: string): void {

    if (this.is_web) {

      let marker = new google.maps.Marker({
        icon: 'data:image/png;base64,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',
        map: this.map_browser,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(pos.lat, pos.lng)
      });

      this.markers_browser.push(marker);
      google.maps.event.addListener(marker, 'click', () => {
        console.log("Opening web list: " + key);
        this.OpenListAlert(key, listowner);
      });

    } else {

      let markerOptions: MarkerOptions = {
        icon: 'data:image/png;base64,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',
        position: pos,
        animation: GoogleMapsAnimation.DROP
      };

      this.map.addMarker(markerOptions)
        .then((marker: Marker) => {
          //marker.showInfoWindow();
          this.markers.push(marker);
          marker.set("firebase_key", key);
          marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            this.OpenListAlert(key, listowner);
          });
        });
    }
  }

  update_geopoints(): void {
    console.log("Updating geopoints...");
    if (!this.map_ready) {
      console.log("Map is not ready to update geopoints");
    } else {
      this.RemoveAllMarkers();
      Object.keys(this.geopoints).forEach((key: string) => {
        let geo: GeoPoint = this.geopoints[key];
        this.addMarker(new LatLng(geo.lat, geo.lng), key, geo.own);
      });
    }
  }
  
  // Removes all markers
  RemoveAllMarkers(): void {
    if (this.is_web) {
      this.markers_browser.forEach((marker: google.maps.Marker) => {
        marker.setMap(null);
      });
      this.markers_browser.length = 0;
    } else {
      this.markers.forEach((marker: Marker) => {
        marker.remove();
      });
      this.markers.length = 0;
    }
  }
  
  // Closes all markers (only mobile map)
  //CloseAllMarkers(): void {
  //  this.markers.forEach((marker: GoogleMapsMarker) => {
  //    marker.hideInfoWindow();
  //  });
  //}

  //OpenList(marker: GoogleMapsMarker): void {
  //  console.log("Opening mobile list: ");
  //  let key: string = marker.get("firebase_key");
  //  let geo: GeoPoint = this.geopoints[key];
  //  let alert = this.alertCtrl.create({
  //    title: 'Dettagli lista',
  //    message: "Ricompensa: " + geo.rew.toString() + (geo.com == null ? "" : "\r\n" + geo.com),
  //    buttons: [
  //      {
  //        text: 'Indietro',
  //        role: 'cancel',
  //        handler: () => {
  //          this.map.setClickable(true);
  //        }
  //      },
  //      {
  //        text: 'Apri',
  //        handler: () => {
  //          this.map.setClickable(true);
  //          console.log('APRI DETTAGLI LISTA: ' + key);
  //        }
  //      }
  //    ]
  //  });
  //  alert.present().then(() => {
  //    console.log("alert then");
  //  });
  //  this.map.setClickable(false);
  //}

  OpenListAlert(key: string, listowner: string) {

    let geo: GeoPoint = this.geopoints[key];
    let alert = this.alertCtrl.create({
      title: 'Dettagli lista',
      message: "Ricompensa: " + geo.rew.toString() + (geo.com == null ? "" : "\r\n" + geo.com) ,
      buttons: [
        {
          text: 'Indietro',
          role: 'cancel',
          handler: () => {
            if (!this.is_web)
              this.map.setClickable(true);
          }
        },
        {
          text: 'Apri',
          handler: () => {
            if (!this.is_web)
              this.map.setClickable(true);
            console.log('APRI DETTAGLI LISTA: ' + key);
            this.navCtrl.push(ListFromMapPage, { list_key: geo.lst, list_owner: listowner, address_key: geo.adr });
          }
        }
      ]
    });
    alert.present();
    if (!this.is_web)
      this.map.setClickable(false);
  }

  filters(): void {
    console.log("filters");
    this.navCtrl.push(DoShoppingFiltersPage);
  }

  lists(): void {
    console.log("my proposed lists");
    this.navCtrl.setRoot(DoShoppingListsPage);    
  }
}