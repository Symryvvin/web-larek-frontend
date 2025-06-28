import { Presenter } from "../base/Presenter";
import { ApplicationEvents, ICartModel, Product, ProductId } from "../../types";
import { CartView } from "../view/CartView";
import { CartModel } from "../model/CartModel";
import { cloneTemplate } from "../../utils/utils";

export class CartPresenter extends Presenter {
	protected cartModel: ICartModel;
	protected cartView: CartView;

	init(): void {
		this.cartModel = new CartModel(this.events);

		const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
		const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
		this.cartView = new CartView(cloneTemplate(cartTemplate), cardTemplate, this.events);

		this.events.on(ApplicationEvents.CART_CONTENT_CHANGED, () => {
			this.cartView.render({items: this.cartModel.items, totalPrice: this.cartModel.getTotalPrice()});
		});

		this.events.on(ApplicationEvents.CART_ITEM_DELETED, (data: { id: ProductId }) => {
			this.cartModel.removeItemById(data.id);
			this.events.emit(ApplicationEvents.CART_CONTENT_CHANGED, this.cartModel.items);
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