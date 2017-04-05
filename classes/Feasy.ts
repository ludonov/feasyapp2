/// <reference path="./../../typings/globals/google.maps/index.d.ts" />

import { AlertController } from 'ionic-angular';

export const GoogleApiKey: string = "AIzaSyCkCAGEfkSWp3mWjtq8fIj9vGaMglpbsXE";


// UNIT HELPERS
export enum UnitType { Pieces, Grams, Hectograms, Kilograms, Liters };

export function GetUnits(): string[] {
  return ["Pezzi", "Grammi", "Ettogrammi", "Kilogrammi", "Litri"];
}
export function GetUnitNameFromEnum(unit: UnitType): string {
  if (unit == UnitType.Pieces)
    return "Pezzi";
  else if (unit == UnitType.Grams)
    return "Grammi";
  else if (unit == UnitType.Hectograms)
    return "Ettogrammi";
  else if (unit == UnitType.Kilograms)
    return "Kilogrammi";
  else if (unit == UnitType.Liters)
    return "Litri";
  else
    return "";
}



// GENDER HELPERS
export enum GenderType { Male, Female };

export function GetGenders(): string[] {
  return ["Uomo", "Donna"];
}
export function GetGenderNameFromEnum(gender: GenderType): string {
  if (gender == GenderType.Male)
    return "Uomo";
  else if (gender == GenderType.Female)
    return "Donna";
  else
    return "";
}
export function GetEnumFromGenderName(gender: any): any {
      
      if (gender == "Uomo"){
          return 0;
      } else if (gender == "Donna") {
          return 1;
      } else {
          return 0;
      }

  }


// EXPIRY DATES HELPER
export enum ExpiryDateType { Today, Tomorrow, InThreeDays, InOneWeek, InTwoWeeks};

export function GetExpiryDates(): string[] {
  return ["Stasera", "Domani sera", "Tra 3 giorni", "Tra una settimana", "Tra due settimane"];
}
export function GetExpiryDateFromEnum(expiryDate: ExpiryDateType): string {
  if (expiryDate == ExpiryDateType.Today)
    return "Stasera";
  else if (expiryDate == ExpiryDateType.Tomorrow)
    return "Domani sera";
  else if (expiryDate == ExpiryDateType.InThreeDays)
    return "Tra 3 giorni";
  else if (expiryDate == ExpiryDateType.InOneWeek)
    return "Tra una settimana";
  else if (expiryDate == ExpiryDateType.InTwoWeeks)
    return "Tra due settimane";
  else
    return "";
}

export class FeasyUser {
  public $key: string;
  public Email: string;
  public Username: string;
  public FirstName: string;
  public LastName: string;
  public DisplayName: string;
  public Password: string;
  public Nationality: string;
  public Birthdate: string;
  public MobileNumber: string;
  public PhotoURL: string;
  public Gender: GenderType = GenderType.Male;
  public Rating: number;
  public Addresses: Object;
  public CommissionsDone: number;
  public CommissionsReceived: number;

  constructor(email: string, firstName: string, lastName: string) {
    this.Email = email;
    this.FirstName = firstName;
    this.LastName = lastName;
    this.Gender = GenderType.Male;
    this.Addresses = {};
  }
}

export class PlainAddress {
  public $key: string;
  public FormattedAddress: string;
  public Nation: string;
  public City: string;
  public StreetName: string;
  public PostCode: string;
  public Latitude: number;
  public Longitude: number;

  constructor() {

  }

}

export class FeasyList {
  public $key: string;
  public owner: string;
  public Name: string;
  public Items: Object;
  public ItemsCount: number;
  public Reward: number;
  public PublishedDate: string;
  public CreatedDate: string;
  public ExpiryDate: ExpiryDateType;
  public PreferredShops: string;
  public MaxValue: number;
  public EstimatedWeight: number;
  public ChosenCandidateKey: string;
  public Comments: string;
  public DeliveryAddresses: Object;

  constructor(name: string) {
    this.Name = name;
    this.Items = {};
    this.DeliveryAddresses = {};
  }
}

export class FeasyItem {
  public $key: string;
  public Name: string;
  public Qty: number;
  public Brand: string;
  public PriceRange: string;
  public Comments: string;
  public Unit: UnitType;

  constructor(name: string, qty: number) {
    this.Name = name;
    this.Qty = qty;
  }
}

export class Candidate {
  public uid: string;
  public DisplayName: string;
  public AddressKey: string;
  public Comment: string;
  public Visualised: boolean = false;

  constructor() {
    this.Visualised = false;
  }
}

export class Candidature {
  public $key: string;
  public ListOwnerUid: string;
  public ListReferenceKey: string;
  public CandidateReferenceKey: string;
  public AddressKey: string;
  public Comment: string;
  public Accepted: boolean = false;

  constructor() {
    this.Accepted = false;
  }
}

export class DeliveryAddress {
  public $key: string;
  public Name: string;
  public FormattedAddress: string;
  public Nation: string;
  public City: string;
  public StreetName: string;
  public PostCode: string;
  public Comments: string;
  public Latitude: number;
  public Longitude: number;
  public Active: boolean;
  public From: string;
  public To: string;

