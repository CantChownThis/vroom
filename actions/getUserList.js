
// app/actions/getUsers.js
import { getCollection } from "@/lib/db";

export async function getAllUsers() {
	const usersCollection = await getCollection("users");
	const users = await usersCollection
		.find({}, { projection: { password: 0 } })
		.toArray();
	return users;
}