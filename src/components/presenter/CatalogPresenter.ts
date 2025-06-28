import { ApplicationEvents, ICatalogModel, Product, ProductId } from "../../types";
import { CardPreview } from "../view/Card";
import { CatalogModel } from "../model/CatalogModel";
import { cloneTemplate } from "../../utils/utils";
import { Presenter } from "../base/Presenter";
import { CatalogView } from "../view/CatalogView";

export class CatalogPresenter extends Presenter {
	protected catalogModel: ICatalogModel;
	protected catalogView: CatalogView;
	protected cardPreview: CardPreview;

	protected cardTemplate: HTMLTemplateElement;

	init(): void {
		this.catalogModel = new CatalogModel(this.events);

		const gallery = document.querySelector('.gallery') as HTMLElement;
		const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
		this.catalogView = new CatalogView(gallery, cardTemplate, this.events);

		const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
		this.cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), this.events);

		this.api.getProducts().then(data => {
			this.catalogModel.items = data.items;
		})
			.catch(error => {
				console.log(error)
			});

		this.events.on(ApplicationEvents.CATALOG_ITEMS_LOADED, (data: Product[]) => {
			this.catalogView.render({items: data});
		});
	}

	renderView(): void {
		console.log("renderView");
	}

	renderCardPreview(productId: ProductId, inCart: boolean): HTMLElement {
		this.cardPreview.inCart = inCart;
		return this.cardPreview.render(this.catalogModel.getItemById(productId));
	}
}