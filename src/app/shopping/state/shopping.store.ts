import { Store, StoreConfig, ID } from '@datorama/akita';
import { ShoppingListEntry } from '../models/shopping-list-entry.model';
import { Injectable } from '@angular/core';

export interface ShoppingState {
  entries: ShoppingListEntry[];
}

export function createInitialState(): ShoppingState {
  return {
    entries: []
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'Shopping' })
export class ShoppingStore extends Store<ShoppingState> {

  constructor() {
    super(createInitialState());
  }

  add(entry: ShoppingListEntry) {
    this.update(state => {
      return {
        entries: [ ...state.entries, entry ]
      };
    });
  }

  updateEntry(id: ID, params: Partial<ShoppingListEntry>) {
    this.update(state => {
      return {
        entries: state.entries.map(entry => {
          return entry.id === id ? {
            id,
            title: params.title ? params.title : entry.title,
            note: params.note ? params.note : entry.note,
            quantity: params.quantity ? params.quantity : entry.quantity,
          } : entry;
        })
      };
    });
  }

  remove(id: ID) {
    this.update(state => {
      return { entries: state.entries.filter(entry => entry.id !== id) };
    });
  }
}
