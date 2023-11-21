import { IPhrase } from "@ts/phrases";
import { IJWT } from "../types/authorization";
import { Collection } from "../Classes/Collection";
import { ICollection } from "../../../types/collections";

const settingsController = require("./Settings");
const globalErrorHandler = require("../service/globalErrorHandler");
const db = require("../model/db");

class AutoCollectionsController {
	async createAutoCollection({}, context: { auth: IJWT }) {
		const userSettings = await settingsController.getUserSettings({ id: context.auth.userId });

		try {
			await db.collection("collections").deleteMany({
				isAutoGenerated: true,
				profile: userSettings.settings.activeProfile,
				"autoGeneratedCollectionMeta.type": "auto"
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create auto collection: Failed to clear old collection ${e}`);
		}


		let phrases;

		try {
			const cursor = await db.collection("phrases").find({
				profile: userSettings.settings.activeProfile
			});

			phrases = await cursor.toArray();
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create auto collection: Failed to get phrases. ${e}`);
		}

		if(phrases.length <= userSettings.settings.autoCollectionSize) {
			const collection = new Collection("Auto", "#dcb499", userSettings.settings.activeProfile) as unknown as ICollection;
			collection.isLocked = true;
			collection.isAutoGenerated = true;
			collection.phrases = phrases.map((phrase: IPhrase) => phrase.id);

			return collection;
		}

		const phrasesWithScore = phrases.map((phrase: IPhrase) => {
			return {
				phrase,
				score: (phrase.meta.forgotten - phrase.meta.guessed) - phrase.meta.repeated + ((new Date().getTime() - phrase.meta.lastRepetition) / 86400000 /*1d*/)
			}
		});

		console.log(phrasesWithScore);

		interface IPhraseWithScore {
			phrase: IPhrase,
			score: number
		}

		const rankedPhrases = phrasesWithScore.concat().sort((a:IPhraseWithScore, b: IPhraseWithScore) => {
			return b.score - a.score;
		});

		const result = rankedPhrases.slice(0, userSettings.settings.autoCollectionSize);


		const collection = new Collection("Auto", "#dcb499", userSettings.settings.activeProfile) as unknown as ICollection;
		collection.isLocked = true;
		collection.isAutoGenerated = true;
		collection.autoGeneratedCollectionMeta = {
			type: "auto"
		}
		collection.phrases = result.map((phrase: IPhraseWithScore) => phrase.phrase.id);

		try {
			await db.collection("collections").insertOne(collection);
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create auto collection: Failed to save collection ${e}`);
		}

		return collection;
	}

	async createIntervalCollection({extended = false}, context: { auth: IJWT }): Promise<ICollection> {
		const userSettings = await settingsController.getUserSettings({ id: context.auth.userId });
		const currentTime = new Date().getTime();
		if(userSettings.settings.intervalRepetitionDates === "extended") extended = true;

		try {
			await db.collection("collections").deleteMany({
				isAutoGenerated: true,
				profile: userSettings.settings.activeProfile,
				"autoGeneratedCollectionMeta.type": "interval"
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create interval collection: Failed to clear old collection ${e}`);
		}

		let dayAgo;

		try {
			const minDate = new Date(currentTime - (extended ? 86400000 * 3 : 86400000));
			minDate.setHours(0, 0, 0);
			const min = minDate.getTime();

			const maxDate = new Date(currentTime - 86400000);
			maxDate.setHours(23, 59, 59);
			const max = maxDate.getTime();
			
			const cursor = await db.collection("phrases").find({
				"meta.lastRepetition": {
					$gte: min,
					$lte: max
				}
			});

			dayAgo = await cursor.toArray();
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create interval collection: Failed to get phrases. ${e}`);
		}

		let weekAgo;

		try {
			const minDate = new Date(currentTime - (extended ? 86400000 * 10 : 86400000 * 7));
			minDate.setHours(0, 0, 0);
			const min = minDate.getTime();

			const maxDate = new Date(currentTime - 86400000 * 7);
			maxDate.setHours(23, 59, 59);
			const max = maxDate.getTime();
			
			const cursor = await db.collection("phrases").find({
				"meta.lastRepetition": {
					$gte: min,
					$lte: max
				}
			});

			weekAgo = await cursor.toArray();
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create interval collection: Failed to get phrases. ${e}`);
		}

