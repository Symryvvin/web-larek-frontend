type ProductId = string;

type Product = {
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

type Order = {
	payment: PaymentMethod;
	email: Email;
	phone: Phone;
	address: string;
	total: number;
	items: ProductId[];
}

interface ICatalogModel {
	items: Product[];
	addItems: (items: Product[]) => void;
	getItemById: (id: string) => Product;
}

interface ICartModel {
	items: ProductId[];
	addItemById: (id: ProductId) => void;
	deleteItemById: (id: ProductId) => void;
	placeOrder: () => void;
}

interface IView {
	render: (data?: object) => HTMLElement;
}

interface IViewConstructor {
	new(template: HTMLTemplateElement): IView;
}

interface IMainPage extends IView {
	cartItemsCount: HTMLElement;
	catalog: HTMLElement;
}

interface ICatalog extends IView {
	items: HTMLElement[];
}

interface ICart extends IView {
	items: HTMLElement[];
	total: HTMLElement;
}

interface ICard extends IView {}

interface ICardConstructor extends IViewConstructor {}

interface IForm extends IView {
	onSubmit: () => void;
	validate: () => void;
}

interface IFormConstructor extends IViewConstructor {
	onSubmit: () => void;
	validate: () => void;
}

interface IModal {
	content: HTMLElement;
	open: () => void;
	close: () => void;
	setContent: (content: HTMLElement) => void;
}
