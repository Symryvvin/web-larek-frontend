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
		this.events.on(ApplicationEvents.CATALOG_CARD_SELECTED, (data: { id: ProductId }) => this.catalogCardSelectedCallback(data));
		this.events.on(ApplicationEvents.CART_CONTENT_CHANGED, () => this.cartContentChangedCallback());
		this.events.on(ApplicationEvents.CART_OPENED, () => this.cartOpenedCallback());
		this.events.on(ApplicationEvents.ORDER_CREATED, (data: { items: ProductId[], total: number }) => this.orderCreatedCallback(data));
		this.events.on(ApplicationEvents.ORDER_PAYMENT_SELECTED, (order: Partial<Order>) => this.orderFormedCallback(order));
	}

	catalogCardSelectedCallback(data: { id: ProductId }): void {
		const inCart = this.cartPresenter.isProductInCart(data.id);
		this.openModal(this.mainPagePresenter.renderCardPreview(data.id, inCart));
	}

	cartContentChangedCallback(): void {
		const renderedCardPreviewId = this.mainPagePresenter.currentCardPreviewId();
		const inCart = this.cartPresenter.isProductInCart(renderedCardPreviewId);

		this.mainPagePresenter.renderCardPreview(renderedCardPreviewId, inCart);
	}

	cartOpenedCallback() {
		this.openModal(this.cartPresenter.renderCart());
	}

	orderCreatedCallback(data: { items: ProductId[], total: number }) {
		this.order = data as Order;
		this.openModal(this.orderForm.render());
	}

	orderFormedCallback(order: Partial<Order>) {
		this.order = Object.assign(this.order, order);
	}

	openModal(content: HTMLElement): void {
		this.modal.close();
		this.modal.content = content;
		this.modal.open();
	}

}