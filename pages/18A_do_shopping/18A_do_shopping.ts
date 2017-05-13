
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
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAoCAYAAAAG0SEsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAADfUlEQVRYR72YX4jMURTH7y7ZFvnzZkWI/ElJyYOkKCJJG+VPiaLlSRTxZhLCEw/7QCkerDJ5Ys3M797fmthaYtmZe36zWyu0S55sm5C1lnHOzJk1zZzZmd/M7H7r087OPed77u/u/d0/q8pWKFSn7nfUq2hyMn8zTkoma5Sx65SGy8qFdvw8oAz8Va6XxN9H8PNH5DG2n1YhWMxZFSoYnKSc+CE07kkXKgHqlPG0Csc3sEsZ0rBCaftSLFAK1AltW1S7nc2OJcq1jZj8TTT1i4H3qi2xkp2LSNs9OGy/RaOygS/K8VZzhQJyYD329JdsUCEGPiv9ei5XypHpnIlP3C8mVgvjPVGBQC1XzJKx18WEXNKvVTPGH1U6vh8Nj+Ow3sW2r3mxEsYe5oqsaHweGow93MYbVNprUtGovKiEXszATl1JvfdSfgbqfNCbwlkoYy+JgaNAnzKxpRw9tnR8J+YM5Xtk4dgDHE2rF3wQg1LAUPGZmiMXjshejLFOOjBil4sBGWgofQsfSOMyLPkR9EY5sWk45HBQDEgzonRPgdejiNxEo+D3HwMb6e99UWwkNLxhK/+KetOxwBiTzx6jCXJTbkQMBNmqPGnbJ/oS2p6jYb8tNhIG7rFNeXKhV/QlnPh5GvZrYiNh4Cnb+BdtxwZ+iL6E9s7S0JwSGwkD31VHfz3b+ZNj14ieGZzYPnzyxGaxMYOON7GdPxm4IfpliHpLMrPypxhAGPikWn0eCFy7CpfjYdGP0PAOo2o42HuQF5CNAa1CvXXp4CIKdzdg/FvRJ4MDONkyinRtEoOyMfBctRU5HLp4bqN9QMofBedR+FUDZ7Bcz+QH5oLrvLa3VCS2LXUweNg5FSfOIuzYXhzKVvzJJ9ox0DbAFbPU1rMsZS4lVAtjuwv/+Vw4IyZVh2EcmbVcSVAwSQvDMyGxclLLaTG1JRZgBwZFg3KhB6IVryQZ2I1JxSdPSeCxOQLz2blEadssm/kgdXWCHezoQzQrXa/86xJhvKvsVobCXQux5wOicTFoRyx00i1Z2m5Hoz9igYLg7STqzWGHCkWrklhEILWhJCq4HucqmaxF40d5hSR0/CRnVVHRrlk4nIWPRYSGFo4eB9E9u+C9HbpSG824SsMu7EDOAkT3b9zdJkTaXhgtTP9IiNgt3DIBCuAE1HACO3FH6dhW/tanlPoH2ay6KsQAaIoAAAAASUVORK5CYII=',
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
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAoCAYAAAAG0SEsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAADfUlEQVRYR72YX4jMURTH7y7ZFvnzZkWI/ElJyYOkKCJJG+VPiaLlSRTxZhLCEw/7QCkerDJ5Ys3M797fmthaYtmZe36zWyu0S55sm5C1lnHOzJk1zZzZmd/M7H7r087OPed77u/u/d0/q8pWKFSn7nfUq2hyMn8zTkoma5Sx65SGy8qFdvw8oAz8Va6XxN9H8PNH5DG2n1YhWMxZFSoYnKSc+CE07kkXKgHqlPG0Csc3sEsZ0rBCaftSLFAK1AltW1S7nc2OJcq1jZj8TTT1i4H3qi2xkp2LSNs9OGy/RaOygS/K8VZzhQJyYD329JdsUCEGPiv9ei5XypHpnIlP3C8mVgvjPVGBQC1XzJKx18WEXNKvVTPGH1U6vh8Nj+Ow3sW2r3mxEsYe5oqsaHweGow93MYbVNprUtGovKiEXszATl1JvfdSfgbqfNCbwlkoYy+JgaNAnzKxpRw9tnR8J+YM5Xtk4dgDHE2rF3wQg1LAUPGZmiMXjshejLFOOjBil4sBGWgofQsfSOMyLPkR9EY5sWk45HBQDEgzonRPgdejiNxEo+D3HwMb6e99UWwkNLxhK/+KetOxwBiTzx6jCXJTbkQMBNmqPGnbJ/oS2p6jYb8tNhIG7rFNeXKhV/QlnPh5GvZrYiNh4Cnb+BdtxwZ+iL6E9s7S0JwSGwkD31VHfz3b+ZNj14ieGZzYPnzyxGaxMYOON7GdPxm4IfpliHpLMrPypxhAGPikWn0eCFy7CpfjYdGP0PAOo2o42HuQF5CNAa1CvXXp4CIKdzdg/FvRJ4MDONkyinRtEoOyMfBctRU5HLp4bqN9QMofBedR+FUDZ7Bcz+QH5oLrvLa3VCS2LXUweNg5FSfOIuzYXhzKVvzJJ9ox0DbAFbPU1rMsZS4lVAtjuwv/+Vw4IyZVh2EcmbVcSVAwSQvDMyGxclLLaTG1JRZgBwZFg3KhB6IVryQZ2I1JxSdPSeCxOQLz2blEadssm/kgdXWCHezoQzQrXa/86xJhvKvsVobCXQux5wOicTFoRyx00i1Z2m5Hoz9igYLg7STqzWGHCkWrklhEILWhJCq4HucqmaxF40d5hSR0/CRnVVHRrlk4nIWPRYSGFo4eB9E9u+C9HbpSG824SsMu7EDOAkT3b9zdJkTaXhgtTP9IiNgt3DIBCuAE1HACO3FH6dhW/tanlPoH2ay6KsQAaIoAAAAASUVORK5CYII=',
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