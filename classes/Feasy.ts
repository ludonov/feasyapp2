/// <reference path="./../../typings/globals/google.maps/index.d.ts" />

import { AlertController } from 'ionic-angular';

export const GoogleApiKey: string = "AIzaSyCkCAGEfkSWp3mWjtq8fIj9vGaMglpbsXE";
export const UnknownMan: string =  "data:image/png;base64,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";
export const UnknownWoman: string = "data:image/png;base64,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";

// UNIT HELPERS
export enum UnitType { Pieces, Grams, Hectograms, Kilograms, Liters };

export function GetUnits(): string[] {
  return ["Pieces", "Grams", "Ettogrammi", "Kilograms", "Liters"];
}

// export function GetUnitNameFromEnum(unit: UnitType): string {
//   if (unit == UnitType.Pieces)
//     return "Pezzi";
//   else if (unit == UnitType.Grams)
//     return "Grammi";
//   else if (unit == UnitType.Hectograms)
//     return "Ettogrammi";
//   else if (unit == UnitType.Kilograms)
//     return "Kilogrammi";
//   else if (unit == UnitType.Liters)
//     return "Litri";
//   else
//     return "";
// }

export function GetUnitNameFromEnum(unit: UnitType): string {
  if (unit == UnitType.Pieces)
    return "Pieces";
  else if (unit == UnitType.Grams)
    return "Grams";
  else if (unit == UnitType.Hectograms)
    return "Ettogrammi";
  else if (unit == UnitType.Kilograms)
    return "Kilograms";
  else if (unit == UnitType.Liters)
    return "Liters";
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



// FEASY CLOUD FUNCTIONS RESPONSE CLASS
export class Config {
  
  public Maintenance: boolean = false;

  constructor() {
  }

}


// FEASY CLOUD FUNCTIONS RESPONSE CLASS
export class CloudFuncResponse {

    public Error: boolean;
    public ErrorMessage: string;

    constructor() {

    }

    public static fromString(s: string): CloudFuncResponse {
        let json = JSON.parse(s);
        let temp: CloudFuncResponse = new CloudFuncResponse();
        if (json.error != null)
            temp.Error = json.error;
        if (json.errorMessage != null)
            temp.ErrorMessage = json.errorMessage;
        return temp;
    }

}

export class FeasyUser {
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
  public Candidatures: Object = {};
  public RegistrationDate: string;
  public DoneAsDemander: number = 0;
  public DoneAsShopper: number = 0;

  constructor(email: string, firstName: string, lastName: string) {
    this.Email = email;
    this.FirstName = firstName;
    this.LastName = lastName;
    this.Gender = GenderType.Male;
    this.Addresses = {};
  }

  public SetImageOrDefault(): void {
    if (this.PhotoURL == null || this.PhotoURL == "") {
      if (this.Gender == GenderType.Male)
        this.PhotoURL = UnknownMan;
      else
        this.PhotoURL = UnknownWoman;
    }
  }
}

export class GenericWithKey {
  public $key: string;
  constructor() {
    
  }
}


export class FeasyList {
  public $key: string;  // runtime
  public owner: string;
  public Name: string;
  public Items: Object;
  public ItemsCount: number;  // runtime
  public Reward: number;
  public PublishedDate: string;
  public CreatedDate: string;
  public TerminatedDate: string;
  public ExpiryDate: ExpiryDateType;
  public PreferredShops: string;
  public MaxValue: number;
  public EstimatedWeight: number;
  public ChosenCandidateKey: string;
  public ChosenCandidatureKey: string;
  public ChosenShopperUid: string;
  public ChosenShopperName: string;
  public DemanderName: string;
  public Comments: string;
  public DeliveryAddresses: Object;
  public ReviewLeft: boolean = false;
  public Publish: boolean;
  public ChatKey: string;

  constructor(name: string) {
    this.Name = name;
    this.Items = {};
    this.DeliveryAddresses = {};
  }
}

export class FeasyItem {
  public $key: string;  // runtime
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
  public $key: string;  // runtime
  public uid: string;
  public DisplayName: string;
  public AddressKey: string;
  public Comment: string;
  public Visualised: boolean = false;
  public ListReferenceKey: string;
  public CandidatureReferenceKey: string;

  constructor() {
    this.Visualised = false;
  }
}

export class Candidature {
  public $key: string;  // runtime
  public ListOwnerUid: string;
  public ListReferenceKey: string;
  public AddressKey: string;
  public Comment: string;
  public Accepted: boolean = false;

  constructor() {
    this.Accepted = false;
  }
}

export class Review {
  public $key: string;  // runtime
  public Rating: number;
  public Title: string;
  public Text: string;
  public UID_Writer: string;
  public WriterName: string;
  public RevieweeUid: string;
  public ListKey: string;

  constructor() {

  }
}

export class Chat {
  public $key: string;  // runtime
  public DemanderName: string;
  public ShopperName: string;
  public DemanderUid: string;
  public ShopperUid: string;
  public LastMessage: Message;   // runtime
  public ListKey: string;
  public Messages: Object;
  public MessagesInOrder: Array<Message>;   // runtime

  constructor() {
    this.Messages = {};
    this.MessagesInOrder = new Array<Message>();
  }
}

export class Message {
  public $key: string;  // runtime
  public Text: string;
  public Date: Date;  // runtime
  public timestamp: number;
  public OwnerUid: string;

  constructor() {

  }
}

export class DeliveryAddress {
  public $key: string;  // runtime
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
  public GeopointKey: string;

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
  let obj2: any = {};
  Object.assign(obj2, obj);
  for (let p in obj2) {
    if (obj2[p.toString()] == undefined || p.indexOf('.') != -1 || p.indexOf('#') != -1 || p.indexOf('$') != -1 || p.indexOf('/') != -1 || p.indexOf('[') != -1 || p.indexOf(']') != -1 || typeof (obj2[p.toString()]) == "function")
      delete obj2[p.toString()];
  }
  return obj2;
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
