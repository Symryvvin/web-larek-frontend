import { CatalogPresenter } from "./CatalogPresenter";
import { Presenter } from "../base/Presenter";
import { ApplicationApi } from "../ApplicationApi";
import { IEvents } from "../base/events";
import { Modal } from "../view/Modal";
import { ApplicationEvents, IModal, ProductId } from "../../types";

export class ApplicationPresenter extends Presenter {
	protected modal: IModal;

	constructor(protected readonly api: ApplicationApi,
	            protected readonly events: IEvents,
	            protected readonly catalogPresenter: CatalogPresenter) {
		super(api, events);
	}

	init(): void {
		this.modal = new Modal(document.querySelector('#modal-container') as HTMLTemplateElement);

		this.events.on(ApplicationEvents.CATALOG_CARD_SELECTED, (data: { id: ProductId }) => {
			//TODO check card is added to card by id, and if currentCardPreview id equals render preview
			this.openModal(this.catalogPresenter.renderCardPreview(data.id, false));
		});

		this.events.on(ApplicationEvents.CART_ITEM_ADDED, (data: { id: ProductId }) => {
			this.catalogPresenter.renderCardPreview(data.id, true);
		});

		this.events.on(ApplicationEvents.CART_ITEM_DELETED, (data: { id: ProductId }) => {
			this.catalogPresenter.renderCardPreview(data.id, false);
		});
	}

	renderView(): void {
		this.catalogPresenter.renderView();
	}

	openModal(content: HTMLElement): void {
		this.modal.content = content;
		this.modal.open();
	}

}