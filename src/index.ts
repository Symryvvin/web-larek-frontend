import './scss/styles.scss';
import { ApplicationApi } from './components/ApplicationApi';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { CatalogModel } from './components/CatalogModel';
import { cloneTemplate } from './utils/utils';
import { CardInCatalog } from './components/CardInCatalog';
import { Product } from './types';
import { EventEmitter } from './components/base/events';

const api = new ApplicationApi(new Api(API_URL));
const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const cardInCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;

api.getProducts().then(data => {
	catalogModel.addItems(data.items);
})
	.catch(error => {
		console.log(error)
	});


events.on('catalog:items_loaded', (data: Product[]) => {
	const elems = Array.from(data).map(item => {
		return new CardInCatalog(cloneTemplate(cardInCatalogTemplate), item.id).render(item);
	});

	console.log(elems);
	document.querySelector('.gallery').append(...elems);
})