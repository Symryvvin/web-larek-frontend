import { CatalogPresenter } from "./CatalogPresenter";
import { Presenter } from "../base/Presenter";
import { ApplicationApi } from "../ApplicationApi";
import { IEvents } from "../base/events";
import { Modal } from "../view/Modal";
import { ApplicationEvents, IModal, ProductId } from "../../types";
import { CartPresenter } from "./CartPresenter";

export class ApplicationPresenter extends Presenter {
	protected modal: IModal;

	constructor(protected readonly api: ApplicationApi,
	            protected readonly events: IEvents,
	            protected readonly catalogPresenter: CatalogPresenter,
	            protected readonly cartPresenter: CartPresenter) {
		super(api, events);
	}

	init(): void {
		this.modal = new Modal(document.querySelector('#modal-container') as HTMLTemplateElement);

		this.events.on(ApplicationEvents.CATALOG_CARD_SELECTED, (data: { id: ProductId }) => {
			const inCart = this.cartPresenter.isProductInCart(data.id);
			this.openModal(this.catalogPresenter.renderCardPreview(data.id, inCart));
		});

		this.events.on(ApplicationEvents.CART_ITEM_ADDED, (data: { id: ProductId }) => {
			const product = this.catalogPresenter.findCatalogItemById(data.id);
			this.cartPresenter.addProductToCart(product);
		});

		this.events.on(ApplicationEvents.CART_CONTENT_CHANGED, () => {
			const renderedCardPreviewId = this.catalogPresenter.currentCardPreviewId();
			const inCart = this.cartPresenter.isProductInCart(renderedCardPreviewId);

			this.catalogPresenter.renderCardPreview(renderedCardPreviewId, inCart);
		});

		this.events.on(ApplicationEvents.CART_OPENED, () => {
			this.openModal(this.cartPresenter.renderCart());
		});

		document.querySelector('.header__basket').addEventListener('click', (event: Event) => {
			event.preventDefault();
			this.events.emit(ApplicationEvents.CART_OPENED);
		})
	}

	render(): void {
		console.log('renderView');
	}

	openModal(content: HTMLElement): void {
		this.modal.content = content;
		this.modal.open();
	}

}