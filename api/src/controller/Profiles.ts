import { IProfileInput } from "../types/profiles";

import db from "../model/db";
import generateId from "../misc/generateId";
import globalErrorHandler from "../misc/globalErrorHandler";

class ProfilesController {
	async getProfile({ id }: { id: string }) {
		let profile;

		try {
			profile = await db.collection("profiles").findOne({
				id: id
			})
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Failed to get profile into. ${e.toString()}`);
		}

		if(!profile) throw new Error("404. Profile not found");

		return profile;
	}

	async createProfile({ input }: { input: IProfileInput }) {
		const id = generateId();
		
		try {
			await db.collection("profiles").insertOne({
				id,
				name: input.name,
				userId: input.userId
			})
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server Error. Failed to create profile. ${e.toString()}`);
		}

		return id;
	}

	async getUserProfiles({ id }: { id: string }) {
		let result;

		try {
			const cursor = await db.collection("profiles").find({
				userId: id
			})

			result = await cursor.toArray();
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server Error. Failed to get profiles. ${e.toString()}`);
		}

		return result;
	}

	async mutateProfile({ id, input }: { id: string, input: { name: string }}) {
		try {
			await db.collection("profiles").updateOne({ id }, {
				$set: {
					name: input.name
				}
			})
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server Error. Failed to mutate profile. ${e.toString()}`);
		}

		return "OK";
	}

	async deleteProfile({ id }: { id: string }) {
		try {
			await db.collection("profiles").deleteOne({ id });
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server Error. Failed to delete profile. ${e.toString()}`);
		}

		return "OK";
	}
}

export default new ProfilesController();