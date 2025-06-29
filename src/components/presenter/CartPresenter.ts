import { Presenter } from "../base/Presenter";
import { ApplicationEvents, ICartModel, Product, ProductId } from "../../types";
import { CartView } from "../view/CartView";
import { ApplicationApi } from "../ApplicationApi";
import { IEvents } from "../base/events";

export class CartPresenter extends Presenter {
	constructor(protected readonly api: ApplicationApi,
	            protected readonly events: IEvents,
	            protected readonly cartModel: ICartModel,
	            protected readonly cartView: CartView) {
		super(api, events);
	}

	init(): void {
		this.events.on(ApplicationEvents.CART_CONTENT_CHANGED, () => this.cartContentChangedCallback());
		this.events.on(ApplicationEvents.CART_ITEM_ADDED, (data: { id: ProductId }) => this.cartItemAddedCallback(data));
		this.events.on(ApplicationEvents.CART_ITEM_DELETED, (data: { id: ProductId }) => this.cartItemDeletedCallback(data));
	}

	private cartContentChangedCallback(): void {
		this.cartView.render({items: this.cartModel.items});
	}

	private cartItemAddedCallback(data: { id: ProductId }): void {
		this.api.getProduct(data.id).then((product: Product) => {
			this.cartModel.addItem(product);
		})
			.catch(error => {
				console.log(error)
			});
	}

	private cartItemDeletedCallback(data: { id: ProductId }): void {
		this.cartModel.removeItemById(data.id);
	}

	isProductInCart(id: ProductId): boolean {
		return this.cartModel.itemInCart(id);
	}

	renderCart(): HTMLElement {
		return this.cartView.content;
	}

	clearCart() {
		this.cartModel.clear()
	}
}