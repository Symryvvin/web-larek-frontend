import './scss/styles.scss';
import { ApplicationApi } from './components/ApplicationApi';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { CatalogModel } from './components/CatalogModel';
import { cloneTemplate } from './utils/utils';
import { Card, CardPreview } from './components/Card';
import { ApplicationEvents, Product, ProductId } from './types';
import { EventEmitter } from './components/base/events';
import { Modal } from "./components/Modal";

const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const modalTemplate = document.querySelector('#modal-container') as HTMLTemplateElement;

const api = new ApplicationApi(new Api(API_URL));
const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const modal = new Modal(modalTemplate);

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);

api.getProducts().then(data => {
	catalogModel.items = data.items;
})
	.catch(error => {
		console.log(error)
	});


events.on(ApplicationEvents.CATALOG_ITEMS_LOADED, (data: Product[]) => {
	const elems = Array.from(data).map(item => {
		return new Card(cloneTemplate(cardTemplate), events).render(item);
	});

	document.querySelector('.gallery').append(...elems);
});

events.on(ApplicationEvents.CATALOG_CARD_SELECTED, (data: { id: ProductId }) => {
	api.getProduct(data.id)
		.then(product => {
			modal.content = cardPreview.render(product);
			modal.open();
		}).catch(error => {
		console.log(error);
	})
});

events.on(ApplicationEvents.CART_ITEM_ADDED, (data: { id: ProductId }) => {
	//TODO check card state in cart by id in current preview
	cardPreview.toggleCartState(true);
	cardPreview.render(catalogModel.getItemById(data.id));

	//TODO cart content render
});

events.on(ApplicationEvents.CART_ITEM_DELETED, (data: { id: ProductId }) => {
	//TODO check card state in cart by id in current preview
	cardPreview.toggleCartState(false);
	cardPreview.render(catalogModel.getItemById(data.id));

	//TODO cart content render
})