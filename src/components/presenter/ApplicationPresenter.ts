import { MainPagePresenter } from "./MainPagePresenter";
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
	            protected readonly mainPagePresenter: MainPagePresenter,
	            protected readonly cartPresenter: CartPresenter) {
		super(api, events);
	}

	init(): void {
		this.modal = new Modal(document.querySelector('#modal-container') as HTMLTemplateElement);

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
	}

	openModal(content: HTMLElement): void {
		this.modal.content = content;
		this.modal.open();
	}

}