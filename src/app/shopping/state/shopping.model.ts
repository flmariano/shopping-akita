import { ID, guid } from '@datorama/akita';

export interface ShoppingListEntry {
  id: ID;
  title: string;
  note: string;
  quantity: number;
}

export function createShoppingListItem({ title, note, quantity }: Partial<ShoppingListEntry>) {
  return {
    id: guid(),
    title,
    note,
    quantity
  } as ShoppingListEntry;
}
