import { makeAutoObservable } from "mobx";
import { IInitialSettings, ISettings, IUserSettings } from "../types/settings";

class Settings {
	loading = false;
	loaded = false;
	error = null;
	settings: IInitialSettings = {
		theme: null,
		phrasesOrder: null,
		repetitionsAmount: null,
		activeProfile: null
	}

	constructor() {
		makeAutoObservable(this);
	}

	loadingStart() {
		this.loading = true;
		this.error = null;
	}

	settingsLoaded(settings: IUserSettings) {
		console.log(settings);
		this.loading = false;
		this.loaded = true;
		this.settings = settings.settings;
	}

	loadError(error: any) {
		this.loading = false;
		this.error = error;
	}
}

export default new Settings();