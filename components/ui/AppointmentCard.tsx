"use client";

import { log } from "console";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { parseISO } from "date-fns";

interface Appointment {
	statusId: string;
	id: string;
	date: string;
	time: string;
	patient: {
		image: string;
		name: string;
	};
}

export default function AppointmentCard(props: { appointment: Appointment }) {
	const [isOpen, setIsOpen] = useState(false);
	const [reason, setReason] = useState("");
	const rejected = "87840fe0-4da6-48f6-9cf0-b868cfeb34fa";
	const accepted = "250cda3b-7a85-4b8d-84fc-5a317f49eb78";

	const [isAccepted, setIsAccepted] = useState<string>(() => {
		return localStorage.getItem(props.appointment.id) || props.appointment.statusId;
	});

	useEffect(() => {
		localStorage.setItem(props.appointment.id, isAccepted);
	}, [isAccepted, props.appointment.id]);

	let now = new Date();

	const isoDateString = props.appointment.date;
	const isoDate = new Date(isoDateString);
	const options = { year: "numeric", month: "long", day: "numeric" };
	const readableDate = isoDate.toLocaleDateString("en-US", options as Intl.DateTimeFormatOptions);

	const accept = async (id: string) => {
		setIsAccepted(accepted);
		const response = await fetch("/api/appointment/" + id, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				statusId: accepted,
			}),
		});
	};

	const reject = async (id: string) => {
		setIsAccepted(rejected);
		const response = await fetch("/api/appointment/" + id, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				reason: reason,
				statusId: rejected,
			}),
		});
	};

	return (
		<div
			className={`flex gap-4 w-full bg-[#d9d9d9]/30 rounded-lg p-6 mb-4 ${
				props.appointment.statusId == "87840fe0-4da6-48f6-9cf0-b868cfeb34fa" ? "hidden" : null
			}`}
		>
			{/* PICTURE */}
			{props.appointment.patient?.image == null ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="w-[85px] h-[85px] text-[#d9d9d9]"
				>
					<path
						fillRule="evenodd"
						d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
						clipRule="evenodd"
					/>
				</svg>
			) : (
				<div className="w-[85px] h-[85px] rounded-full p-0 bg-white overflow-hidden">
					<img width={85} height={85} src={props.appointment.patient?.image} alt="" />
				</div>
			)}

			{/* INFORMATIONS */}
			<div className="">
				<span className="text-[16px] font-semibold">{props.appointment.patient?.name}</span>
				<p className="text-[12px] text-[#858585] mb-3">
					{readableDate}
					{/* {props.appointment.date} */}
				</p>
				<p className="text-[12px] text-[#858585] mb-3">{props.appointment.time}</p>

				{isAccepted == accepted ? (
					<button
						className="px-4 py-1 border rounded-full border-[#ff5757] text-[#ff5757]"
						disabled
					>
						Accepted
					</button>
				) : isAccepted == rejected ? (
					<button
						className="px-4 py-1 border rounded-full border-[#ff5757] text-[#ff5757]"
						disabled
					>
						Rejected
					</button>
				) : (
					<div className="flex gap-4 items-center">
						<button
							onClick={() => accept(props.appointment.id)}
							className="px-4 py-1 border rounded-full border-[#ff5757] bg-[#ff5757] text-white"
						>
							Accept
						</button>
						{/* <RejectReason appointmentId={props.appointment.id} /> */}

						<button
							onClick={() => setIsOpen(true)}
							className="px-4 py-1 border rounded-full border-[#ff5757] text-[#ff5757]"
						>
							Reject
						</button>

						<Dialog
							open={isOpen}
							onClose={() => setIsOpen(false)}
							className={`bg-black/50 fixed top-0 left-0 w-screen h-screen flex justify-center items-center p-4`}
						>
							<Dialog.Panel className={`bg-white p-8 rounded-lg w-full max-w-[320px]`}>
								<Dialog.Title className={`font-bold text-2xl`}>Reject Reason</Dialog.Title>
								<Dialog.Description className={`mb-8`}>
									Description for reject reason
								</Dialog.Description>

								{/* CHOICES */}
								<div className="grid gap-4 lg:grid-cols-1 mb-8">
									<button
										onClick={() => setReason("Full booked at desired time")}
										className={`border ${
											reason == "Full booked at desired time"
												? "bg-[#ff5757] text-white"
												: "bg-white text-[#ff5757]"
										} border border-[#ff5757] rounded-lg py-2 px-4`}
									>
										Full booked at desired time
									</button>
									<button
										onClick={() => setReason("Doctor not on duty")}
										className={`border ${
											reason == "Doctor not on duty"
												? "bg-[#ff5757] text-white"
												: "bg-white text-[#ff5757]"
										} border border-[#ff5757] rounded-lg py-2 px-4`}
									>
										Doctor not on duty
									</button>{" "}
									<button
										onClick={() => setReason("Out of doctor expertise")}
										className={`border ${
											reason == "Out of doctor expertise"
												? "bg-[#ff5757] text-white"
												: "bg-white text-[#ff5757]"
										} border border-[#ff5757] rounded-lg py-2 px-4`}
									>
										Out of doctor expertise
									</button>{" "}
									<button
										onClick={() => setReason("Unavailable")}
										className={`border ${
											reason == "Unavailable"
												? "bg-[#ff5757] text-white"
												: "bg-white text-[#ff5757]"
										} border border-[#ff5757] rounded-lg py-2 px-4`}
									>
										Unavailable
									</button>
								</div>

								<div className="w-full flex justify-end">
									<button
										className="rounded-lg bg-[#ff5757] text-white px-4 py-2 ml-auto w-full hover:cursor-pointer"
										onClick={() => reject(props.appointment.id)}
										//   disabled={true}
									>
										Confirm
									</button>
								</div>
							</Dialog.Panel>
						</Dialog>
					</div>
				)}

				{/* {isAccepted !== rejected && isAccepted !== accepted ? (
          <div className="flex gap-4 items-center">
            <button
              onClick={() => accept(props.appointment.id)}
              className="px-4 py-1 border rounded-full border-[#ff5757] bg-[#ff5757] text-white"
            >
              Accept
            </button>
            <button
              onClick={() => reject(props.appointment.id)}
              className="px-4 py-1 border rounded-full border-[#ff5757] text-[#ff5757]"
            >
              Reject
            </button>
          </div>
        ) : isAccepted == accepted ? (
          <button
            className="px-4 py-1 border rounded-full border-[#ff5757] text-[#ff5757]"
            disabled
          >
            Accepted
          </button>
        ) : (
          <button
            className="px-4 py-1 border rounded-full border-[#ff5757] text-[#ff5757]"
            disabled
          >
            Rejected
          </button>
        )} */}
			</div>
		</div>
	);
}
