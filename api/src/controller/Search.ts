import { ICollection } from "@ts/collections";
import globalErrorHandler from "../misc/globalErrorHandler";
import db from "../model/db";

class Search {
	async searchCollectionPhrases({ pattern, colId }: { pattern: string, colId: string }) {
		let result;

		try {
			const cursor = await db.collection("phrases").find({
				collection: colId,
				$or: [
					{
						value: { $regex: pattern }
					},
					{
						translation: { $regex: pattern }
					}
				]
			});

			result = await cursor.toArray();
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error("Server error. Failed to complete search");
		}

		return result;
	}

	async searchProfilePhrases({ pattern, profile }: { pattern: string, profile: string }) {
		let result;
		let collectionsIds;

		try {
			const cursor = await db.collection("collections").find({
				profile
			});
			
			const collections = await cursor.toArray();

			collectionsIds = collections.map((collection: ICollection) => collection.id);
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error("Server error. Failed to complete search - failed to get profile collections");
		}

		try {
			const cursor = await db.collection("phrases").find({
				collection: {
					$in: collectionsIds
				},
				$or: [
					{
						value: { $regex: pattern }
					},
					{
						translation: { $regex: pattern }
					}
				]
			});

			result = await cursor.toArray();
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error("Server error. Failed to complete search");
		}

		return result;
	}

	async searchProfileCollections({ pattern, profile }: { pattern: string, profile: string }) {
		let result;

		try {
			const cursor = await db.collection("collections").find({
				name: {
					$regex: pattern
				},
				profile,
				isAutoGenerated: {
					$ne: true
				}
			});

			result = await cursor.toArray();
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error("Server error. Failed to complete search");
		}

		return result;
	}
}

export default new Search();