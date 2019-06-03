import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ShoppingListEntry } from './shopping.model';
import { Injectable } from '@angular/core';

export interface ShoppingState extends EntityState<ShoppingListEntry> {}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'shopping' })
export class ShoppingStore extends EntityStore<ShoppingState, ShoppingListEntry> {

  constructor() {
    super();
  }

}
