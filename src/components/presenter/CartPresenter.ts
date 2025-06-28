import { Presenter } from "../base/Presenter";
import { ApplicationEvents, ICartModel, Product, ProductId } from "../../types";
import { CartView } from "../view/CartView";
import { CartModel } from "../model/CartModel";
import { cloneTemplate } from "../../utils/utils";
import { ApplicationApi } from "../ApplicationApi";
import { IEvents } from "../base/events";

export class CartPresenter extends Presenter {
	protected cartModel: ICartModel;
	protected cartView: CartView;

	constructor(protected readonly api: ApplicationApi,
	            protected readonly events: IEvents,
	            protected readonly cartTemplate: HTMLTemplateElement,
	            protected readonly cardTemplate: HTMLTemplateElement) {
		super(api, events);

		this.cartModel = new CartModel(events);
		this.cartView = new CartView(cloneTemplate(cartTemplate), cardTemplate, this.events);
	}

	init(): void {
		this.events.on(ApplicationEvents.CART_CONTENT_CHANGED, () => {
			this.cartView.render({items: this.cartModel.items, totalPrice: this.cartModel.getTotalPrice()});
		});

		this.events.on(ApplicationEvents.CART_ITEM_DELETED, (data: { id: ProductId }) => {
			this.cartModel.removeItemById(data.id);
			this.events.emit(ApplicationEvents.CART_CONTENT_CHANGED, this.cartModel.items);
		});

		this.events.on(ApplicationEvents.ORDER_CREATED, () => {
			const productIds = this.cartModel.items.map(item => item.id);
			const totalPrice = this.cartModel.getTotalPrice();

			this.events.emit(ApplicationEvents.ORDER_FORMED, {items: productIds, total: totalPrice});
		});
	}

	addProductToCart(product: Product): void {
		this.cartModel.addItem(product);
		this.events.emit(ApplicationEvents.CART_CONTENT_CHANGED, this.cartModel.items);
	}

	isProductInCart(id: ProductId): boolean {
		return this.cartModel.itemInCart(id);
	}

	renderCart(): HTMLElement {
		return this.cartView.content;
	}
}