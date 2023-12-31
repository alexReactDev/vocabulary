import { Jwt, JwtPayload } from "jsonwebtoken";

import db from "../model/db";

export async function isTokenRevoked(req: any, jwt: Jwt | undefined) {
	if(!jwt) return false;

	let session;

	try {
		session = await db.collection("active_sessions").findOne({
			sid: (jwt.payload as JwtPayload).sid
		})
	} catch (e) {
		console.log(e);
		return true;
	}

	if(!session) return true;


	return false;
}