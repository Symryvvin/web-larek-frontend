import './scss/styles.scss';
import { ApplicationApi } from './components/ApplicationApi';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { CatalogPresenter } from "./components/presenter/CatalogPresenter";
import { ApplicationPresenter } from "./components/presenter/ApplicationPresenter";

const api = new ApplicationApi(new Api(API_URL));
const events = new EventEmitter();

const catalogPresenter = new CatalogPresenter(api, events);
catalogPresenter.init();
const appPresenter = new ApplicationPresenter(api, events, catalogPresenter);
appPresenter.init();