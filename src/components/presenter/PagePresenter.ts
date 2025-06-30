import { ApplicationEvents, ICatalogModel, Product, ProductId, TCartData } from "../../types";
import { CardPreview } from "../view/Card";
import { Presenter } from "../base/Presenter";
import { PageView } from "../view/PageView";
import { ApplicationApi } from "../ApplicationApi";
import { IEvents } from "../base/events";
import { cloneTemplate } from "../../utils/utils";
import { HTMLTemplates } from "../HTMLTemplates";
import { CatalogModel } from "../model/CatalogModel";

export class PagePresenter extends Presenter {
	protected readonly catalogModel: ICatalogModel;
	protected readonly pageView: PageView;
	protected readonly cardPreview: CardPreview;

	constructor(protected readonly api: ApplicationApi,
	            protected readonly events: IEvents) {
		super(api, events);

		this.catalogModel = new CatalogModel(events);
		this.pageView = new PageView(document.querySelector('.page') as HTMLElement, events);
		this.cardPreview = new CardPreview(cloneTemplate(HTMLTemplates.cardPreview), events);
	}

	init(): void {
		this.loadItems();

		this.events.on(ApplicationEvents.CATALOG_ITEMS_LOADED, (data: Product[]) => this.catalogItemsLoadedCallback(data));
		this.events.on(ApplicationEvents.CART_CONTENT_CHANGED, (data: TCartData) => this.cartContentChangedCallback(data));
		this.events.on(ApplicationEvents.MODAL_OPENED, () => this.modalOpenedCallback());
		this.events.on(ApplicationEvents.MODAL_CLOSED, () => this.modalClosedCallback());
	}

	loadItems(): void {
		this.api.getProducts().then(data => {
			this.catalogModel.items = data.items;
		})
			.catch(error => {
				this.events.emit(ApplicationEvents.APP_FAILED, {error: error});
			});
	}

	private catalogItemsLoadedCallback(data: Product[]): void {
		this.pageView.render({items: data});
	}

	private cartContentChangedCallback(data: TCartData): void {
		const previewProductId = this.cardPreview.id;
		this.renderCardPreview(previewProductId, this.isProductInCartData(previewProductId, data));

		this.pageView.render({totalInCart: data.items.length});
	}

	private isProductInCartData(id: ProductId, cartData: TCartData): boolean {
		return cartData.items.find((item: Product) => item.id === id) !== undefined;
	}

	private modalOpenedCallback() {
		this.pageView.lock = true;
	}

	private modalClosedCallback() {
		this.pageView.lock = false;
	}

	renderCardPreview(productId: ProductId, inCart: boolean): HTMLElement {
		this.cardPreview.inCart = inCart;
		return this.cardPreview.render(this.catalogModel.getItemById(productId));
	}

}