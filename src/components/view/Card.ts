import { Component } from '../base/Component';
import { ApplicationEvents, Product, ProductId } from '../../types';
import { ensureElement } from '../../utils/utils';
import { CDN_URL } from "../../utils/constants";
import { IEvents } from "../base/events";

abstract class Card extends Component<Product> {
	protected _productId: ProductId;
	protected titleElement: HTMLHeadingElement;
	protected priceElement: HTMLSpanElement;

	protected constructor(protected readonly container: HTMLElement,
	                      protected readonly events: IEvents) {
		super(container);

		this.titleElement = ensureElement<HTMLHeadingElement>('.card__title', this.container);
		this.priceElement = ensureElement<HTMLSpanElement>('.card__price', this.container);
	}

	set id(productId: ProductId) {
		this._productId = productId;
	}

	get id(): ProductId {
		return this._productId;
	}

	set title(value: string) {
		this.setText(this.titleElement, value);
	}

	set price(value: string) {
		this.setText(this.priceElement, value === null ? 'Бесплатно' : value);
	}

}

abstract class GalleryCard extends Card {
	protected categoryElement: HTMLSpanElement;
	protected imageElement: HTMLImageElement;
	protected priceElement: HTMLSpanElement;

	protected constructor(protected readonly container: HTMLElement,
	                      protected readonly events: IEvents) {
		super(container, events);

		this.categoryElement = ensureElement<HTMLSpanElement>('.card__category', this.container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
	}

	set category(value: string) {
		this.setText(this.categoryElement, value);
	}

	set image(src: string) {
		this.imageElement.src = `${CDN_URL}/${src}`;
		this.imageElement.alt = this.titleElement.textContent;
	}

}

export class CatalogCard extends GalleryCard {
	protected categoryElement: HTMLSpanElement;
	protected imageElement: HTMLImageElement;
	protected priceElement: HTMLSpanElement;

	constructor(protected readonly container: HTMLElement,
	            protected readonly events: IEvents) {
		super(container, events);

		this.container.addEventListener('click', () => {
			events.emit(ApplicationEvents.CATALOG_CARD_SELECTED, {id: this._productId});
		});
	}

}

enum CardPreviewButtonText {
	ADD_TO_CARD = 'В корзину',
	IN_CART = 'Убрать из корзины'
}

export class CardPreview extends GalleryCard {
	protected _inCart: boolean;
	protected descriptionElement: HTMLParagraphElement;
	protected cardButton: HTMLButtonElement;

	constructor(protected readonly container: HTMLElement,
	            protected readonly events: IEvents) {
		super(container, events);

		this.descriptionElement = ensureElement<HTMLParagraphElement>('.card__text', this.container);
		this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
		this.cardButton.addEventListener('click', () => {
			const appEventName = this._inCart ? ApplicationEvents.CART_ITEM_DELETED : ApplicationEvents.CART_ITEM_ADDED
			this.events.emit(appEventName, {id: this._productId});
		});

		this.setButtonText();
	}

	private setButtonText() {
		this.setText(this.cardButton, this._inCart ? CardPreviewButtonText.IN_CART : CardPreviewButtonText.ADD_TO_CARD);
	}

	set inCart(value: boolean) {
		this._inCart = value;
		this.setButtonText();
	}

	set description(value: string) {
		this.setText(this.descriptionElement, value);
	}
}

export class CardInCart extends Card {
	protected indexElement: HTMLSpanElement;
	protected deleteCardButton: HTMLButtonElement;

	constructor(protected readonly container: HTMLElement, protected readonly events: IEvents) {
		super(container, events);

		this.indexElement = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
		this.deleteCardButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
		this.deleteCardButton.addEventListener('click', (event: MouseEvent) => {
			event.preventDefault();
			events.emit(ApplicationEvents.CART_ITEM_DELETED, {id: this._productId});
		});
	}

	set index(value: number) {
		this.setText(this.indexElement, value);
	}

}