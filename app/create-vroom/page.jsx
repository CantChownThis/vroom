import { getUserFromCookie } from "../../lib/getUser";
import { redirect } from "next/navigation";
import VroomForm from "../../components/VroomForm";

export default async function Page() {
	const user = await getUserFromCookie();
	if (!user) {
		return redirect("/");
	}

	return (
		<>
			<h2 className="text-center text-2xl mb-5">Create a Car</h2>
			<VroomForm action="create" />
		</>
	);
}
