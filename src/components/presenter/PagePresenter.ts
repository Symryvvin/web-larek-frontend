import { ApplicationEvents, ICatalogModel, Product, ProductId, TCartProducts } from "../../types";
import { CardPreview } from "../view/Card";
import { Presenter } from "../base/Presenter";
import { PageView } from "../view/PageView";
import { ApplicationApi } from "../ApplicationApi";
import { IEvents } from "../base/events";

export class PagePresenter extends Presenter {
	constructor(protected readonly api: ApplicationApi,
	            protected readonly events: IEvents,
	            protected readonly catalogModel: ICatalogModel,
	            protected readonly mainPageView: PageView,
	            protected readonly cardPreview: CardPreview) {
		super(api, events);
	}

	init(): void {
		this.loadItems();

		this.events.on(ApplicationEvents.CATALOG_ITEMS_LOADED, (data: Product[]) => this.catalogItemsLoadedCallback(data));
		this.events.on<TCartProducts>(ApplicationEvents.CART_CONTENT_CHANGED, (data) => this.cartContentChangedCallback(data));
		this.events.on(ApplicationEvents.MODAL_OPENED, () => this.modalOpenedCallback());
		this.events.on(ApplicationEvents.MODAL_CLOSED, () => this.modalClosedCallback());
	}

	loadItems(): void {
		this.api.getProducts().then(data => {
			this.catalogModel.items = data.items;
		})
			.catch(error => {
				console.log(error)
			});
	}

	private catalogItemsLoadedCallback(data: Product[]): void {
		this.mainPageView.render({items: data});
	}

	private cartContentChangedCallback(data: Partial<TCartProducts>): void {
		this.mainPageView.render({totalInCart: data.items.length});
	}

	private modalOpenedCallback() {
		this.mainPageView.lock = true;
	}

	private modalClosedCallback() {
		this.mainPageView.lock = false;
	}

	renderCardPreview(productId: ProductId, inCart: boolean): HTMLElement {
		this.cardPreview.inCart = inCart;
		return this.cardPreview.render(this.catalogModel.getItemById(productId));
	}

	currentCardPreviewId(): ProductId {
		return this.cardPreview.id;
	}

}