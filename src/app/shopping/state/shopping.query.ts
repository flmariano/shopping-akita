import { QueryEntity } from '@datorama/akita';
import { ShoppingStore, ShoppingState } from './shopping.store';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingQuery extends QueryEntity<ShoppingState> {

  constructor(protected store: ShoppingStore) {
    super(store);
  }
}
