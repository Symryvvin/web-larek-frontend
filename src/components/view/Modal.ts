import { IModal } from "../../types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

type ModalContent = {
	content: HTMLElement;
}

export class Modal extends Component<ModalContent> implements IModal {
	protected _content: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);

		this._content = ensureElement<HTMLElement>('.modal__content', this.container);
		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

		this.closeButton.addEventListener('click', () => this.close());
		this.container.addEventListener('click', () => this.close());
		this._content.addEventListener('click', (event: MouseEvent) => {
			event.stopPropagation();
		});
	}

	set content(content: HTMLElement) {
		this._content.replaceChildren(content);
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this._content.replaceChildren('');
	}

	open(): void {
		this.container.classList.add('modal_active');
	}

}