import { getCollection } from "../../../lib/db";
import VroomForm from "../../../components/VroomForm";
import { ObjectId } from "mongodb";
import { getUserFromCookie } from "../../../lib/getUser";
import { redirect } from "next/navigation";

async function getDoc(id) {
	const vroomCollection = await getCollection("vrooms");
	const result = await vroomCollection.findOne({
		_id: ObjectId.createFromHexString(id),
	});
	return result;
}

export default async function Page(props) {
	const doc = await getDoc(props.params.id);

	const user = await getUserFromCookie();

	if (user.userId !== doc.author.toString()) {
		return redirect("/");
	}

	return (
		<div>
			<h2 className="text-center text-2xl text-gray-500 mb-5">Edit Post</h2>
			<VroomForm vroom={doc} action="edit" />
		</div>
	);
}
