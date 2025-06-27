import { Api } from './base/api';
import { Product, ProductId, Order } from '../types';

export class ApplicationApi {

	protected api: Api;

	constructor(api: Api) {
		this.api = api;
	}

	getProducts(): Promise<Product[]> {
		return this.api.get('/product');
	}

	getProduct(id: ProductId): Promise<Product> {
		return this.api.get(`/product/${id}`);
	}

	placeOrder(order: Order): Promise<{id: string, total: number}> {
		return this.api.post(`/order`, order);
	}

}