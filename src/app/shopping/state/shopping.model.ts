import { ID, guid } from '@datorama/akita';

export interface ShoppingListEntry {
  id: ID;
  title: string;
  quantity: number;
}

export function createShoppingListItem({ title, quantity }: Partial<ShoppingListEntry>) {
  return {
    id: guid(),
    title,
    quantity
  } as ShoppingListEntry;
}
