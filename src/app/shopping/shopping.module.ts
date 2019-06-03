import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingListEntryComponent } from './shopping-list/shopping-list-entry/shopping-list-entry.component';
import { ShoppingListEntryDetailsComponent } from './shopping-list/shopping-list-entry-details/shopping-list-entry-details.component';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingListEntryComponent, ShoppingListEntryDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
  ]
})
export class ShoppingModule { }
