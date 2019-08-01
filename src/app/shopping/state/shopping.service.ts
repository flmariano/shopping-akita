import { ShoppingStore } from './shopping.store';
import { createShoppingListEntry, ShoppingListEntry } from '../models/shopping-list-entry.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  // tslint:disable-next-line: variable-name
  constructor(private _shoppingStore: ShoppingStore) {
  }

  add(title: string) {
    const entry = createShoppingListEntry({ title, quantity: 1 });
    this._shoppingStore.add(entry);
  }

  increment({ id, quantity }: ShoppingListEntry) {
    this._shoppingStore.updateEntry(id, { quantity });
  }

  decrement({ id, quantity }: ShoppingListEntry) {
    if (quantity >= 1) {
      this._shoppingStore.updateEntry(id, { quantity });
    } else {
      this._shoppingStore.remove(id);
    }
  }

}
