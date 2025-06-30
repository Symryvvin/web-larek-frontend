import './scss/styles.scss';
import { ApplicationApi } from './components/ApplicationApi';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { PagePresenter } from "./components/presenter/PagePresenter";
import { ApplicationPresenter } from "./components/presenter/ApplicationPresenter";
import { CartPresenter } from "./components/presenter/CartPresenter";
import { Modal } from "./components/view/Modal";
import { ApplicationElements } from "./components/Elements";
import { ContactsForm, OrderForm } from "./components/view/Form";
import { cloneTemplate } from "./utils/utils";
import { OrderSuccessView } from "./components/view/OrderSuccessView";
import { PageView } from "./components/view/PageView";
import { CardPreview } from "./components/view/Card";
import { CatalogModel } from "./components/model/CatalogModel";
import { CartModel } from "./components/model/CartModel";
import { CartView } from "./components/view/CartView";

const api = new ApplicationApi(new Api(API_URL));
const events = new EventEmitter();

const pageView = new PageView(ApplicationElements.page, ApplicationElements.cardTemplate, events);
const cardPreview = new CardPreview(cloneTemplate(ApplicationElements.cardPreviewTemplate), events);
const catalogModel = new CatalogModel(events);
const catalogPresenter = new PagePresenter(api, events, catalogModel, pageView, cardPreview,);
catalogPresenter.init();

const cartModel = new CartModel(events);
const cartView = new CartView(cloneTemplate(ApplicationElements.cartTemplate), ApplicationElements.cardInCartTemplate, events);
const cartPresenter = new CartPresenter(api, events, cartModel, cartView);
cartPresenter.init();

const modal = new Modal(ApplicationElements.modal, events);
const orderForm = new OrderForm(cloneTemplate(ApplicationElements.orderFormTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(ApplicationElements.contactsFormTemplate), events);
const orderSuccessView = new OrderSuccessView(cloneTemplate(ApplicationElements.orderSuccessTemplate));
new ApplicationPresenter(api, events, catalogPresenter, cartPresenter, modal, orderForm, contactsForm, orderSuccessView).init();


// enable debug add application events
const eventEmitter = events as EventEmitter;
eventEmitter.onAll((data: object) => {
	console.debug(data);
});