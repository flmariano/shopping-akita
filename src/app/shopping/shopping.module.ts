import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingListEntryComponent } from './shopping-list/shopping-list-entry/shopping-list-entry.component';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingListEntryComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
  ]
})
export class ShoppingModule { }
