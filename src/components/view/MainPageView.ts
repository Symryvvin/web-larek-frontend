import { Component } from "../base/Component";
import { ApplicationEvents, Product } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/events";

type TMainPage = {
	items: Product[];
	totalInCart: number;
}

export class MainPageView extends Component<TMainPage> {
	protected _cards: HTMLElement[];
	protected galleryElement: HTMLElement;
	protected cartButton: HTMLButtonElement;
	protected cartItemsCount: HTMLSpanElement;

	constructor(protected readonly container: HTMLElement,
	            protected readonly cardTemplate: HTMLTemplateElement,
	            protected readonly events: IEvents) {
		super(container);

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
			return new Card(cloneTemplate(this.cardTemplate), this.events).render(item);
		});

		this.galleryElement.replaceChildren(...this._cards);
	}

	set totalInCart(totalInCart: number) {
		this.cartItemsCount.textContent = totalInCart.toString();
	}

}