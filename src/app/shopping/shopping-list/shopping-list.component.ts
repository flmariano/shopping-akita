import { Component, OnInit } from '@angular/core';
import { ShoppingQuery, ShoppingService } from '../state';
import { Observable } from 'rxjs';
import { ShoppingListEntry } from '../models/shopping-list-entry.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit {
  shoppingListEntries$: Observable<ShoppingListEntry[]>;

  constructor(private _shoppingQuery: ShoppingQuery,
              private _shoppingService: ShoppingService) { }

  ngOnInit() {
    this.shoppingListEntries$ = this._shoppingQuery.selectEntries();
  }

  addEntry(input: HTMLInputElement) {
    this._shoppingService.add(input.value);
    input.value = '';
  }

  increment(entry: ShoppingListEntry) {
    this._shoppingService.increment(entry);
  }

  decrement(entry: ShoppingListEntry) {
    this._shoppingService.decrement(entry);
  }
}
