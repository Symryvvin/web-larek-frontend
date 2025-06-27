import './scss/styles.scss';
import { ApplicationApi } from './components/ApplicationApi';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';

const api = new ApplicationApi(new Api(API_URL));


api.getProducts().then(data => console.log(data));
api.getProduct('854cef69-976d-4c2a-a18c-2aa45046c390').then(data => console.log(data));
api.placeOrder({
	"payment": "online",
	"email": "test@test.ru",
	"phone": "+71234567890",
	"address": "Spb Vosstania 1",
	"total": 2200,
	"items": [
		"854cef69-976d-4c2a-a18c-2aa45046c390",
		"c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
	]
}).then(data => console.log(data));