import { ApplicationEvents, ICatalogModel, Product, ProductId } from '../../types';
import { IEvents } from '../base/events';

export class CatalogModel implements ICatalogModel {
	protected _items: Product[];

	constructor(protected events: IEvents) {
		this._items = [];
	}

	set items(items: Product[]) {
		this._items = items;
		this.events.emit(ApplicationEvents.CATALOG_ITEMS_LOADED, items);
	}

	getItemById(id: ProductId): Product {
		return this._items.find((item) => item.id === id);
	}
}
