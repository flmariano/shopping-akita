import { ID, guid } from '@datorama/akita';

export class ShoppingListEntry {
    id: ID;
    title: string;
    note: string;
    quantity: number;
}

export function createShoppingListEntry({ title, note, quantity }: Partial<ShoppingListEntry>) {
    return {
      id: guid(),
      title,
      note,
      quantity
    } as ShoppingListEntry;
  }
