import { Component, OnInit } from '@angular/core';
import { ShoppingListEntry, ShoppingQuery, ShoppingService, ShoppingState } from '../state';
import { Observable, of } from 'rxjs';
import { StateHistoryPlugin } from '@datorama/akita';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit {
  shoppingListEntries$: Observable<ShoppingListEntry[]>;

  stateHistory: StateHistoryPlugin;
  // undo: FormControl;
  // redo: FormControl;

// tslint:disable: variable-name
  constructor(private _shoppingQuery: ShoppingQuery,
              private _shoppingService: ShoppingService) { }

  ngOnInit() {
    this.shoppingListEntries$ = this._shoppingQuery.selectAll();
    this.stateHistory = new StateHistoryPlugin(this._shoppingQuery/* , {
      comparator: (prevState: ShoppingState, currentState: ShoppingState) => {
        return prevState.ids !== currentState.ids;
      }
    } */);

    // this.undo = new FormControl({value: ''/* , disabled: !this.stateHistory.hasPast */});
    // this.redo = new FormControl({value: ''/* , disabled: !this.stateHistory.hasFuture */});

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

  onNoteChanged(entry: ShoppingListEntry) {
    this._shoppingService.updateNote(entry);
  }

  onUndo() {
    this.stateHistory.undo();
  }

  onRedo() {
    this.stateHistory.redo();
  }
}
