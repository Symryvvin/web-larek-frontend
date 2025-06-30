export type ProductId = string;

export type Product = {
	id: ProductId;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number;
}

export type PaymentMethod = 'online' | 'on_delivery';
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
	items: Product[];
	getItemById: (id: string) => Product;
}

export type TCartProducts = {
	items: Product[];
	price: number;
}
export interface ICartModel {
	items: Product[];
	addItem: (item: Product) => void;
	itemInCart: (id: ProductId) => boolean;
	removeItemById: (id: ProductId) => void;
	clear: () => void;
	getCartProducts: () => TCartProducts;
}

export type TOrderSuccessful = {
	id: string;
	total: number;
}

export type TFormValidationError = string | undefined;

export interface IModal {
	content: HTMLElement;
	open: () => void;
	close: () => void;
}

export interface IPresenter {
	init: () => void;
}

export enum ApplicationEvents {
	CATALOG_ITEMS_LOADED = 'catalog:items_loaded',
	CATALOG_CARD_SELECTED = 'catalog:card_selected',
	CART_OPENED = 'cart:opened',
	CART_ITEM_ADDED = 'cart:item_added',
	CART_ITEM_DELETED = 'cart:item_deleted',
	CART_CONTENT_CHANGED = 'cart:content_changed',
	CART_ORDER_SUBMITTED = 'cart:order_submitted',
	ORDER_CREATED = 'order:created',
	ORDER_PAYMENT_SELECTED = 'order:payment_selected',
	ORDER_PLACED = 'order:placed',
	MODAL_OPENED = 'modal:opened',
	MODAL_CLOSED = 'modal:closed'
}
