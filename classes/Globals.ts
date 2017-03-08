import { Injectable } from '@angular/core';

@Injectable()
export class Globals {

  public UID: string = "";
  public Email: string = "";
  public DisplayName: string = "";
  public photoURL: string = "";

  public JustRegistered: boolean = false;

  constructor() {
  }

}