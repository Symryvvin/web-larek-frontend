import { ApplicationEvents, ICatalogModel, Product, ProductId } from "../../types";
import { CardPreview } from "../view/Card";
import { CatalogModel } from "../model/CatalogModel";
import { cloneTemplate } from "../../utils/utils";
import { Presenter } from "../base/Presenter";
import { MainPageView } from "../view/MainPageView";

export class MainPagePresenter extends Presenter {
	protected catalogModel: ICatalogModel;
	protected mainPageView: MainPageView;
	protected cardPreview: CardPreview;

	init(): void {
		this.catalogModel = new CatalogModel(this.events);

		const pageElement = document.querySelector('.page') as HTMLElement;
		const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
		this.mainPageView = new MainPageView(pageElement, cardTemplate, this.events);

		const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
		this.cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), this.events);

		this.api.getProducts().then(data => {
			this.catalogModel.items = data.items;
		})
			.catch(error => {
				console.log(error)
			});

		this.events.on(ApplicationEvents.CATALOG_ITEMS_LOADED, (data: Product[]) => {
			this.mainPageView.render({items: data});
		});

		this.events.on(ApplicationEvents.CART_CONTENT_CHANGED, (data: Product[]) => {
			this.mainPageView.render({totalInCart: data.length});
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

}