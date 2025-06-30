import { ApplicationApi } from "../ApplicationApi";
import { IEvents } from "./events";
import { IPresenter } from "../../types";

export abstract class Presenter implements IPresenter {
	protected constructor(protected readonly api: ApplicationApi, protected readonly events: IEvents) {
	}

	abstract init(): void;

}