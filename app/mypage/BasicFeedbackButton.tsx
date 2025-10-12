"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import React from "react";

export default function BasicFeedbackButton() {
	const router = useRouter();

	const handleClick = () => {
		router.push("/requestfeedback");
	};

	return (
		<button
			onClick={handleClick}
			className="
        fixed bottom-6 right-6
        md:bottom-8 md:right-8
        bg-gradient-to-r from-[#D2C693] to-[#928346]
        text-white rounded-full shadow-lg
        flex items-center justify-center
        w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20
		cursor-pointer
      "
		>
			<Pencil size="60%" strokeWidth={2.5} />
		</button>
	);
}
