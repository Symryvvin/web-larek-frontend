import { TOrderSuccessful } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class OrderSuccessView extends Component<TOrderSuccessful> {
	protected messageElement: HTMLParagraphElement;
	protected closeButton: HTMLButtonElement;

	protected _onClose: () => void;

	constructor(container: HTMLElement) {
		super(container);

		this.messageElement = ensureElement<HTMLParagraphElement>('.order-success__description', this.container);
		this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
		this.closeButton.addEventListener('click', (event: InputEvent) => {
			event.preventDefault();
			this.setText(this.messageElement, '');
			this._onClose();
		})
	}

	set onClose(onClose: () => void) {
		this._onClose = onClose;
	}

	set total(value: number) {
		this.setText(this.messageElement, `Списано ${value} синапсов`);
	}

}