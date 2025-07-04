import { PagePresenter } from "./PagePresenter";
import { Presenter } from "../base/Presenter";
import { ApplicationApi } from "../ApplicationApi";
import { IEvents } from "../base/events";
import { ApplicationEvents, IModal, Order, ProductId, TErrorMessage } from "../../types";
import { CartPresenter } from "./CartPresenter";
import { OrderSuccessView } from "../view/OrderSuccessView";
import { ContactsForm, Form, OrderForm } from "../view/Form";
import { Modal } from "../view/Modal";
import { HTMLTemplates } from "../HTMLTemplates";
import { cloneTemplate } from "../../utils/utils";
import { ErrorMessageView } from "../view/ErrorMessageView";

export class ApplicationPresenter extends Presenter {
	protected readonly modal: IModal;
	protected readonly orderForm: Form<Order>;
	protected readonly contactsForm: Form<Order>;
	protected readonly orderSuccessView: OrderSuccessView;
	protected readonly errorMessageView: ErrorMessageView;

	protected order: Order;

	constructor(protected readonly api: ApplicationApi,
	            protected readonly events: IEvents,
	            protected readonly mainPagePresenter: PagePresenter,
	            protected readonly cartPresenter: CartPresenter
	) {
		super(api, events);

		this.modal = new Modal(HTMLTemplates.modal, events);
		this.orderForm = new OrderForm(cloneTemplate(HTMLTemplates.orderForm), events);
		this.contactsForm = new ContactsForm(cloneTemplate(HTMLTemplates.contactsForm), events);
		this.orderSuccessView = new OrderSuccessView(cloneTemplate(HTMLTemplates.orderSuccess));
		this.orderSuccessView.onClose = () => {
			this.modal.close();
		};
		this.errorMessageView = new ErrorMessageView(cloneTemplate(HTMLTemplates.error));
		this.errorMessageView.onClose = () => {
			this.modal.close();
		};
	}

	init(): void {
		this.events.on(ApplicationEvents.CATALOG_CARD_SELECTED, (data: { id: ProductId }) => this.catalogCardSelectedCallback(data));
		this.events.on(ApplicationEvents.CART_OPENED, () => this.cartOpenedCallback());
		this.events.on(ApplicationEvents.ORDER_CREATED, (data: { items: ProductId[], total: number }) => this.orderCreatedCallback(data));
		this.events.on(ApplicationEvents.ORDER_PAYMENT_SELECTED, (order: Partial<Order>) => this.orderFormedCallback(order));
		this.events.on(ApplicationEvents.ORDER_PLACED, (order: Partial<Order>) => this.orderPlacedCallback(order));
		this.events.on(ApplicationEvents.APP_FAILED, (data: TErrorMessage) => this.applicationErrorCallback(data));
	}

	private catalogCardSelectedCallback(data: { id: ProductId }): void {
		const inCart = this.cartPresenter.isProductInCart(data.id);
		this.openModal(this.mainPagePresenter.renderCardPreview(data.id, inCart));
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
				this.events.emit(ApplicationEvents.APP_FAILED, {error: error});
			});
	}

	private applicationErrorCallback(data: TErrorMessage) {
		this.openModal(this.errorMessageView.render(data));
	}

	private openModal(content: HTMLElement): void {
		this.modal.close();
		this.modal.content = content;
		this.modal.open();
	}


}