		let monthAgo;

		try {
			const minDate = new Date(currentTime - (extended ? 86400000 * 35 : 86400000 * 30));
			minDate.setHours(0, 0, 0);
			const min = minDate.getTime();

			const maxDate = new Date(currentTime - 86400000 * 30);
			maxDate.setHours(23, 59, 59);
			const max = maxDate.getTime();
			
			const cursor = await db.collection("phrases").find({
				"meta.lastRepetition": {
					$gte: min,
					$lte: max
				}
			});

			monthAgo = await cursor.toArray();
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create interval collection: Failed to get phrases. ${e}`);
		}

		let severalMonthsAgo;

		try {
			const minDate = new Date(currentTime - (extended ? 86400000 * 100 : 86400000 * 90));
			minDate.setHours(0, 0, 0);
			const min = minDate.getTime();

			const maxDate = new Date(currentTime - 86400000 * 90);
			maxDate.setHours(23, 59, 59);
			const max = maxDate.getTime();
			
			const cursor = await db.collection("phrases").find({
				"meta.lastRepetition": {
					$gte: min,
					$lte: max
				}
			});

			severalMonthsAgo = await cursor.toArray();
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create interval collection: Failed to get phrases. ${e}`);
		}

		const initialResult = dayAgo.concat(weekAgo).concat(monthAgo).concat(severalMonthsAgo);

		if(
			extended 
			|| userSettings.settings.intervalRepetitionDates === "exact"
			|| initialResult.length >= userSettings.settings.autoCollectionSize
		) {
			const collection = new Collection("Interval", "#60a5fa", userSettings.settings.activeProfile) as unknown as ICollection;
			collection.isLocked = true;
			collection.isAutoGenerated = true;
			collection.autoGeneratedCollectionMeta = {
				type: "interval"
			}
			collection.phrases = initialResult.map((phrase: IPhrase) => phrase.id);

			try {
				await db.collection("collections").insertOne(collection);
			} catch (e) {
				globalErrorHandler(e);
				throw new Error(`Server error. Failed to create interval collection: Failed to save collection ${e}`);
			}

			return collection;
		}

		return await this.createIntervalCollection({ extended: true }, context);
	}

	async createHardToMemorizeCollection({}, context: { auth: IJWT }) {
		const userSettings = await settingsController.getUserSettings({ id: context.auth.userId });

		try {
			await db.collection("collections").deleteMany({
				isAutoGenerated: true,
				profile: userSettings.settings.activeProfile,
				"autoGeneratedCollectionMeta.type": "htm"
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create htm collection: Failed to clear old collection ${e}`);
		}

		let phrases;

		try {
			const cursor = await db.collection("phrases").find({
				profile: userSettings.settings.activeProfile
			});

			phrases = await cursor.toArray();
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create HTM collection: Failed to get phrases. ${e}`);
		}

		if(phrases.length <= userSettings.settings.autoCollectionSize) {
			const collection = new Collection("Hard to memorize", "#f43f5e", userSettings.settings.activeProfile) as unknown as ICollection;
			collection.isLocked = true;
			collection.isAutoGenerated = true;
			collection.phrases = phrases.map((phrase: IPhrase) => phrase.id);

			return collection;
		}

		const phrasesWithScore = phrases.map((phrase: IPhrase) => {
			return {
				phrase,
				score: phrase.meta.forgotten - phrase.meta.guessed
			}
		});

		interface IPhraseWithScore {
			phrase: IPhrase,
			score: number
		}

		const rankedPhrases = phrasesWithScore.concat().sort((a:IPhraseWithScore, b: IPhraseWithScore) => {
			return b.score - a.score;
		});

		const result = rankedPhrases.slice(0, userSettings.settings.autoCollectionSize);


		const collection = new Collection("Hard to memorize", "#fb7185", userSettings.settings.activeProfile) as unknown as ICollection;
		collection.isLocked = true;
		collection.isAutoGenerated = true;
		collection.autoGeneratedCollectionMeta = {
			type: "htm"
		}
		collection.phrases = result.map((phrase: IPhraseWithScore) => phrase.phrase.id);

		try {
			await db.collection("collections").insertOne(collection);
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create htm collection: Failed to save collection ${e}`);
		}

		return collection;
	}
}

module.exports = new AutoCollectionsController();