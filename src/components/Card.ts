import { Component } from './base/Component';
import { ApplicationEvents, Product, ProductId } from '../types';
import { ensureElement } from '../utils/utils';
import { CDN_URL } from "../utils/constants";
import { IEvents } from "./base/events";

export class Card extends Component<Product> {
	protected  _productId: ProductId;
	protected titleElement: HTMLHeadingElement;
	protected categoryElement: HTMLSpanElement;
	protected imageElement: HTMLImageElement;
	protected priceElement: HTMLSpanElement;

	constructor(container: HTMLElement, readonly events: IEvents) {
		super(container);

		this.titleElement = ensureElement<HTMLHeadingElement>('.card__title', this.container);
		this.categoryElement = ensureElement<HTMLSpanElement>('.card__category', this.container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
		this.priceElement = ensureElement<HTMLSpanElement>('.card__price', this.container);

		this.container.addEventListener('click', (event: MouseEvent) => {
			event.preventDefault();
			events.emit(ApplicationEvents.CATALOG_CARD_SELECTED, {id: this._productId});
		});
	}

	set id(productId: ProductId) {
		this._productId = productId;
	}

	set title(title: string) {
		this.titleElement.textContent = title;
	}

	set category(title: string) {
		this.categoryElement.textContent = title;
	}

	set image(src: string) {
		this.imageElement.src = `${CDN_URL}/${src}`;
		this.imageElement.alt = this.titleElement.textContent;
	}

	set price(title: string) {
		this.priceElement.textContent = title;
	}

}

enum CardPreviewButtonText {
	ADD_TO_CARD = 'В корзину',
	IN_CART = 'Убрать из корзины'
}

export class CardPreview extends Component<Product> {
	protected _productId: ProductId;
	protected _inCart: boolean;
	protected titleElement: HTMLHeadingElement;
	protected categoryElement: HTMLSpanElement;
	protected imageElement: HTMLImageElement;
	protected priceElement: HTMLSpanElement;
	protected descriptionElement: HTMLParagraphElement;
	protected cardButton: HTMLButtonElement;

	constructor(container: HTMLElement, readonly events: IEvents) {
		super(container);

		this.titleElement = ensureElement<HTMLHeadingElement>('.card__title', this.container);
		this.categoryElement = ensureElement<HTMLSpanElement>('.card__category', this.container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
		this.priceElement = ensureElement<HTMLSpanElement>('.card__price', this.container);
		this.descriptionElement = ensureElement<HTMLParagraphElement>('.card__text', this.container);
		this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

		this.toggleCartState(this._inCart);
	}

	set id(productId: ProductId) {
		this._productId = productId;
	}

	set inCart(inCart: boolean) {
		this._inCart = inCart;
	}

	set title(title: string) {
		this.titleElement.textContent = title;
	}

	set category(title: string) {
		this.categoryElement.textContent = title;
	}

	set image(src: string) {
		this.imageElement.src = `${CDN_URL}/${src}`;
		this.imageElement.alt = this.titleElement.textContent;
	}

	set price(title: string) {
		this.priceElement.textContent = title;
	}

	set description(title: string) {
		this.descriptionElement.textContent = title;
	}

	toggleCartState(inCart: boolean) {
		if (inCart) {
			this.cardButton.textContent = CardPreviewButtonText.IN_CART;
			this.cardButton.onclick = (event: MouseEvent) => {
				event.preventDefault();
				this.events.emit(ApplicationEvents.CART_ITEM_DELETED, {id: this._productId});
				this.cardButton.textContent = CardPreviewButtonText.ADD_TO_CARD;
			}
		} else {
			this.cardButton.textContent = CardPreviewButtonText.ADD_TO_CARD;
			this.cardButton.onclick = (event: MouseEvent) => {
				event.preventDefault();
				this.events.emit(ApplicationEvents.CART_ITEM_ADDED, {id: this._productId});
				this.cardButton.textContent = CardPreviewButtonText.IN_CART;
			}
		}
	}
}

