import AdminTabs from "@/components/AdminTabs";
import { getUserFromCookie } from "../../lib/getUser";
import { getAllUsers } from "@/actions/getUserList";

export default async function Page() {
	const user = await getUserFromCookie();
	if (user.role !== "admin") {
		return (
			<h2 className="text-center text-2xl mb-5 text-red-500">Access denied!</h2>
		);
	}

    const users = await getAllUsers();
	return (
		<>
			<h2 className="text-center text-2xl mb-5">Admin Dashboard</h2>
			{/* name of each tab group should be unique */}
			<AdminTabs users={users} />
		</>
	);
}
