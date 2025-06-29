import { Component } from "../base/Component";
import { ApplicationEvents, Product, TCartProducts } from "../../types";
import { IEvents } from "../base/events";
import { CardInCart } from "./Card";
import { cloneTemplate, ensureElement } from "../../utils/utils";

export class CartView extends Component<TCartProducts> {
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
	}

	set items(items: Product[]) {
		let index = 1;
		this._cards = items.map(item => {
			const card = new CardInCart(cloneTemplate(this.cardTemplate), this.events);
			card.index = index++;
			return card.render(item);
		});

		const totalPrice = items.reduce((total, item) => total + item.price, 0);

		this.itemListElement.replaceChildren(...this._cards);
		this.totalPriceElement.textContent = totalPrice.toString();

		this.cartButton.onclick = () =>
			this.events.emit(ApplicationEvents.ORDER_CREATED, {
				items: items.map(item => item.id),
				total: totalPrice
			});
	}

	get content(): HTMLElement {
		return this.container;
	}

}