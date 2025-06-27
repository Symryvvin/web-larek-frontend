import { ICatalogModel, Product } from '../types';
import { IEvents } from './base/events';

export class CatalogModel implements ICatalogModel {
	protected items: Product[];

	constructor(protected events: IEvents) {
		this.items = [];
	}

	addItems(items: Product[]): void {
		this.items = items;
		this.events.emit('catalog:items_loaded', items);
	}

	getItemById(id: string): Product {
		return this.items.find((item) => item.id === id);
	}
}
