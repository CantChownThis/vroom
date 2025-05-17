import { ObjectId } from "mongodb";
import { getCollection } from "../lib/db";

import Vroom from "./Vroom";

async function getVrooms(id) {
	const collection = await getCollection("vrooms");
	const results = await collection
		.find({ author: ObjectId.createFromHexString(id) })
		.sort({ _id: -1 })
		.toArray();
	return results;
}

export default async function Dashboard(props) {
	const vrooms = await getVrooms(props.user.userId);
	return (
		<>
			<h2 className="text-center text-2xl text-gray-500 mb-5">Your Cars</h2>
			{/* <table className="table">
				<thead>
					<tr>
						<td>Image</td>
						<td>Line 1</td>
						<td>Line 2</td>
						<td>Actions</td>
					</tr>
				</thead>
				<tbody>
					{vrooms.map((vroom, index) => {
						return <Vroom vroom={vroom} key={index} />;
					})}
				</tbody>
			</table> */}
			<div>
				{vrooms.map((vroom, index) => {
					vroom._id = vroom._id.toString()
					vroom.author = vroom.author.toString()
					return <Vroom vroom={vroom} key={index} />;
				})}
			</div>
		</>
	);
}
