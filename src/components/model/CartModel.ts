import { ICartModel, Product, ProductId } from "../../types";
import { IEvents } from "../base/events";

export class CartModel implements ICartModel {
	protected _items: Product[];

	constructor(protected events: IEvents) {
		this._items = [];
	}

	addItem(item: Product): void {
		if (!this.itemInCart(item.id)) {
			this._items.push(item);
		}
	}

	itemInCart(id: ProductId): boolean {
		const inCart = this._items.find((item: Product) => item.id === id);
		return inCart !== undefined;
	}

	clear(): void {
		this._items = [];
	}

	removeItemById(id: ProductId): void {
		this._items = this._items.filter((item: Product) => item.id !== id);
	}

	get items(): Product[] {
		return this._items;
	}


}