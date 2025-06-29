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
			this.cartView.render({
				items: this.cartModel.items
			});
		});

		this.events.on(ApplicationEvents.CART_ITEM_ADDED, (data: { id: ProductId }) => {
			this.api.getProduct(data.id).then((product: Product) => {
				this.cartModel.addItem(product);
				this.events.emit(ApplicationEvents.CART_CONTENT_CHANGED, {total: this.cartModel.items.length});
			})
				.catch(error => {
					console.log(error)
				});

		});

		this.events.on(ApplicationEvents.CART_ITEM_DELETED, (data: { id: ProductId }) => {
			this.cartModel.removeItemById(data.id);
			this.events.emit(ApplicationEvents.CART_CONTENT_CHANGED, {total: this.cartModel.items.length});
		});
	}

	isProductInCart(id: ProductId): boolean {
		return this.cartModel.itemInCart(id);
	}

	renderCart(): HTMLElement {
		return this.cartView.content;
	}
}