# State Management mit Akita

## Was ist Akita?

Akita ist ein State Management Pattern und Framework basierend auf RxJs. Es kann mit relativ wenig Mehraufwand dafür genutzt werden, einen Überblick über Veränderungen des Anwendungszustands zu bekommen und diesen effizient zu manipulieren (z.B. undo/redo Funktionalität).

Anders als bei NgRx und NGXS ist Akita objektorientiert aufgebaut und nicht funktional im Redux-Pattern, d.h. es wird mit Klassen und Services gearbeitet und nicht mit Actions, Selectors, Reducers, usw.

![akita architecture](https://cdn-images-1.medium.com/max/1200/1*ZvboOQwyeAjPVKdYmaA1dA.png "Akita Architektur")

Akita besteht grundlegend aus zwei Klassen: Dem Store und der Query.

Der Store wird genutzt, um schreibend auf den Zustand zuzugreifen. Dies wird optimalerweise immer von einem Service aus getan, der ebenfalls die gesamte asynchrone Logik von z.B. HTTP-Requests enthält.

Die Query ist für alle lesenden Zugriffe zuständig und wird hauptsächlich in darstellenden Komponenten genutzt, um Observables für die darzustellenden Daten zu erhalten. Die Daten, die man von der Query bekommt, werden direkt aus dem Store geladen. Wie bei normalen RxJs Observables kann man auch mehrere Queries kombinieren, um ein Observable zu bekommen, das alle Änderungen der Queries enthält.

Mehr zu Stores und Queries später.

## Ein simples Testprojekt

Zum Erläutern des Patterns und dessen Implementierung werden wir uns jetzt ein simples Beispielprojekt anschauen.

### Das Modell

```ts
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
```

Unerwartet könnte hier sein, dass wir eine Factory-Funktion für das Modell angelegt haben. Dies ist der offizielle Standard in Akita und wird bei der Code-Generierung automatisch erstellt. Wenn die Objekte allerdings von einer Datenbank kommen anstatt manuell angelegt zu werden, braucht man diese Funktion nicht.

Der Typ "ID" kommt von Akita und wird meist, aber nicht zwingend, als Typ des Primärschlüssels des Modells benutzt. Er besteht ganz einfach aus einer Vereinigung von `string` und `number` (Quellcode: `type ID = string | number`). Die Funktion `guid()` erzeugt einfach eine zufällige GUID.

Bei der Erzeugung wird dort anstatt `{ title, quantity }` &nbsp; `params` stehen. Den Code wie folgt zu schreiben führt meines Wissens nach zum gleichen Ergebnis (das Deklarieren von `title` und `quantity` im ersten Fall macht diese nicht zu notwendigen Eigenschaften des Objekts):

```ts
export function createShoppingListItem(params: Partial<ShoppingListEntry>) {
  return {
    id: guid(),
    title: params.title,
    quantity: params.quantity,
  } as ShoppingListEntry;
}
```

### Der Store

Es gibt zwei verschiedene Arten von Stores: Den normalen `Store` und den speziell auf Entitäten ausgerichteten `EntityStore`. Da meist eine Speicherung von Entitäten gefordert ist, wird meist der `EntityStore` verwendet.

Er kann wie der normale `Store` übrigens auch Werte außerhalb der Entitäten halten. Dafür muss man diese nur im `State` definieren. Mehr dazu später.

```ts
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ShoppingListEntry } from './shopping.model';
import { Injectable } from '@angular/core';

export interface ShoppingState extends EntityState<ShoppingListEntry> {}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'shopping' })
export class ShoppingStore extends EntityStore<ShoppingState> {

  constructor() {
    super();
  }
}
```

Wichtig ist hier zu erwähnen, dass vor Version 4.0.0 beim `EntityStore` (und der `QueryEntity`) zusätzlich die Klasse der Entität nach `<ShoppingState` angegeben werden musste, also `EntityStore<ShoppingState, ShoppingListEntry>`. Beim Lesen oder Kopieren alten Codes muss darauf geachtet werden, da diese Schreibweise jetzt deprecated ist.

Beide Stores sind nach Generierung schon komplett mit allen (schreibenden) CRUD-Operationen nutzbar, was sehr viel Schreibarbeit spart.

Es gibt außerdem sehr flexible Zugriffsmöglichkeiten auf den State. Man kann Operationen einfach per Methodenübergabe auf Elemente mit bestimmten Eigenschaften anwenden:

```ts
this.store.update((element) => element.quantity > 5, {
  quantity: 5
});
```

Natürlich gibt es auch die Möglichkeit, einfach mit IDs zu arbeiten. Genaueres kann man in der [offiziellen Akita Dokumentation](https://netbasal.gitbook.io/akita/entity-store/entity-store/api) nachlesen.

### Die Query

Auch hier gibt es die normale `Query` und die `QueryEntity`, die mit dem `EntityStore` verwendet wird. Sie ist im Grunde genauso aufgebaut wie der Store, nur für lesende Zugriffe.

```ts
@Injectable({
  providedIn: 'root'
})
export class ShoppingQuery extends QueryEntity<ShoppingState> {

  constructor(protected store: ShoppingStore) {
    super(store);
  }
}
```

Man kann über Operationen wie `select()`, `selectAll()*`, `selectEntity()*`, usw. Observables für die gewünschten Daten erhalten. Auch kann man Daten über `getValue()`, `getAll()*`, `getEntity()*`, usw. direkt auslesen.

`*` Nur in in der `Entity` Variante.

Wie in der obigen Grafik zu sehen ist, kann man Querys kombinieren, um in den Komponenten dann nur einen Aufruf ausführen zu müssen. Dies tut man einfach per Dependency Injection und der Erstellung von Feldern oder Methoden, z.B.:

```ts
export class CartQuery extends QueryEntity<State> {
  constructor(private productsQuery: ProductsQuery) {}

  public selectItems$ = combineLatest(
    this.selectAll(),
    this.productsQuery.selectAll()
  ); // Oft wird hier dann .map() aufgerufen, um die Objekte zu kombinieren
}
```

Man kann übrigens auch Stores kombinieren, mehr dazu [hier](https://blog.usejournal.com/supercharge-your-akita-for-angular-by-using-mediators-d84b9fa951a1).

### Der Service

Als service wird generell einfach ein normaler Angular-Service benutzt.

```ts
import { ShoppingStore } from './shopping.store';
import { ShoppingListEntry, createShoppingListItem } from './shopping.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  constructor(private _shoppingStore: ShoppingStore) {
  }

  add(title: string) {
    const entry = createShoppingListItem({ title, quantity: 1 });
    this._shoppingStore.add(entry);
  }

  increment({ id, quantity }: ShoppingListEntry) {
    this._shoppingStore.update(id, { quantity });
  }

  decrement({ id, quantity }: ShoppingListEntry) {
    if (quantity >= 1) {
      this._shoppingStore.update(id, { quantity });
    } else {
      this._shoppingStore.remove(id);
    }
  }
}
```

Es ist auch möglich (und generell empfohlen), jegliche Logik von Store updates im Store selbst zu definieren, also spezielle Methoden zu erstellen, die dann mit unterschiedlichen Services genutzt werden könnten.

### Die Komponente

Es wird empfohlen, Komponenten nach dem Prinzip "smart and dumb" (d.h. stateful and stateless) zu strukturieren. Das bedeutet, dass wir Container Components erstellen, die mit dem Service bzw. dem State interagieren, und Presentational Components, die fast rein zur Darstellung sind.

`ShoppingListComponent` ist in diesem Fall der Container und `ShoppingListEntryComponent` die darstellende Komponente. Durch diese Struktur muss nur `ShoppingListComponent` mit dem Service und der Query interagieren.

```html
<h4>Shopping List</h4>

<div class="input-field">
  <i class="material-icons prefix">add_shopping_cart</i>
  <input type="text"
         class="form-control"
         #input
         placeholder="Add an item..."
         (keydown.enter)="addEntry(input)">
</div>

<div *ngIf="shoppingListEntries$ | async as shoppingListEntries">
  <app-shopping-list-entry *ngFor="let entry of shoppingListEntries"
                           class="collection-item"
                           [entry]="entry"
                           (increment)="increment($event)"
                           (decrement)="decrement($event)"></app-shopping-list-entry>
</div>
```

```ts
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
```

Die hier nicht gezeigten Komponenten können im [Stackblitz-Projekt](https://stackblitz.com/edit/shopping-akita-sdg23gs) angesehen werden.

<https://stackblitz.com/edit/shopping-akita-sdg23gs?embed=1&file=src/app/app.component.ts>

### Ausblick

Damit ist unsere Anwendung auch schon fertig. Es ist empfehlenswert, sich die Anwendung auf Stackblitz und GitHub anzusehen und selbst damit zu experimentieren. Dabei gibt es 3 unterschiedliche Versionen auf den verschiedenen Branches.

Im `master` ist eine Version, die weitere Features, wie zum Beispiel Versionshistorie und eine Detailansicht mit Notizen, hat. Im Branch `normal-store` gibt es eine Variante, die den normalen `Store` anstatt den `EntityStore` verwendet. Im dritten, `simple-version` ist die einfache Version, die hier zu sehen ist.

## Weitere Infos

Mehr zu Akita kann hier gefunden werden:

- [Dokumentation](https://netbasal.gitbook.io/akita/)
- [GitHub](https://github.com/datorama/akita)
- [Einführung](https://netbasal.com/introducing-akita-a-new-state-management-pattern-for-angular-applications-f2f0fab5a8)
- [Beispiel](https://engineering.datorama.com/building-a-shopping-cart-in-angular-using-akita-c41f6a6f7255)

Vor Allem die Dokumentation ist empfehlenswert, durchzulesen.
