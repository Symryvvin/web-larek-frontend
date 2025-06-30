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
		this.events.on(ApplicationEvents.CART_ORDER_SUBMITTED, () => this.cardOrderSubmittedCallback());
	}

	private cartContentChangedCallback(): void {
		this.cartView.render({items: this.cartModel.items, totalPrice: this.cartModel.getTotalPrice()});
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

	private cardOrderSubmittedCallback() {
		this.events.emit(ApplicationEvents.ORDER_CREATED, {
			items: this.cartModel.items.map((product: Product) => product.id),
			total: this.cartModel.getTotalPrice()
		});
	}

	isProductInCart(id: ProductId): boolean {
		return this.cartModel.itemInCart(id);
	}

	renderCart(): HTMLElement {
		return this.cartView.render();
	}

	clearCart() {
		this.cartModel.clear()
	}
}