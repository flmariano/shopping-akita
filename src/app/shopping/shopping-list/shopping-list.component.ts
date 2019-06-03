import { Component, OnInit } from '@angular/core';
import { ShoppingListEntry, ShoppingQuery, ShoppingService } from '../state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit {
  shoppingListEntries$: Observable<ShoppingListEntry[]>;

  constructor(private _shoppingQuery: ShoppingQuery,
              private _shoppingService: ShoppingService) { }

  ngOnInit() {
    this.shoppingListEntries$ = this._shoppingQuery.selectAll();
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
