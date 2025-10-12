"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface DayData {
	time: string;
	title: string;
	new: boolean;
	feedbackId: number;
}

interface DayFeedbackProps {
	year: string;
	month: string;
	week: string;
	day: string;
	entries: DayData[];
}

export default function DayFeedback({
	year,
	month,
	week,
	day,
	entries,
}: DayFeedbackProps) {
	const router = useRouter();

	return (
		<div className="p-6 mt-20">
			{/* 상단 타이틀 */}
			<h2 className="text-gray-400 text-lg mb-2">
				{year}년 / {month}월 / {week} / {day}일
			</h2>
			<h1 className="text-2xl font-bold mb-6">이 날의 모든 매매일지</h1>

			<div className="flex flex-col gap-3">
				{entries.map((entry, index) => (
					<div key={index} className="flex items-center gap-4">
						{/* 왼쪽 시간 버튼 - 고정 width */}
						<button className="w-28 px-4 py-2 bg-gray-800 text-white rounded-md text-sm cursor-pointer text-center"
							onClick={() =>
								router.push(
									`/timefeedback?year=${year}&month=${month}&week=${week}&day=${day}&time=${entry.time}&id=${entry.feedbackId}`
								)
							}>
							{entry.time}
						</button>

						{/* 오른쪽 제목 버튼 */}
						<button className="flex-1 flex items-center justify-between text-gray-800 border-b border-gray-300 py-2 cursor-pointer"
							onClick={() =>
								router.push(
									`/timefeedback?year=${year}&month=${month}&week=${week}&day=${day}&time=${entry.time}&id=${entry.feedbackId}`
								)
							}>
							<span>{entry.title}</span>
							{entry.new && (
								<span className="w-2 h-2 bg-red-500 rounded-full inline-block ml-2" />
							)}
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
