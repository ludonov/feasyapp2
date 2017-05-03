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

  constructor(email: string, firstName: string, lastName: string) {
    this.Email = email;
    this.FirstName = firstName;
    this.LastName = lastName;
    this.Gender = GenderType.Male;
    this.Addresses = {};
  }

  public SetImageOrDefault(): void {
    if (this.PhotoURL == null || this.PhotoURL == "") {
      if (this.Gender == GenderType.Female)
        this.PhotoURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAe4AAAHyCAMAAAAa3d2EAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURe+ex+ulx+6gx+6iyO+lyO6kye6lyu6ky+2myO6my++nzO+nze6oyu+qye+pze+pzu6rzO6rzu+sy+6sze+sz++uzu+wz++01PKlx/Gmx/CkyPGlyfCkyvGky/CmyfGmyvCmy/ClzPGmzPGmzfCoy/CqyvKry/OpzPCozfGozvGpz/CqzPGrzfCqzvGqz/Gsy/KtzPGszvOtz/GuzfCuz/Stz/Or0PGs0PKv0PCv0fSu0PCw0PKx0fGw0vGx0/Oy0PGy0fGy0vGy1PK00/G20vK30/K11PK11vG21PK21fK31/S10vW20/S11PG41PK41vK61fO71vK61/K81vK91/O/1vS60/S51fS51/S81/K42PK72PK82fK+2PO+2vS52fW62PW92PS+2PS/2fS/2/TA1/LA2fPB2vPC2PPD2/PB3PPG2/PG3fPH3vXA2vbB2/TD2fTC2/XA3PTC3PTE2vXF2/TE3PXE3fXE3vTG3PfH3fXG3vTI3fbJ3vXI3/TK3vXL3/TG4PXJ4PXK4fXM4PfN4ffN4/XO4PbP4vbP5PjP4fjO4vXQ4vbQ4/TS4/bS5PbT5/bU5fbV5vbW5ffW5vfU6Pba6Pfb6ffb6vfc6vff7PjR5vjT5fjW5vjW5/jV6fjX6PjX6vjY5/nb5/jZ6PjY6fna6fna6vnd6fjc6vjc6/je6vne7Pne7ffh7frg6/rj6/ng7fnh7vrj7fji7vni7/rl7Prk7vrm7/zi7/ri8Pnk8Pvl8fvn8Pnm8fvn8vzm8vrp8fno8vnq8frq8vvq9Pvr9fvs8fvs8/vv8/rt9Pns9fru9fzo8fzo8/zr8/zt8vzt9P3t9/3u9fzv9vvw9vv19/zw9Pzw9/zz9P3y9v309/7x+Pzy+P7y+f71+P30+f71+vz2+P32+f32+v32+/70/Pv5+vv7+/v5/P35+Pz4+f34+v/5+/36+/34/P75/f34/v37/Pz6/f76/v38+v79+/z8/P38/f/9/v78//7+/P7+/f3+/v7+/wAAADyb6v0AAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4wLjEyQwRr7AAAH95JREFUeF7tnQ98VdddwJ9OLk2GFX3gnz5CDre39j7vzUtOloqaWpNlzcS5hm7RsnVsOubqn9ktdgMRVjClK85lCKJjypAhA6GZCjMyRwdSmcYatuEyF8foShnzz2iocX9emnfOZ+d373lJCElIIO/d3+/e82VAtgG593zf73f+n5PyDQnC6E4URneiMLoThdGdKFJ+Tn9lSAAmuhOF0Z0ojO5EYXQnCqM7URjdicLoThRGd6IwuhOF0Z0ojO5EYXQnihT39FeGBGCiO1EY3YkiZaa7k4SJ7kRhdCcKoztRGN2JwuhOFEZ3ojC6E4XRnSiM7kRhdCcKoztRpDwzaJ4gTHQnCrMDNFGYCdBEYZJ5ojC6E4XRnSiM7kRhdCcKoztRpPxa/ZUhAZjoThQps2coSaRMLk8SJpknCqM7URjdicLoThRGd6IwuhOF0Z0ojO5EYXQnilStGUVNECa6E4XRnSiM7kRhdCcKoztRGN2JIpX7cf2VIQGY6E4URneiMLoThdGdKIzuRJHyzRRJgjDRnSjMHrFEYaI7UaR8rr8yJACTzBOFSeaJwuhOFClTdScJE92JwuhOFEZ3ojD97kRhojtRGN2JwuhOFEZ3okjlFumvDAnAjKolCpPME4XRnSiM7kRhdCcKoztRGN2JwuhOFEZ3ojDDLInCRHeiMLoThdGdKBKg2zNbmkcxm4YSRWKSOZ+G8A8Ev8aclJ/WX8UXEOo51WwCVZplt7vZXFF6zIlxdAf+wDTLMKehdfX6zbv3Hty168De7X/47l/7vcd37D906EMf2/MHnR0PvoY7jNke/OHi38vBL/Ejjrr1cqycEqc0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";
      else
        this.PhotoURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfEAAAHyCAMAAADMeAfhAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURV3K52fK52DI62HK6GHK6mbK6WbK6mfL62bM6GbM6mXM62jM5mjO52/N52zO52jL6GjK6mnL62rL7GvN6GnM6WrN6mjM62rO6GrO6mnM7G7L6m7M6G3M6mzO6G7O6mzO627N7W7O7G/O7m7Q63HM6XLN6nDO6HHO6XDO6nHO63DN7HDO7XLP7nTP6nTP7HTO7nHQ6XHQ6nPR63LS63HQ7HLR7XHQ7nTQ6XXR6nXQ63bQ7HbQ7nfS7HnQ63vT63nQ7HrS7HrS7n3S633S7HzT7n7U633U7ILT6oLT7oLU7IDU7oHU74LW7oXU7IXU7oXW7YXW7onV7YjW7YrX7ovX743X7orY7o3Y7YzY7o/a74DU8IXV8IrW8I7Z8JHZ75Ha7ZPa7pXZ7pTb75jb7pjc75ve75zd75/e75HZ8ZPZ8pLa8JLa8pbb8JXc8JXc8pja8Jnc8Jvc8pve8Zre85zc8Z/d8p3e8J/g8qHe8KLf8qHf9KTf8aXe8qLg76Lg8qXg8qfi8qfi9Kjh8qni8Kni8qjg9Kzh8q7j8a7i863i9K7k8q/k9LDj9LDj9rDk8bLk87Hk9bHk9rTj87Tl87fn87Xk9LXm9Lbm9bfm9rnm9Lnn9rzn97ro9bno9r3o9b3o9r/p977q973o+MHp9cPp9sPr9cHq9sTq9MXq9sXq98bs9sXr+Mjq9srs9svt98zs9s3u98ns+M3t+M3u+M7u+9Lv9dLu99Ht+NDu+NHu+dPv+tTv+NLw+NLw+tTw+Nbx+tby+Nby+tbx/Njx+Njw+tny+Nry+tvx/Nr0+9zy+d7y+t/z/N/0+d30+tz1/OHz+uL1+eL0+uP0/Ob1+uf2+eX2+uT1/OX2/ej1++j3+uj2/Oj3/uz3++r4+er4+uv5/O74+u76+u34/O75/+z6/fD3/fD4+/D6+/H5/PH5/vH6/PP7/vP8+/L8/fL8/vX7+/T5/fX6/fb7/vb8/PX8/vr7/fr7//n8/Pj8/vj+/Pr+/v39/f39/v7+/P7+/gAAAOX90R0AAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4wLjEyQwRr7AAAHgRJREFUeF7tnQ18lddZwDcdK6/T5cbmPe01N2Gvtbz38ELGyd593Owj6W5lgwplwXZxKpuVfYjMYWUYdDaa0Y3WTpiTImjTzvmjZBVwxSFoR+s6sLDNLU6Yy3Rj8XN3nQpFGtPc+/Oc8z75JAlJuPd9n+ee81+Fbv4g733+9znnOZ/vi7jFLKxx07DGTcMaNw1r3DSscdOwxk3DGjeM0Bo3DWvcNKxx07DGDSNrjZuGNW4a1rhpWOOmYY2bhjVuGL41bhrWuGlY46ZhjZuGNW4a1rhpWOOmYY2bhjVuGta4aVjjpmGNm4Y1bhrWuGlY44ZhV0tNw55JMQ5r3DSscdOwxk3DGjcNa9w0rHHTsMZNwxo3DWvcMOycm3FY46ZhjRtGYI2bhjVuGta4aVjjpmGNm4Y1bhrWuGlY46ZhjZuGNW4a1rhpWOOmYY0bhl1JMQ5r3DSscdOwxk3DGjcNa9w0rHHTsMZNwxo3DWvcNKxxw7CzrMZhjZuGNW4a1rhpWOOmYY0bhr0xwDTs6Mw4rHHTsMZNwxo3DWvcNKxxw7C1unFY44aRtcYNw7bqxmGNm4Y1bhrWuGlY46ZhjZuGNW4a1rhpWOOmYYzxJfC7r/7JZjmP/mmE/5kH437lPIx+G/mv1YQxxqXdEZRvczGsVYfcnYkor+W3okq/F6b2437IRXMYijFy6heV/iPfCmu8apBmOfdcxhzHYSPIf38pc+s89f8OpWxfd/jVh2+YcV8o1U5tY27Vug9s++ieRw4cPHZccuzggZ49239907oVuUxqAXOV9+rs7w0yLhV6bg3L5td39RzvGxgsTcnlgdOHdm9pz6Ud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";
    }
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
  public $key: string;
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
  public $key: string;
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
  public $key: string;
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
  public $key: string;
  public Rating: number;
  public DemanderName: string;
  public ShopperName: string;
  public DemanderUid: string;
  public ShopperUid: string;
  public LastMessage: string;
  public ListKey: string;

  constructor() {

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

export function ResizeImage(imgSrc: string): Promise<string> {

  return new Promise((resolve, reject) => {
    try {

      // create an off-screen canvas
      var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
      var cw = canvas.width;
      var ch = canvas.height;

      // limit the image size
      var maxW = 500;
      var maxH = 500;

      var img = new Image;
      img.onload = function () {
        var iw = img.width;
        var ih = img.height;
        var scale = Math.min((maxW / iw), (maxH / ih));
        var iwScaled = iw * scale;
        var ihScaled = ih * scale;
        canvas.width = iwScaled;
        canvas.height = ihScaled;
        ctx.drawImage(img, 0, 0, iwScaled, ihScaled);
        resolve(canvas.toDataURL());
      }
      img.src = imgSrc;

    } catch (e) {
      let err: Error = new Error("Error resizing image: " + e);
      reject(err);
    }
  });
}
