"use client";

import React, { useState } from "react";
import CustomButton from "../components/CustomButton";
import { useRouter } from "next/navigation";

interface DayData {
	day: string; // 요일
	dayNumber: number; // 실제 날짜 (1-31)
	trades: number | string;
	wins: number | string;
	losses: number | string;
	dailyPnL: number | string;
	new: boolean;
}

interface WeekSummary {
	winRate: string;
	profitLossRatio: string;
	weeklyPnL: string;
}

interface WeekComparison {
	before: {
		winRate: string;
		profitLossRatio: string;
		weeklyPnL: string;
	};
	current: {
		winRate: string;
		profitLossRatio: string;
		weeklyPnL: string;
	};
}

interface WeekFeedbackProps {
	year: string;
	month: string;
	week: string; // ex) "셋째 주"
	days: DayData[];
	summary: WeekSummary;
	comparison: WeekComparison;
	initialMemo?: string;
}

export default function WeekFeedback({
	year,
	month,
	week,
	days,
	summary,
	comparison,
	initialMemo = "",
}: WeekFeedbackProps) {
	const router = useRouter();
	const [memo, setMemo] = useState(initialMemo);

	const handleDayClick = (dayNumber: number) => {
		router.push(`/dayfeedback?year=${year}&month=${month}&week=${week}&day=${dayNumber}`);
	};

	return (
		<div className="p-4 sm:p-6 mt-20 sm:mt-25">
			{/* 타이틀 */}
			<h2 className="text-gray-400 text-base sm:text-lg mb-1 sm:mb-2">
				{year}년 / {month}월 / {week}
			</h2>
			<h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">주간 매매일지</h1>

			{/* 테이블 (모바일 스크롤 지원) */}
			<div className="border border-gray-400 rounded-lg overflow-hidden mb-10 overflow-x-auto">
				<table className="min-w-full border-collapse text-center text-sm sm:text-base">
					<thead>
						<tr>
							<th className="w-28 sm:w-40 border border-gray-300 bg-gray-50"></th>
							{days.map((d) => (
								<th
									key={d.day}
									className="border border-gray-300 py-2 px-2 sm:px-4"
								>
									<button
										className="relative px-2 sm:px-3 py-1 bg-gray-800 text-white text-xs sm:text-sm rounded-md cursor-pointer"
										onClick={() => handleDayClick(d.dayNumber)}
									>
										{d.day}
										{d.new && (
											<span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
										)}
									</button>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className="border border-gray-300 py-2 px-2 sm:px-4 text-left">
								매매횟수
							</td>
							{days.map((d) => (
								<td key={d.day + "-trades"} className="border border-gray-300">
									{d.trades}
								</td>
							))}
						</tr>
						<tr>
							<td className="border border-gray-300 py-2 px-2 sm:px-4 text-left">
								수익횟수
							</td>
							{days.map((d) => (
								<td key={d.day + "-wins"} className="border border-gray-300">
									{d.wins}
								</td>
							))}
						</tr>
						<tr>
							<td className="border border-gray-300 py-2 px-2 sm:px-4 text-left">
								손실횟수
							</td>
							{days.map((d) => (
								<td key={d.day + "-losses"} className="border border-gray-300">
									{d.losses}
								</td>
							))}
						</tr>
						<tr>
							<td className="border border-gray-300 py-2 px-2 sm:px-4 text-left">
								일간 p&l
							</td>
							{days.map((d) => (
								<td key={d.day + "-pnl"} className="border border-gray-300">
									{d.dailyPnL}
								</td>
							))}
						</tr>
						<tr>
							<td className="border border-gray-300 py-2 px-2 sm:px-4 text-left">
								승률
							</td>
							<td className="border border-gray-300" colSpan={days.length}>
								{summary.winRate}
							</td>
						</tr>
						<tr>
							<td className="border border-gray-300 py-2 px-2 sm:px-4 text-left">
								평균 손익비
							</td>
							<td className="border border-gray-300" colSpan={days.length}>
								{summary.profitLossRatio}
							</td>
						</tr>
						<tr>
							<td className="border border-gray-300 py-2 px-2 sm:px-4 text-left">
								주간 p&l
							</td>
							<td className="border border-gray-300" colSpan={days.length}>
								{summary.weeklyPnL}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* 비교 섹션 */}
			<div className="mt-8 sm:mt-12">
				<h2 className="text-lg sm:text-2xl font-semibold text-center mb-6 sm:mb-8">
					<span className="bg-yellow-100 px-2">
						지난 주 대비 이번 주의 매매 성적 변화량
					</span>
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16">
					{/* 지난 주 */}
					<div>
						<h3 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
							지난 주
						</h3>
						<div className="border-t-2 border-yellow-900 pt-3 sm:pt-4">
							<div className="flex justify-between py-2 text-gray-700 text-sm sm:text-base">
								<span>승률</span>
								<span>{comparison.before.winRate}</span>
							</div>
							<div className="flex justify-between py-2 text-gray-700 text-sm sm:text-base">
								<span>손익비</span>
								<span>{comparison.before.profitLossRatio}</span>
							</div>
							<div className="flex justify-between py-2 text-gray-700 text-sm sm:text-base">
								<span>p&l</span>
								<span>{comparison.before.weeklyPnL}</span>
							</div>
						</div>
					</div>

					{/* 이번 주 */}
					<div>
						<h3 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
							이번 주
						</h3>
						<div className="border-t-2 border-yellow-900 pt-3 sm:pt-4">
							<div className="flex justify-between py-2 text-gray-900 font-semibold text-sm sm:text-base">
								<span>승률</span>
								<span>{comparison.current.winRate}</span>
							</div>
							<div className="flex justify-between py-2 text-gray-900 font-semibold text-sm sm:text-base">
								<span>손익비</span>
								<span>{comparison.current.profitLossRatio}</span>
							</div>
							<div className="flex justify-between py-2 text-gray-900 font-semibold text-sm sm:text-base">
								<span>p&l</span>
								<span>{comparison.current.weeklyPnL}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 버튼 섹션 */}
			<div className="flex flex-col w-full gap-2 sm:gap-3 mt-12 sm:mt-20">
				<CustomButton variant="prettyFull">손실 매매 모아보기</CustomButton>
				<CustomButton variant="prettyFull">수익 매매 모아보기</CustomButton>
			</div>

			{/* 메모 섹션 */}
			<div className="mt-10 sm:mt-12">
				<h2 className="text-lg sm:text-xl mb-3 sm:mb-4">
					이번 주 나의 매매 중 가장 큰 문제점 한 가지 메모하기
				</h2>
				<textarea
					value={memo}
					onChange={(e) => setMemo(e.target.value)}
					placeholder="나의 매매를 복기하고 메모해주세요."
					className="w-full h-32 sm:h-40 p-3 sm:p-4 border border-gray-300 rounded-md resize-none text-sm sm:text-base"
				/>
				<div className="flex justify-end items-center mt-3 sm:mt-4">
					<CustomButton variant="normalClean">저장/수정하기</CustomButton>
				</div>
			</div>
		</div>
	);
}
