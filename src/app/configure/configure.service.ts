import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Entry } from '../entry';

@Injectable({
  providedIn: 'root'
})
export class ConfigureService {
  constructor(private database: AngularFireDatabase) { }

  getEntries(guid: string): AngularFireList<Entry> {
    return this.database.list('/pictures', ref => 
      ref.orderByChild(guid)
    );
  }
}
