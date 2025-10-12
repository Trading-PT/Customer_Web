"use client";

import DayFeedback from "./DayFeedback";

export default function Page() {

	const year = "2025";
	const month = "8";
	const week = "셋째 주";
	const day = "24";

	const mockEntries = [
		{ time: "am 9:11:39", title: "8/24 (1) 작성 완료", new: false, feedbackId: 1 },
		{ time: "pm 12:11:39", title: "8/24 (2) 작성 완료", new: true, feedbackId: 2 },
		{ time: "pm 23:35:59", title: "8/24 (3) 작성 완료", new: true, feedbackId: 3 },
		{ time: "pm 23:59:59", title: "8/24 (4) 작성 완료", new: false, feedbackId: 4 },
	];

	return (
		<DayFeedback
			year={year}
			month={month}
			week={week}
			day={day}
			entries={mockEntries}
		/>
	);
}
