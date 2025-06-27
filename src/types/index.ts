export type ProductId = string;

export type Product = {
	id: ProductId;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number;
}

type PaymentMethod = 'online' | 'on_delivery';
type Email = string;
type Phone = string;

export type Order = {
	items: ProductId[];
	total: number;
	payment: PaymentMethod;
	address: string;
	email: Email;
	phone: Phone;
}

export interface ICatalogModel {
	addItems: (items: Product[]) => void;
	getItemById: (id: string) => Product;
}

interface ICartModel {
	items: Product[];
	addItem: (item: Product) => void;
	removeItemById: (id: ProductId) => void;
	clear: () => void;
}

interface IForm {
	submitButton: HTMLButtonElement;
	onSubmit: () => void;
	validate: () => void;
	getFormData: () => object;
}

interface IModal {
	content: HTMLElement;
	open: () => void;
	close: () => void;
	setContent: (content: HTMLElement) => void;
}

interface IPresenter {
	init: () => void;
	renderView: () => void;
}