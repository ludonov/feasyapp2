/// <reference path="./../../../typings/globals/google.maps/index.d.ts" />

﻿import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { Geolocation, Geoposition, GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, GoogleMapsMarker, GoogleMapsMarkerOptions, GoogleMapsAnimation } from 'ionic-native';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { FeasyUser, FeasyList, GeoPoint } from '../../classes/Feasy';

import { DoShoppingFiltersPage } from '../18C_do_shopping_filters/18C_do_shopping_filters';


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
  private markers: Array<GoogleMapsMarker> = [];
  private markers_browser: Array<google.maps.Marker> = [];
  private marker_position: GoogleMapsMarker;
  private marker_position_browser: google.maps.Marker;
  private infoWindow = new google.maps.InfoWindow({content: ""});

  private geopoints: Object = {};
  private geopoints_db: FirebaseListObservable<any>;
  private no_geopoints: boolean = true;

  constructor(public navCtrl: NavController, private platform: Platform, public af: AngularFire, public alertCtrl: AlertController) {
    this.is_web = this.platform.is("core");
    this.platform.ready().then(() => {
      Geolocation.getCurrentPosition().then(pos => {
        console.log('POSITION: lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
        this.loadMap(pos);
      }).catch((err: Error) => {
        console.log('POSITION ERROR: ' + err.message);
      });
    });
    this.geopoints_db = af.database.list('/geopoints');
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
  

  loadMap(pos: Geoposition) {

    let location = new GoogleMapsLatLng(pos.coords.latitude, pos.coords.longitude);

    if (this.is_web) {

      console.log("Loading map for browser...");
      let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
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

      console.log("Loading map for device: " + Platform.name);

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

  addMarkerPosition(pos: GoogleMapsLatLng): void {

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

  addMarker(pos: GoogleMapsLatLng, key: string): void {

    if (this.is_web) {

      let marker = new google.maps.Marker({
        map: this.map_browser,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(pos.lat, pos.lng)
      });

      this.markers_browser.push(marker);
      google.maps.event.addListener(marker, 'click', () => {
        console.log("Opening web list: " + key);
        this.OpenListAlert(key);
      });

    } else {

      let markerOptions: GoogleMapsMarkerOptions = {
        position: pos,
        animation: GoogleMapsAnimation.DROP
      };

      this.map.addMarker(markerOptions)
        .then((marker: GoogleMapsMarker) => {
          //marker.showInfoWindow();
          this.markers.push(marker);
          marker.set("firebase_key", key);
          marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            this.OpenListAlert(key);
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
        this.addMarker(new GoogleMapsLatLng(geo.lat, geo.lng), key);
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
      this.markers.forEach((marker: GoogleMapsMarker) => {
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

  OpenListAlert(key: string) {

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
          }
        }
      ]
    });
    alert.present().then(() => {
      console.log("alert then");
    });
    if (!this.is_web)
      this.map.setClickable(false);
  }
}