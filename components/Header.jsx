import Link from "next/link";
import { getUserFromCookie } from "../lib/getUser";
import { logout } from "../actions/userControllers";

export default async function Header() {
	const user = await getUserFromCookie();
	return (
		<>
			<header className="bg-gray-100 shadow-md">
				<div className="container-fluid mx-auto">
					<div className="navbar">
						<div className="flex-1">
							<Link className="btn text-xl" href="/">
								Vroom App
							</Link>
						</div>
						<div className="flex-none">
							<ul className="menu menu-horizontal px-1">
								{user && (
									<>
										<li>
											<Link
												className="btn btn-primary mr-2"
												href="/create-vroom"
											>
												Upload
											</Link>
											{/* <form action={logout} className="btn btn-primary mr-2">
												<button>Upload</button>
											</form> */}
										</li>
										{user.role === "admin" &&(
											<li>
											<Link
												className="btn btn-info mr-2"
												href="/admin-dashboard"
											>
												Admin
											</Link>
										</li>
										)}
										<li>
											<form action={logout} className="btn btn-neutral">
												<button>Log Out</button>
											</form>
										</li>
									</>
								)}
								{!user && (
									<li>
										<Link className="btn" href="/login">
											Log In
										</Link>
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
			</header>
		</>
	);
}
