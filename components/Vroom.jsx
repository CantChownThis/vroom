"use client";

import Link from "next/link";
import { deleteVroom } from "../actions/vroomControllers";
import { CldImage } from "next-cloudinary";

export default function Vroom(props) {
    if (!props.vroom.photo) {
        props.vroom.photo = "fallback"
    }
	return (
		<>
			<div className="relative rounded-xl overflow-hidden max-w-[650px] mx-auto mb-7">
				<img src="/aspect-ratio.png" />
				<div className="absolute inset-0 bg-gray-200 grid">
					<span className="loading loading-dots loading-lg m-auto"></span>
				</div>
				<CldImage
					className="absolute inset-0"
					width="650"
					height="300"
					fillBackground
					crop={{ type: "pad", source: true }}
					src={props.vroom.photo}
					sizes="650px"
					alt="Description of my image"
					overlays={[
						{
							position: {
								x: 34,
								y: 154,
								angle: -10,
								gravity: "north_west",
							},
							text: {
								color: "black",
								fontFamily: "Source Sans Pro",
								fontSize: 42,
								fontWeight: "bold",
								text: `${props.vroom.line1}%0A${props.vroom.line2}`,
							},
						},
						{
							position: {
								x: 30,
								y: 150,
								angle: -10,
								gravity: "north_west",
							},
							text: {
								color: "white",
								fontFamily: "Source Sans Pro",
								fontSize: 42,
								fontWeight: "bold",
								text: `${props.vroom.line1}%0A${props.vroom.line2}`,
								// text: props.vroom.line1
							},
						},
					]}
				/>
				{/* <td>{props.vroom.line1}</td>
				<td>{props.vroom.line2}</td> */}
				<div className="absolute bottom-2 right-2 flex">
					<button className="btn mr-1">
						<Link href={`/edit-vroom/${props.vroom._id.toString()}`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								className="size-4"
							>
								<path
									fillRule="evenodd"
									d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
									clipRule="evenodd"
								/>
							</svg>
						</Link>
					</button>
					<form action={deleteVroom} className="btn btn-error">
						<input
							type="hidden"
							name="id"
							defaultValue={props.vroom._id.toString()}
						/>
						<button>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								className="size-4"
							>
								<path
									fillRule="evenodd"
									d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</form>
				</div>
			</div>
		</>
	);
}
