export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {
	}

	protected setText(element: HTMLElement, value: string | number): void {
		element.textContent = String(value);
	}

	protected toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	protected setDisabled(element: HTMLElement, state: boolean) {
		if (state) {
			element.setAttribute('disabled', 'disabled');
		} else {
			element.removeAttribute('disabled');
		}
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
