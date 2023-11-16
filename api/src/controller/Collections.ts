import { Collection } from "../Classes/Collection";
import { IChangeCollectionLockInput, ICollectionInput } from "../types/collections";

const db = require("../model/db.ts");
const generateId = require("../utils/generateId");
const globalErrorHandler = require("../service/globalErrorHandler");

class CollectionsController {
	async getCollection({ id }: { id: string }) {
		let result;

		try {
			result = await db.collection("collections").findOne({ id });

			if(!result) throw new Error("404. Collection not found");
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get collection. ${e}`);
		}

		return result;
	}

	async getCollectionsByProfile({ id }: { id: string }) {
		let result;
		
		try {
			let cursor = await db.collection("collections").find({
				profile: id
			});

			result = await cursor.toArray();
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get collection. ${e}`);
		}

		return result;
	}

	async getCollectionByPhrase({ id }: { id: string }) {
		let result;

		try {
			result = await db.collection("collections").findOne({
				phrases: { $in: [id] }
			});

			if(!result) throw new Error("404. Collection not found");
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to find collection. ${e}`);
		}

		return result;
	}

	async createCollection({ input }: {input: ICollectionInput}) {
		const collection = new Collection(input.name, input.color, input.profile);

		try {
			await db.collection("collections").insertOne(collection);
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create collection. ${e}`);
		}

		return "OK";
	}

	async mutateCollection({ id, input }: { id: string, input: ICollectionInput}) {
		try {
			await db.collection("collections").updateOne({ id }, {
				$set: {
					name: input.name,
					color: input.color
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to mutate collection. ${e}`);
		}

		return "OK";
	}

	async changeCollectionLock({ id, input }: { id: string, input: IChangeCollectionLockInput}) {
		try {
			await db.collection("collections").updateOne({ id }, {
				$set: {
					isLocked: input.isLocked
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to lock/unlock collection. ${e}`);
		}

		return "OK";
	}

	async deleteCollection({ id }: { id: string }) {
		try {
			await db.collection("collections").deleteOne({ id });
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to delete collection. ${e}`);
		}

		return "OK";
	}
}

module.exports = new CollectionsController();