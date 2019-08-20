import { ShoppingStore } from './shopping.store';
import { ShoppingListEntry, createShoppingListItem } from './shopping.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  constructor(private _shoppingStore: ShoppingStore) {
  }

  add(title: string) {
    const entry = createShoppingListItem({ title, quantity: 1 });
    this._shoppingStore.add(entry);
  }

  increment({ id, quantity }: ShoppingListEntry) {
    this._shoppingStore.update(id, { quantity });
  }

  decrement({ id, quantity }: ShoppingListEntry) {
    if (quantity >= 1) {
      this._shoppingStore.update(id, { quantity });
    } else {
      this._shoppingStore.remove(id);
    }
  }

  updateNote({id, note}: ShoppingListEntry) {
    this._shoppingStore.update(id, { note });
  }

}
