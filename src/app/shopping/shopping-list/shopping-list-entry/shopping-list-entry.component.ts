import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShoppingListEntry } from '../../state';

@Component({
  selector: 'app-shopping-list-entry',
  templateUrl: './shopping-list-entry.component.html'
})
export class ShoppingListEntryComponent implements OnInit {

  @Input() entry: ShoppingListEntry;
  @Output() increment = new EventEmitter<ShoppingListEntry>();
  @Output() decrement = new EventEmitter<ShoppingListEntry>();

  detailsVisible: boolean;

  constructor() { }

  ngOnInit() {
    this.detailsVisible = false;
  }

  showDetails() {
    this.detailsVisible = !this.detailsVisible;
  }

  inc(entry: ShoppingListEntry) {
    const quantity = entry.quantity + 1;
    const newEntry = { ...entry, quantity };
    this.increment.emit(newEntry);
  }

  dec(entry: ShoppingListEntry) {
    const quantity = entry.quantity - 1;
    const newEntry = { ...entry, quantity };
    this.decrement.emit(newEntry);
  }

}
