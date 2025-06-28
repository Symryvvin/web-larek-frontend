import { Component } from "../base/Component";
import { Product } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/events";

export class CatalogView extends Component<{ items: Product[] }> {
	protected _cards: HTMLElement[];

	constructor(protected readonly container: HTMLElement,
	            protected readonly cardTemplate: HTMLTemplateElement,
	            protected readonly events: IEvents) {
		super(container);
	}

	set items(items: Product[]) {
		this._cards = items.map(item => {
			return new Card(cloneTemplate(this.cardTemplate), this.events).render(item);
		});

		this.container.replaceChildren(...this._cards);
	}

}