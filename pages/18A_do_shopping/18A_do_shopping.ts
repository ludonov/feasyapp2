﻿
﻿import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, ViewController, Alert, AlertController, LoadingController, Loading, Platform } from 'ionic-angular';

import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';

import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker, GoogleMapsAnimation } from '@ionic-native/google-maps';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { FeasyUser, FeasyList, GeoPoint, DeliveryAddress } from '../../classes/Feasy';

import { DoShoppingListsPage } from '../18B_do_shopping_lists/18B_do_shopping_lists';
import { DoShoppingFiltersPage } from '../18C_do_shopping_filters/18C_do_shopping_filters';
import { ListFromMapPage } from '../28_list_from_map_details/28_list_from_map_details';

import { Globals } from '../../classes/Globals';


@Component({
  selector: 'page-doshopping',
  templateUrl: '18A_do_shopping.html'
})

export class DoShoppingPage {

  autocompleteItems;
  autocomplete;
  service = new google.maps.places.AutocompleteService();

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

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private zone: NgZone, private platform: Platform, public geolocation: Geolocation, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public globals: Globals, public diagnostic: Diagnostic) {
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

    // autocomplete
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
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

        /*
        // Create the search box and link it to the UI element.
        let input: HTMLElement = document.getElementById('pac-input');
        let searchBox = new google.maps.places.SearchBox(<HTMLInputElement>input);
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

        // Bias the SearchBox results towards current map's viewport.
        this.map.addListener('bounds_changed', () => {
          searchBox.setBounds(this.map_browser.getBounds());
        });

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', () => {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach((place) => {
            if (!place.geometry) {
              console.warn("Returned place contains no geometry");
              return;
            }

            console.log("New place: " + place.name);
            console.log("Location: " + place.geometry.location);

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          this.map_browser.fitBounds(bounds);

        });
        */

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

  dismiss() {
    console.log("dismiss");
    if (!this.is_web)
      this.map.setClickable(true);
  }

  chooseItem(item: any) {
    console.log("Address chosen: " + item);
    let addr: DeliveryAddress = new DeliveryAddress();
    addr.StreetName = item;
    addr.Geocode(this.alertCtrl).then((val) => {
      if (val) {
        this.autocompleteItems = [];
        if (this.is_web) {
          this.map_browser.setCenter(new google.maps.LatLng(addr.Latitude, addr.Longitude));
        } else {
          this.map.setCenter(new LatLng(addr.Latitude, addr.Longitude));
          this.map.setClickable(true);
        }
        (<HTMLInputElement>document.querySelector("#searchBar input")).value = item;
      }
    })
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    this.service.getPlacePredictions({ input: this.autocomplete.query }, (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        if (predictions != null)
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction.description);
          });
        if (!this.is_web)
          this.map.setClickable(false);
      });
    });
  }

}