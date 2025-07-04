import { Component } from "../base/Component";
import { ApplicationEvents, Product, TCartData } from "../../types";
import { IEvents } from "../base/events";
import { CardInCart } from "./Card";
import { cloneTemplate, ensureElement } from "../../utils/utils";

export class CartView extends Component<TCartData> {
	protected _cards: HTMLElement[];
	protected itemListElement: HTMLUListElement;
	protected totalPriceElement: HTMLSpanElement;
	protected cartButton: HTMLButtonElement;

	constructor(protected readonly container: HTMLElement,
	            protected readonly cardTemplate: HTMLTemplateElement,
	            protected readonly events: IEvents) {
		super(container);

		this.itemListElement = ensureElement<HTMLUListElement>('.basket__list', this.container);
		this.totalPriceElement = ensureElement<HTMLSpanElement>('.basket__price', this.container);
		this.cartButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
		this.cartButton.addEventListener('click', () => {
			this.events.emit(ApplicationEvents.CART_ORDER_SUBMITTED)
		});

		this.setDisabled(this.cartButton, true);
	}

	set items(items: Product[]) {
		let index = 1;
		this._cards = items.map(item => {
			const card = new CardInCart(cloneTemplate(this.cardTemplate), this.events);
			card.index = index++;
			return card.render(item);
		});
		this.itemListElement.replaceChildren(...this._cards);
		this.setDisabled(this.cartButton, this._cards.length === 0);
	}

	set price(value: number) {
		this.setText(this.totalPriceElement, `${value} синапсов`);
	}

}