"use client";

import { useFormState, useFormStatus } from "react-dom";
import { register } from "../actions/userControllers";

export default function RegisterForm() {
	const [formState, formAction] = useFormState(register, {});

	// console.log(formState);
	return (
		<form action={formAction} className="max-w-xs mx-auto">
			<div className="mb-3">
				{formState.errors?.username && (
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
						<span>{formState.errors?.username}</span>
					</div>
				)}
				<input
					type="text"
					autoComplete="off"
					name="username"
					placeholder="Username"
					required
					className="input input-bordered w-full max-w-xs"
				/>
			</div>
			<div className="mb-3">
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
				<input
					type="password"
					autoComplete="off"
					name="password"
					placeholder="Password"
					required
					className="input input-bordered w-full max-w-xs"
				/>
			</div>
			<button className="btn btn-outline">Create Account</button>
		</form>
	);
}
