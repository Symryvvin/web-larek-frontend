import { Component } from '../base/Component';
import { ApplicationEvents, Product, ProductId } from '../../types';
import { ensureElement } from '../../utils/utils';
import { CDN_URL } from "../../utils/constants";
import { IEvents } from "../base/events";

export class Card extends Component<Product> {
	protected _productId: ProductId;
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

		this.setButtonText();
		this.cardButton.addEventListener('click', (event: MouseEvent) => {
			event.preventDefault();
			const appEventName = this._inCart ? ApplicationEvents.CART_ITEM_DELETED : ApplicationEvents.CART_ITEM_ADDED
			this.events.emit(appEventName, {id: this._productId});
		});
	}

	private setButtonText() {
		this.cardButton.textContent = this._inCart ? CardPreviewButtonText.IN_CART : CardPreviewButtonText.ADD_TO_CARD;
	}

	set id(productId: ProductId) {
		this._productId = productId;
	}

	get id(): ProductId {
		return this._productId;
	}

	set inCart(inCart: boolean) {
		this._inCart = inCart;
		this.setButtonText();
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
}

export class CardInCart extends Component<Product> {
	protected _productId: ProductId;
	protected indexElement: HTMLSpanElement;
	protected titleElement: HTMLHeadingElement;
	protected priceElement: HTMLSpanElement;
	protected deleteCardButton: HTMLButtonElement;

	constructor(container: HTMLElement, readonly events: IEvents) {
		super(container);

		this.indexElement = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
		this.titleElement = ensureElement<HTMLHeadingElement>('.card__title', this.container);
		this.priceElement = ensureElement<HTMLSpanElement>('.card__price', this.container);

		this.deleteCardButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

		this.deleteCardButton.addEventListener('click', (event: MouseEvent) => {
			event.preventDefault();
			events.emit(ApplicationEvents.CART_ITEM_DELETED, {id: this._productId});
		});
	}

	set id(productId: ProductId) {
		this._productId = productId;
	}

	set index(index: number) {
		this.indexElement.textContent = index.toString();
	}

	set title(title: string) {
		this.titleElement.textContent = title;
	}

	set price(title: string) {
		this.priceElement.textContent = title;
	}

}