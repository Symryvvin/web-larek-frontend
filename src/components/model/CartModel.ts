import { ApplicationEvents, ICartModel, Product, ProductId, TCartProducts } from "../../types";
import { IEvents } from "../base/events";

export class CartModel implements ICartModel {
	protected _items: Product[];

	constructor(protected events: IEvents) {
		this._items = [];
	}

	addItem(item: Product): void {
		if (!this.itemInCart(item.id)) {
			this._items.push(item);
			this.events.emit<TCartProducts>(ApplicationEvents.CART_CONTENT_CHANGED, this.getCartProducts());
		}
	}

	getCartProducts(): TCartProducts {
		return {
			items: this._items,
			price: this._items.reduce((total, item) => total + item.price, 0)
		}
	}

	itemInCart(id: ProductId): boolean {
		const inCart = this._items.find((item: Product) => item.id === id);
		return inCart !== undefined;
	}

	clear(): void {
		this._items = [];
		this.events.emit<TCartProducts>(ApplicationEvents.CART_CONTENT_CHANGED, this.getCartProducts());
	}

	removeItemById(id: ProductId): void {
		this._items = this._items.filter((item: Product) => item.id !== id);
		this.events.emit<TCartProducts>(ApplicationEvents.CART_CONTENT_CHANGED, this.getCartProducts());
	}

	get items(): Product[] {
		return this._items;
	}


}