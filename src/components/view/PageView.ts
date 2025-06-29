import { Component } from "../base/Component";
import { ApplicationEvents, Product } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { CatalogCard } from "./Card";
import { IEvents } from "../base/events";

type TMainPage = {
	items: Product[];
	totalInCart: number;
}

export class PageView extends Component<TMainPage> {
	protected _cards: HTMLElement[];
	protected galleryElement: HTMLElement;
	protected cartButton: HTMLButtonElement;
	protected cartItemsCount: HTMLSpanElement;

	protected pageWrapperElement: HTMLElement;

	constructor(protected readonly container: HTMLElement,
	            protected readonly cardTemplate: HTMLTemplateElement,
	            protected readonly events: IEvents) {
		super(container);

		this.pageWrapperElement = ensureElement<HTMLElement>('.page__wrapper', this.container);
		this.galleryElement = ensureElement<HTMLElement>('.gallery', this.container);
		this.cartButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
		this.cartItemsCount = ensureElement<HTMLButtonElement>('.header__basket-counter', this.container);
		this.cartButton.addEventListener('click', (event: Event) => {
			event.preventDefault();
			this.events.emit(ApplicationEvents.CART_OPENED);
		})
	}

	set items(items: Product[]) {
		this._cards = items.map(item => {
			return new CatalogCard(cloneTemplate(this.cardTemplate), this.events).render(item);
		});

		this.galleryElement.replaceChildren(...this._cards);
	}

	set totalInCart(value: number) {
		this.setText(this.cartItemsCount, value);
	}

	set lock(lock: boolean) {
		if (lock) {
			this.toggleClass(this.pageWrapperElement, 'page__wrapper_locked' ,true);
		} else {
			this.toggleClass(this.pageWrapperElement, 'page__wrapper_locked' ,false);
		}
	}

}