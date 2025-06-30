import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { TErrorMessage } from "../../types";

export class ErrorMessageView extends Component<TErrorMessage> {
	protected messageElement: HTMLParagraphElement;
	protected closeButton: HTMLButtonElement;

	protected _onClose: () => void;

	constructor(protected readonly container: HTMLElement) {
		super(container);

		this.messageElement = ensureElement<HTMLParagraphElement>('.error-message__description', this.container);
		this.closeButton = ensureElement<HTMLButtonElement>('.error__close', this.container);
		this.closeButton.addEventListener('click', () => {
			this.setText(this.messageElement, '');
			this._onClose();
		})
	}

	set onClose(onClose: () => void) {
		this._onClose = onClose;
	}

	set error(value: number) {
		this.setText(this.messageElement, value);
	}

}