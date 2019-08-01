import { Query } from '@datorama/akita';
import { ShoppingStore, ShoppingState } from './shopping.store';
import { Observable } from 'rxjs';
import { ShoppingListEntry } from '../models/shopping-list-entry.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingQuery extends Query<ShoppingState> {

  constructor(protected store: ShoppingStore) {
    super(store);
  }

  selectEntries(): Observable<ShoppingListEntry[]> {
    return this.select(state => state.entries);
  }
}