  public toString(): string {
    let street_name: string = this.StreetName ? this.StreetName + ", " : "";
    var post_code: string = this.PostCode ? this.PostCode + " " : "";
    var city: string = this.City ? this.City + ", " : "";
    var nation: string = this.Nation ? this.Nation : "";
    return street_name + post_code + city + nation;
  }

  public Geocode(alertCtrl: AlertController): Promise<boolean> {

    return new Promise((resolve, reject) => {

      let geocoder = new google.maps.Geocoder();

      // Geocode the address
      geocoder.geocode({ address: this.toString() }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        try {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results.length == 1 && (results[0].geometry.location.lat() == null || results[0].geometry.location.lng() == null)) {
              console.warn("geocode() error: lat or lng is null, but status OK");
              reject(new Error("Geocode error: lat or lng is null, but status OK"));
            }
            this.ParseGeocode(results, status, alertCtrl)
              .then((res: boolean) => resolve(res))
              .catch((err: Error) => reject(err));
          }
          else {
            console.warn("geocode() error: status not OK, but " + status.toString());
            if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
              reject(new Error("Nessun risultato trovato. Ricontrollare le informazioni inserite e riprovare."));
            } else {
              reject(new Error("Errore nella verifica dell'indirizzo: " + status));
            }
          }
        } catch (errdata) {
          console.warn("geocode() catch error: " + errdata);
          reject(new Error("geocode() catch error: " + errdata));
        }
      });
    });
  }

  private ParseGeocode(results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus, alertCtrl: AlertController): Promise<boolean> {

    return new Promise((resolve, reject) => {

      if (results.length > 1) {

        console.log("Found multiple possible addresses");

        let radios: Array<any> = [];

        results.forEach((value: google.maps.GeocoderResult, index: number, array: google.maps.GeocoderResult[]) => {
          radios.push({ name: index.toString(), type: 'radio', label: value.formatted_address, value: index });
        });

        let alert = alertCtrl.create({
          title: 'Quale intendi?',
          inputs: radios,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: data => {
                console.log('Cancel clicked');
                reject(new Error("cancelled"));
              }
            },
            {
              text: 'Ok',
              handler: data => {
                console.log("Chosen: " + radios[data].label);
                this.updateGeodata(results[data]);
                resolve(true);
              }
            }
          ]
        });
        alert.present();

      } else {
        if (results[0].partial_match) {

          console.log("Found partial_match address");

          let alert = alertCtrl.create({
            title: 'Indirizzo incompleto',
            message: "Forse intendevi: " + results[0].formatted_address + " ?",
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                  reject(new Error("cancelled"));
                }
              },
              {
                text: 'Sì',
                handler: () => {
                  console.log('Yes clicked!');
                  this.updateGeodata(results[0]);
                  resolve(true);
                }
              }
            ]
          });
          alert.present();

        } else {
          this.updateGeodata(results[0]);
          resolve(true);
        }
      }
    });
  }

  private updateGeodata(data: google.maps.GeocoderResult): void {
    this.Latitude = data.geometry.location.lat();
    this.Longitude = data.geometry.location.lng();
    this.FormattedAddress = data.formatted_address;
    let street_number: string = "";
    for (var j = 0; j < data.address_components.length; j++) {
      if (data.address_components[j].types[0] == "route")
        this.StreetName = data.address_components[j].short_name;
      else if (data.address_components[j].types[0] == "locality")
        this.City = data.address_components[j].short_name;
      else if (data.address_components[j].types[0] == "country")
        this.Nation = data.address_components[j].long_name;
      else if (data.address_components[j].types[0] == "postal_code")
        this.PostCode = data.address_components[j].short_name;
      else if (data.address_components[j].types[0] == "street_number")
        street_number = data.address_components[j].short_name;
    }
    if (street_number != "")
      this.StreetName += ", " + street_number;
  }
}

export class GeoPoint {
  public $key: string;
  public own: string; //owner uid
  public lst: string; //list uid
  public adr: string; //address key relative to the delivery addresses of the list
  public lat: number; //latitude
  public lng: number; //longitude
  public rew: number; //reward
  public exp: string; //expiry date
  public com: string; //comments
  public cnt: number; //items count

  constructor() {

  }
}


export function StripForFirebase(obj: any): any {
  for (let p in obj) {
    if (obj[p.toString()] == undefined || p.indexOf('.') != -1 || p.indexOf('#') != -1 || p.indexOf('$') != -1 || p.indexOf('/') != -1 || p.indexOf('[') != -1 || p.indexOf(']') != -1 || typeof (obj[p.toString()]) == "function")
      delete obj[p.toString()];
  }
  return obj;
}

export function copyObject<T>(source: T, destination: any): void {

  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      destination[key] = source[key];
    }
  }
}

export function GetRealExpiryDate(expdate: ExpiryDateType): string {
  let now: Date = new Date();
  if (expdate == ExpiryDateType.Today)
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toUTCString();
  else if (expdate == ExpiryDateType.Tomorrow)
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59).toUTCString();
  else if (expdate == ExpiryDateType.InThreeDays)
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 23, 59, 59).toUTCString();
  else if (expdate == ExpiryDateType.InOneWeek)
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59).toUTCString();
  else if (expdate == ExpiryDateType.InTwoWeeks)
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 23, 59, 59).toUTCString();
  else
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 23, 59, 59).toUTCString();
}
