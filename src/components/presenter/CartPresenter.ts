import { Presenter } from "../base/Presenter";
import { ApplicationEvents, ICartModel, Product, ProductId, TCartData } from "../../types";
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
		this.events.on(ApplicationEvents.CART_CONTENT_CHANGED, (data: TCartData) => this.cartContentChangedCallback(data));
		this.events.on(ApplicationEvents.CART_ITEM_ADDED, (data: { id: ProductId }) => this.cartItemAddedCallback(data));
		this.events.on(ApplicationEvents.CART_ITEM_DELETED, (data: { id: ProductId }) => this.cartItemDeletedCallback(data));
		this.events.on(ApplicationEvents.CART_ORDER_SUBMITTED, () => this.cardOrderSubmittedCallback());
	}

	private cartContentChangedCallback(data: TCartData): void {
		this.cartView.render(data);
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
		this.events.emit(ApplicationEvents.ORDER_CREATED, this.cartModel.getCartData());
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