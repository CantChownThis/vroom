"use client";

import { useState } from "react";
import { createVroom, editVroom } from "../actions/vroomControllers";
import { useFormState, useFormStatus } from "react-dom";
import { CldUploadWidget } from "next-cloudinary";

export default function VroomForm(props) {
	const [signature, setSignature] = useState("")
	const [version, setVersion] = useState("")
	const [public_id, setPublic_id] = useState("")
	let actualAction;

	if (props.action === "create") {
		actualAction = createVroom;
	}

	if (props.action === "edit") {
		actualAction = editVroom;
	}

	const [formState, formAction] = useFormState(actualAction, {});
	return (
		<>
			<form action={formAction} className="max-w-xs mx-auto">
				<div className="mb-3">
					<input
						type="text"
						autoComplete="off"
						name="line1"
						placeholder="Line #1"
						required
						className="input input-bordered w-full max-w-xs"
						defaultValue={props.vroom?.line1}
					/>
					{formState.errors?.line1 && (
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
							<span>{formState.errors?.line1}</span>
						</div>
					)}
				</div>
				<div className="mb-3">
					<input
						type="text"
						autoComplete="off"
						name="line2"
						placeholder="Line #2"
						required
						className="input input-bordered w-full max-w-xs"
						defaultValue={props.vroom?.line2}
					/>
					{formState.errors?.line2 && (
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
							<span>{formState.errors?.line2}</span>
						</div>
					)}
				</div>

				<div className="mb-4">
					<CldUploadWidget
						onSuccess={(result, { widget }) => {
							console.log(result?.info);
							setSignature(result?.info.signature)
							setPublic_id(result?.info.public_id)
							setVersion(result?.info.version)
						}}
						onQueuesEnd={(result, { widget }) => {
							widget.close();
						}}
						signatureEndpoint="/widget-signature"
					>
						{({ open }) => {
							function handleClick(e) {
								e.preventDefault();
								open();
							}
							return (
								<button className="btn btn-secondary" onClick={handleClick}>
									Upload an Image
								</button>
							);
						}}
					</CldUploadWidget>
				</div>

				<input type="hidden" name="public_id" value={public_id} />
				<input type="hidden" name="version" value={version} />
				<input type="hidden" name="signature" value={signature} />

				<input
					type="hidden"
					name="vroomId"
					defaultValue={props.vroom?._id.toString()}
				/>
				<button className="btn btn-outline uppercase">Submit</button>
			</form>
		</>
	);
}
