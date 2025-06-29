import { MainPagePresenter } from "./MainPagePresenter";
import { Presenter } from "../base/Presenter";
import { ApplicationApi } from "../ApplicationApi";
import { IEvents } from "../base/events";
import { ApplicationEvents, IForm, IModal, Order, ProductId } from "../../types";
import { CartPresenter } from "./CartPresenter";
import { OrderSuccessView } from "../view/OrderSuccessView";

export class ApplicationPresenter extends Presenter {
	protected order: Order;

	constructor(protected readonly api: ApplicationApi,
	            protected readonly events: IEvents,
	            protected readonly mainPagePresenter: MainPagePresenter,
	            protected readonly cartPresenter: CartPresenter,
	            protected readonly modal: IModal,
	            protected readonly orderForm: IForm,
	            protected readonly contactsForm: IForm,
	            protected readonly orderSuccessView: OrderSuccessView
	) {
		super(api, events);

		this.orderForm.onSubmit = () => this.events.emit(ApplicationEvents.ORDER_PAYMENT_SELECTED, this.orderForm.getFormData());
		this.orderForm.validate();
		this.contactsForm.onSubmit = () => this.events.emit(ApplicationEvents.ORDER_PLACED, this.contactsForm.getFormData());
		this.contactsForm.validate();
		this.orderSuccessView.onClose = () => {
			this.modal.close();
		};
	}

	init(): void {
		this.events.on(ApplicationEvents.CATALOG_CARD_SELECTED, (data: { id: ProductId }) => this.catalogCardSelectedCallback(data));
		this.events.on(ApplicationEvents.CART_CONTENT_CHANGED, () => this.cartContentChangedCallback());
		this.events.on(ApplicationEvents.CART_OPENED, () => this.cartOpenedCallback());
		this.events.on(ApplicationEvents.ORDER_CREATED, (data: { items: ProductId[], total: number }) => this.orderCreatedCallback(data));
		this.events.on(ApplicationEvents.ORDER_PAYMENT_SELECTED, (order: Partial<Order>) => this.orderFormedCallback(order));
		this.events.on(ApplicationEvents.ORDER_PLACED, (order: Partial<Order>) => this.orderPlacedCallback(order));
	}

	private catalogCardSelectedCallback(data: { id: ProductId }): void {
		const inCart = this.cartPresenter.isProductInCart(data.id);
		this.openModal(this.mainPagePresenter.renderCardPreview(data.id, inCart));
	}

	private cartContentChangedCallback(): void {
		const renderedCardPreviewId = this.mainPagePresenter.currentCardPreviewId();
		const inCart = this.cartPresenter.isProductInCart(renderedCardPreviewId);

		this.mainPagePresenter.renderCardPreview(renderedCardPreviewId, inCart);
	}

	private cartOpenedCallback() {
		this.openModal(this.cartPresenter.renderCart());
	}

	private orderCreatedCallback(data: { items: ProductId[], total: number }) {
		this.order = data as Order;
		this.openModal(this.orderForm.render());
	}

	private orderFormedCallback(order: Partial<Order>) {
		this.order = Object.assign(this.order, order);
		this.openModal(this.contactsForm.render());
	}

	private orderPlacedCallback(order: Partial<Order>) {
		this.order = Object.assign(this.order, order);

		this.api.placeOrder(this.order).then(data => {
			this.openModal(this.orderSuccessView.render({total: data.total}));
			this.cartPresenter.clearCart();
		})
			.catch(error => {
				console.log(error)
			});
	}

	//TODO implement order state with modal?

	private openModal(content: HTMLElement): void {
		this.modal.close();
		this.modal.content = content;
		this.modal.open();
	}

}