

type GenderType = "Uomo" | "Donna";

type UnitType = "Grammi" | "Ettogrammi" | "Kilogrammi" | "Pezzi" | "Litri";


export function GetUnits(): string[] {
  return ["Grammi", "Ettogrammi", "Kilogrammi", "Pezzi", "Litri"];
}

export class FeasyUser {
  public $key: string;
  public Email: string;
  public FirstName: string;
  public LastName: string;
  public Password: string;
  public Nationality: string;
  public Birthdate: string;
  public MobileNumber: string;
  public Gender: GenderType = "Uomo";
  public Rating: number;

  constructor(email: string, firstName: string, lastName: string) {
    this.Email = email;
    this.FirstName = firstName;
    this.LastName = lastName;
    this.Gender = "Uomo";
  }
}

export class FeasyList {
  public $key: string;
  public Name: string;
  public Items: Object;
  public ItemsCount: number;
  public Active: boolean;
  public Reward: number;
  public PreferredShops: string;
  public MaxValue: number;
  public EstimatedWeight: string;
  public EstimatedValue: string;
  public Comments: string;
  public DeliveryAddresses: Array<DeliveryAddress>;

  constructor(name: string) {
    this.Name = name;
    this.Items = {};
    this.Active = false;
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

export class DeliveryAddress {
  public $key: string;
  public Name: string;
  public FormattedAddress: string;
  public Nation: string;
  public City: string;
  public StreetName: string;
  public PostCode: string;
  public lat: string;
  public long: string;
  public Active: boolean;
  public DeliveryHours: Array<DeliveryHour>;

  constructor(Name: string, FormattedAddress: string, Nation: string, City: string, StreetName: string, PostCode: string, lat: string, long: string, DeliveryHours: Array<DeliveryHour>, Active: boolean) {
    this.Name = Name;
    this.FormattedAddress = FormattedAddress;
    this.Nation = Nation;
    this.City = City;
    this.StreetName = StreetName;
    this.PostCode = PostCode;
    this.lat = lat;
    this.long = long;
    this.DeliveryHours = DeliveryHours;
    this.Active = Active;
  }
}

export class DeliveryHour {
  public From: number;
  public To: number;
  public Comments: string;

  constructor(from: number, to: number, comments: string) {
    this.From = from;
    this.To = to;
    this.Comments = comments;
  }
}


export function StripForFirebase(obj: any): any {
  for (let p in obj) {
    if (p.indexOf('.') != -1 || p.indexOf('#') != -1 || p.indexOf('$') != -1 || p.indexOf('/') != -1 || p.indexOf('[') != -1 || p.indexOf(']') != -1 || typeof (obj[p.toString()]) == "function")
      delete obj[p.toString()];
  }
  return obj;
}
