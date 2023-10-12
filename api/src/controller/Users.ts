import { IUserInput } from "../types/users";

const db = require("../model/db.ts");
const settingsController = require("./Settings.ts");
const generateId = require("../utils/generateId.ts");

class UsersController {
	async getUser({ id }: { id: string | number}) {
		let user;

		try {
			const { password, ...userData } = await db.collection("users").findOne({ id: +id });
			user = userData;
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server Error: ${e.toString()}`);
		}

		return user;
	}

	async createUser({ input }: { input: IUserInput}) {
		const user = await db.collection("users").findOne({
			login: input.login
		})

		if(user) throw new Error("Bad request. Login already taken");

		const id = generateId();

		try {
			await db.collection("users").insertOne({
				id,
				name: input.name,
				login: input.login,
				password: input.password
			})
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server Error: ${e.toString()}`);
		}

		try {
			await settingsController.createSettings({ id });
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server Error: ${e.toString()}`);
		}

		return id;
	}

	async deleteUser({ id }: { id: string | number}) {
		try {
			await db.collection("users").deleteOne({ id: +id });
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server error ${e}`);
		}

		return "OK";
	}
}

module.exports = new UsersController();