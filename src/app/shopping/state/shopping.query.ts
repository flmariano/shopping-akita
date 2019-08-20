import { QueryEntity } from '@datorama/akita';
import { ShoppingStore, ShoppingState } from './shopping.store';
import { ShoppingListEntry } from './shopping.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingQuery extends QueryEntity<ShoppingState, ShoppingListEntry> {

  constructor(protected store: ShoppingStore) {
    super(store);
  }
}
