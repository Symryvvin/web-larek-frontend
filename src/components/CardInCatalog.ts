import { Component } from './base/Component';
import { Product, ProductId } from '../types';
import { ensureElement } from '../utils/utils';
import { CDN_URL } from "../utils/constants";

export class CardInCatalog extends Component<Product> {
	protected readonly _productId: ProductId;
	protected titleElement: HTMLHeadingElement;
	protected categoryElement: HTMLSpanElement;
	protected imageElement: HTMLImageElement;
	protected priceElement: HTMLSpanElement;

	constructor(container: HTMLElement, productId: ProductId) {
		super(container);
		this._productId = productId;

		this.titleElement = ensureElement<HTMLHeadingElement>('.card__title', this.container);
		this.categoryElement = ensureElement<HTMLSpanElement>('.card__category', this.container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
		this.priceElement = ensureElement<HTMLSpanElement>('.card__price', this.container);

		this.container.addEventListener('click', e => {
			e.preventDefault();
			console.log('clicked' + this._productId);
		});
	}

	get productId() {
		return this._productId;
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
