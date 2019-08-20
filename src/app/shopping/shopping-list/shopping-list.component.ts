import { Component, OnInit } from '@angular/core';
import { ShoppingListEntry, ShoppingQuery, ShoppingService } from '../state';
import { Observable } from 'rxjs';
import { StateHistoryPlugin } from '@datorama/akita';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit {
  shoppingListEntries$: Observable<ShoppingListEntry[]>;

  stateHistory: StateHistoryPlugin;

  constructor(private _shoppingQuery: ShoppingQuery,
              private _shoppingService: ShoppingService) { }

  ngOnInit() {
    this.shoppingListEntries$ = this._shoppingQuery.selectAll();
    this.stateHistory = new StateHistoryPlugin(this._shoppingQuery);
  }

  addEntry(input: HTMLInputElement) {
    this._shoppingService.add(input.value);
    input.value = '';
    this.updateHistory();
  }

  increment(entry: ShoppingListEntry) {
    this._shoppingService.increment(entry);
    this.updateHistory();
  }

  decrement(entry: ShoppingListEntry) {
    this._shoppingService.decrement(entry);
    this.updateHistory();
  }

  onNoteChanged(entry: ShoppingListEntry) {
    this._shoppingService.updateNote(entry);
    this.updateHistory();
  }

  onUndo() {
    this.stateHistory.undo();
  }

  onRedo() {
    this.stateHistory.redo();
  }

  private updateHistory() {
    this.stateHistory.clear(history => {
      return {
        past: history.past,
        present: history.present,
        future: []
      };
    });
  }
}
