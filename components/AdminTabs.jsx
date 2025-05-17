"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { changePass } from "@/actions/userControllers";


function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button className="btn" disabled={pending}>
			{pending ? (
				<>
					<span className="loading loading-spinner mr-2"></span>
					Changing...
				</>
			) : (
				"Change"
			)}
		</button>
	);
}

export default function AdminTabs({ users }) {
	const [activeTab, setActiveTab] = useState("userlist");
	const [formState, formAction] = useFormState(changePass, {});
	return (
		<>
			<div role="tablist" className="tabs tabs-lifted">
				<a
					role="tab"
					className={`tab ${activeTab === "userlist" ? "tab-active" : ""}`}
					onClick={() => setActiveTab("userlist")}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6 mr-3"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
						/>
					</svg>
					User List
				</a>
				<a
					role="tab"
					className={`tab ${activeTab === "changepwd" ? "tab-active" : ""}`}
					onClick={() => setActiveTab("changepwd")}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6 mr-3"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
						/>
					</svg>
					Change Password
				</a>
			</div>

			<div className="p-4 border border-t-0 rounded-box mt-8">
				{activeTab === "userlist" && (
					<div>
						{/* <h3 className="font-bold mb-2">All Users</h3> */}
						<div className="overflow-x-auto">
							<table className="table">
								<thead>
									<tr>
										<th>Username</th>
										<th>Role</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{users.map((u) => (
										<tr key={u._id.toString()}>
											<td>{u.username}</td>
											<td>{u.role}</td>
											<td>
												<button className="btn btn-sm btn-primary">Edit</button>
											</td>
										</tr>
										// <li key={u._id}>{u.username}</li>
									))}
								</tbody>
							</table>
						</div>
						{/* <ul className="list-disc pl-5">
							{users.map((u) => (
								<li key={u._id}>{u.username}</li>
							))}
						</ul> */}
					</div>
				)}
				{activeTab === "changepwd" && (
					<>
						<form
							action={formAction}
							className="flex justify-center items-center h-60"
						>
							<select
								name="username"
								defaultValue=""
								className="select mr-3"
								required
							>
								<option value="" disabled>
									Username
								</option>
								{users.map((u) => (
									<option key={u._id.toString()} value={u.username}>
										{u.username}
									</option>
									// <li key={u._id}>{u.username}</li>
								))}
							</select>
							<input
								type="password"
								autoComplete="off"
								name="password"
								placeholder="Password"
								required
								className="input input-bordered w-full max-w-xs mr-3"
							/>
							{/* <button className="btn">Change</button> */}
							<SubmitButton />
						</form>
						{formState.message && (
							<div role="alert" className={`alert mb-3 ${ formState.success ? "alert-success" : "alert-warning" }`}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 shrink-0 stroke-current"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
								<span>{formState.message}</span>
							</div>
						)}
						{formState.errors?.password && (
							<div role="alert" className="alert alert-warning mb-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 shrink-0 stroke-current"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
								<span>{formState.errors?.password}</span>
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
}
