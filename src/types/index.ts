import { EventEmitter } from '../components/base/events';
import { Api } from '../components/base/api';

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

interface ICatalogModel {
	items: Product[];
	addItems: (items: Product[]) => void;
	getItemById: (id: string) => Product;
}

interface ICartModel {
	items: Product[];
	addItem: (item: Product) => void;
	removeItemById: (id: ProductId) => void;
	clear: () => void;
}

interface IView {
	render: (data?: object) => HTMLElement;
}

interface IViewConstructor<T extends IView> {
	new(template: HTMLTemplateElement): T;
}

interface IMainPageView extends IView {
	catalog: HTMLElement;
	cartItemsCount: HTMLElement;
}

interface ICatalogView extends IView {
	cards: HTMLElement[];
}

interface ICartView extends IView {
	cards: HTMLElement[];
	totalPriceLabel: HTMLElement;
}

interface ICardView extends IView {}

interface IForm extends IView {
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
	api: Api;
	events: EventEmitter;
	init: () => void;
	renderView: () => void;
}