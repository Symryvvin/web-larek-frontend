import { ApplicationEvents, ICatalogModel, Product, ProductId } from "../../types";
import { CardPreview } from "../view/Card";
import { CatalogModel } from "../model/CatalogModel";
import { cloneTemplate } from "../../utils/utils";
import { Presenter } from "../base/Presenter";
import { MainPageView } from "../view/MainPageView";
import { ApplicationApi } from "../ApplicationApi";
import { IEvents } from "../base/events";

export class MainPagePresenter extends Presenter {
	protected catalogModel: ICatalogModel;
	protected mainPageView: MainPageView;
	protected cardPreview: CardPreview;

	constructor(protected readonly api: ApplicationApi,
	            protected readonly events: IEvents,
	            protected readonly page: HTMLElement,
	            protected readonly cardTemplate: HTMLTemplateElement,
	            protected readonly cardPreviewTemplate: HTMLTemplateElement) {
		super(api, events);

		this.catalogModel = new CatalogModel(events);
		this.mainPageView = new MainPageView(page, cardTemplate, events);
		this.cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
	}

	init(): void {
		this.api.getProducts().then(data => {
			this.catalogModel.items = data.items;
		})
			.catch(error => {
				console.log(error)
			});

		this.events.on(ApplicationEvents.CATALOG_ITEMS_LOADED, (data: Product[]) => {
			this.mainPageView.render({items: data});
		});

		this.events.on(ApplicationEvents.CART_CONTENT_CHANGED, (data: {total: number}) => {
			this.mainPageView.render({totalInCart: data.total});
		});
	}

	renderCardPreview(productId: ProductId, inCart: boolean): HTMLElement {
		this.cardPreview.inCart = inCart;
		return this.cardPreview.render(this.catalogModel.getItemById(productId));
	}

	currentCardPreviewId(): ProductId {
		return this.cardPreview.id;
	}

	findCatalogItemById(id: ProductId): Product {
		return this.catalogModel.getItemById(id);
	}

	//TODO блокировать страницу с .page__wrapper_locked

}