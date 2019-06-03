import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShoppingListEntry } from '../../state';

@Component({
  selector: 'app-shopping-list-entry-details',
  templateUrl: './shopping-list-entry-details.component.html'
})
export class ShoppingListEntryDetailsComponent implements OnInit {

  @Input() entry: ShoppingListEntry;
  @Output() noteChanged = new EventEmitter<ShoppingListEntry>();

  constructor() { }

  ngOnInit() {
  }

  onEnter(input: HTMLInputElement) {
    const note = input.value;
    const newEntry = { ...this.entry, note };
    this.noteChanged.emit(newEntry);
  }

}
