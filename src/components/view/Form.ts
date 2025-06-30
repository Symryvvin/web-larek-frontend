import { Component } from "../base/Component";
import { IForm, Order, PaymentMethod, TFormValidationError } from "../../types";
import { ensureAllElements, ensureElement, formatPhone } from "../../utils/utils";

export abstract class Form<T> extends Component<T> implements IForm {
	protected formValidationErrorsElement: HTMLSpanElement;
	protected submitButton: HTMLButtonElement;

	protected _onSubmit: () => void;

	protected constructor(protected readonly container: HTMLElement) {
		super(container);

		this.formValidationErrorsElement = ensureElement<HTMLSpanElement>('.form__errors', this.container);
		this.submitButton = ensureElement<HTMLButtonElement>('button[type=\'submit\'', this.container);
		this.submitButton.addEventListener('click', (event: SubmitEvent) => {
			event.preventDefault();
			this._onSubmit();
		})
	}

	protected validateInput(input: HTMLInputElement): TFormValidationError {
		const inputLabel = ensureElement<HTMLSpanElement>('.form__label', input.parentNode as HTMLElement);
		if (input.validity.patternMismatch) {
			input.setCustomValidity(input.dataset.errorMessage);
		}

		if (!input.validity.valid) {
			return `${inputLabel.textContent}: ${input.validationMessage}`;
		}

		return undefined;
	}

	abstract validate(): void;

	abstract getFormData(): Partial<T>;

	set onSubmit(onSubmit: () => void) {
		this._onSubmit = onSubmit;
	}

	set errors(errors: TFormValidationError[]) {
		const isValid = errors.every(error => error === undefined);
		const errMessage = errors.filter(err => err !== undefined)
			.join(' ');

		this.setDisabled(this.submitButton, !isValid);
		this.setText(this.formValidationErrorsElement, isValid ? '' : errMessage);
	}

}

export class OrderForm extends Form<Order> {
	protected paymentButtons: HTMLButtonElement[];
	protected addressInput: HTMLInputElement;

	constructor(container: HTMLElement) {
		super(container);

		this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons button', this.container);
		this.paymentButtons.forEach((button: HTMLButtonElement) => {
			button.addEventListener("click", () => {
				this.switchPaymentMethod(button);
				this.validate();
			})
		})

		this.addressInput = ensureElement<HTMLInputElement>('.form__input[name=\'address\']', this.container);
		this.addressInput.addEventListener('input', (event: UIEvent) => {
			event.preventDefault();
			this.validate();
		})
	}

	private switchPaymentMethod(button: HTMLButtonElement): void {
		this.paymentButtons.forEach((button: HTMLButtonElement) => {
			button.classList.remove('button_alt-active');
		})

		button.classList.add('button_alt-active');
	}

	validate(): void {
		this.errors = [
			this.validatePaymentButtons(this.paymentButtons),
			this.validateInput(this.addressInput)
		];
	}

	/**
	 * Check is one and only one payment method button has active class in classList.
	 * @param buttons radio buttons array
	 * @private
	 */
	private validatePaymentButtons(buttons: HTMLButtonElement[]): TFormValidationError {
		const onlyOneButtonChecked = buttons.filter(button => {
			return button.classList.contains('button_alt-active')
		}).length === 1;

		if (onlyOneButtonChecked) {
			return undefined;
		} else {
			return 'Выберите тип оплаты';
		}
	}

	getFormData(): Partial<Order> {
		const paymentMethod = this.getPaymentMethod(this.paymentButtons);

		if (paymentMethod === undefined) {
			console.log('undefined payment method');
		}

		return {
			payment: paymentMethod,
			address: this.addressInput.value
		};
	}

	private getPaymentMethod(buttons: HTMLButtonElement[]): PaymentMethod | undefined {
		const activeButton = buttons.find(button => {
			return button.classList.contains('button_alt-active')
		});

		switch (activeButton.name) {
			case 'card':
				return 'online';
			case 'cash':
				return 'on_delivery';
			default:
				return undefined;
		}
	}

}

export class ContactsForm extends Form<Order> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(container: HTMLElement) {
		super(container);

		this.emailInput = ensureElement<HTMLInputElement>('.form__input[name=\'email\']', this.container);
		this.emailInput.addEventListener('input', (event: UIEvent) => {
			event.preventDefault();
			this.validate();
		})
		this.phoneInput = ensureElement<HTMLInputElement>('.form__input[name=\'phone\']', this.container);
		this.phoneInput.addEventListener('input', (event: UIEvent) => {
			event.preventDefault();
			this.phoneInput.value = formatPhone(this.phoneInput.value);
			this.validate();
		})
		this.phoneInput.value = formatPhone(this.phoneInput.value);
	}

	validate(): void {
		this.errors = [
			this.validateInput(this.emailInput),
			this.validateInput(this.phoneInput)
		];
	}

	getFormData(): Partial<Order> {
		return {
			email: this.emailInput.value,
			phone: this.phoneInput.value
		};
	}

}