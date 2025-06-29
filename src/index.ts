import './scss/styles.scss';
import { ApplicationApi } from './components/ApplicationApi';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { MainPagePresenter } from "./components/presenter/MainPagePresenter";
import { ApplicationPresenter } from "./components/presenter/ApplicationPresenter";
import { CartPresenter } from "./components/presenter/CartPresenter";
import { Modal } from "./components/view/Modal";
import { ApplicationElements } from "./components/Elements";
import { OrderForm } from "./components/view/Form";
import { cloneTemplate } from "./utils/utils";

const api = new ApplicationApi(new Api(API_URL));
const events = new EventEmitter();

const catalogPresenter = new MainPagePresenter(
	api,
	events,
	ApplicationElements.page,
	ApplicationElements.cardTemplate,
	ApplicationElements.cardPreviewTemplate,
);
catalogPresenter.init();

const cartPresenter = new CartPresenter(
	api,
	events,
	ApplicationElements.cartTemplate,
	ApplicationElements.cardInCartTemplate);
cartPresenter.init();

const modal = new Modal(ApplicationElements.modal, events);
const orderForm = new OrderForm(cloneTemplate(ApplicationElements.orderFormTemplate));
new ApplicationPresenter(api, events, catalogPresenter, cartPresenter, modal, orderForm)
	.init();


// enable debug add application events
const eventEmitter = events as EventEmitter;
eventEmitter.onAll((data: object) => {
	console.debug(data);
})