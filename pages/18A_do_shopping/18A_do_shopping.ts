import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DoShoppingFiltersPage } from '../18C_do_shopping_filters/18C_do_shopping_filters';

declare var google;

@Component({
  selector: 'page-doshopping',
  templateUrl: '18A_do_shopping.html'
})
export class DoShoppingPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController) {

  }

  filters(): void {
    console.log("apply filter on map");
    this.navCtrl.push(DoShoppingFiltersPage);
  }

  ionViewLoaded(){
    this.loadMap();
  }
 
  loadMap(){
 
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
  }

}


