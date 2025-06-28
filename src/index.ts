import './scss/styles.scss';
import { ApplicationApi } from './components/ApplicationApi';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { MainPagePresenter } from "./components/presenter/MainPagePresenter";
import { ApplicationPresenter } from "./components/presenter/ApplicationPresenter";
import { CartPresenter } from "./components/presenter/CartPresenter";

const api = new ApplicationApi(new Api(API_URL));
const events = new EventEmitter();

const catalogPresenter = new MainPagePresenter(api, events);
catalogPresenter.init();
const cartPresenter = new CartPresenter(api, events);
cartPresenter.init();
new ApplicationPresenter(api, events, catalogPresenter, cartPresenter).init();