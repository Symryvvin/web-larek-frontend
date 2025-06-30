import { Presenter } from "../base/Presenter";
import { ApplicationEvents, ICartModel, Product, ProductId, TCartData } from "../../types";
import { CartView } from "../view/CartView";
import { ApplicationApi } from "../ApplicationApi";
import { IEvents } from "../base/events";
import { CartModel } from "../model/CartModel";
import { cloneTemplate } from "../../utils/utils";
import { HTMLTemplates } from "../HTMLTemplates";

export class CartPresenter extends Presenter {
	protected readonly cartModel: ICartModel;
	protected readonly cartView: CartView;

	constructor(protected readonly api: ApplicationApi,
	            protected readonly events: IEvents) {
		super(api, events);

		this.cartModel = new CartModel(events);
		this.cartView = new CartView(cloneTemplate(HTMLTemplates.cart), HTMLTemplates.cardInCart, events);
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
		const cartData = this.cartModel.getCartData();
		this.events.emit(ApplicationEvents.ORDER_CREATED, {items: cartData.items.map(item => item.id), total: cartData.price});
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