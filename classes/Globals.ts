import { Injectable } from '@angular/core';

import { FeasyUser } from './Feasy';

@Injectable()
export class Globals {

  public UID: string = "";
  public User: FeasyUser = new FeasyUser("", "", "");
  public PublishedLists: Object = {};
  public UnpublishedLists: Object = {};
  public Candidates: Object = {};

  public JustRegistered: boolean = false;

  public candidates_refs: Array<firebase.database.Reference> = new Array();


  constructor() {
  }
  

  public unlinkCandidateWatchers(): void {
    for (let ref of this.candidates_refs) {
      ref.off();
    }
    this.candidates_refs.length = 0;
  }

}