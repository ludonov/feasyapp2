import { Injectable } from '@angular/core';

import { FeasyUser } from './Feasy';

@Injectable()
export class Globals {

  public UID: string = "";
  public User: FeasyUser = new FeasyUser("", "", "");

  public JustRegistered: boolean = false;

  constructor() {
  }

}