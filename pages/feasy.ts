export class ShoppingList {

  // feasy variables
  public active: boolean;
  public comments: string;
  public candidates: Array<CandidateInfo>;
  public chosen_candidate: CandidateInfo;
  public delivery_addresses: Array<GeoPoint>;
  public estimated_value: number;
  public estimated_weight: number;
  public items: Array<ShoppingItem>;
  public max_value: number;
  public name: string;
  public preferred_shops: string;
  public reward: number;

  // backendless variables
  public ownerId: string;
  public objectId: string;
  public created: any;
  public updated: any;


  constructor() {

  }

}

export class ShoppingItem {

  public brand: string;
  public name: string;
  public other: string;
  public price_range: string;
  public qty: string;
  public unit: MeasureUnit;

  // backendless variables
  public ownerId: string;
  public objectId: string;
  public created: any;
  public updated: any;

  constructor() {

  }

}

export class MeasureUnit {

  public unit_name: string;

  constructor() {

  }

}

export class CandidateInfo {

  public categories: any;

  // backendless variables
  public ownerId: string;
  public objectId: string;
  public created: any;
  public updated: any;

  constructor() {

  }

}

export class GeoPoint {

  public categories: any;
  public latitude: any;
  public longitude: any;
  public metadata: any;
  public objectId: string;

  constructor() {

  }

}