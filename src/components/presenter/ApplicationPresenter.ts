import { MainPagePresenter } from "./MainPagePresenter";
import { Presenter } from "../base/Presenter";
import { ApplicationApi } from "../ApplicationApi";
import { IEvents } from "../base/events";
import { ApplicationEvents, IForm, IModal, Order, ProductId } from "../../types";
import { CartPresenter } from "./CartPresenter";

export class ApplicationPresenter extends Presenter {
	protected order: Order;

	constructor(protected readonly api: ApplicationApi,
	            protected readonly events: IEvents,
	            protected readonly mainPagePresenter: MainPagePresenter,
	            protected readonly cartPresenter: CartPresenter,
	            protected readonly modal: IModal,
	            protected readonly orderForm: IForm,
	) {
		super(api, events);

		this.orderForm.onSubmit = () =>
			this.events.emit(ApplicationEvents.ORDER_PAYMENT_SELECTED, this.orderForm.getFormData());
		this.orderForm.validate();
	}

	init(): void {
		this.events.on(ApplicationEvents.CATALOG_CARD_SELECTED, (data: { id: ProductId }) => {
			const inCart = this.cartPresenter.isProductInCart(data.id);
			this.openModal(this.mainPagePresenter.renderCardPreview(data.id, inCart));
		});

		this.events.on(ApplicationEvents.CART_ITEM_ADDED, (data: { id: ProductId }) => {
			const product = this.mainPagePresenter.findCatalogItemById(data.id);
			this.cartPresenter.addProductToCart(product);
		});

		this.events.on(ApplicationEvents.CART_CONTENT_CHANGED, () => {
			const renderedCardPreviewId = this.mainPagePresenter.currentCardPreviewId();
			const inCart = this.cartPresenter.isProductInCart(renderedCardPreviewId);

			this.mainPagePresenter.renderCardPreview(renderedCardPreviewId, inCart);
		});

		this.events.on(ApplicationEvents.CART_OPENED, () => {
			this.openModal(this.cartPresenter.renderCart());
		});

		this.events.on(ApplicationEvents.ORDER_CREATED, (data: { items: ProductId[], total: number }) => {
			this.order = data as Order;
			this.openModal(this.orderForm.render());
		});

		this.events.on(ApplicationEvents.ORDER_PAYMENT_SELECTED, (order: Partial<Order>) => {
			this.order = Object.assign(this.order, order);
			// this.openModal(this.orderForm.render());
			console.log(this.order);
		});
	}

	openModal(content: HTMLElement): void {
		this.modal.close();
		this.modal.content = content;
		this.modal.open();
	}

}