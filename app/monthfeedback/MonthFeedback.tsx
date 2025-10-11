"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface WeekData {
	week: string;
	trades: number | string;
	weeklyPnL: number | string;
	new: boolean;
}

interface MonthSummary {
	winRate: string;
	avgProfit: string;
	finalPnL: string;
}

interface MonthFeedbackProps {
	year: string;
	month: string;
	beforeMonth: string;
	nowMonth: string;
	weeks: WeekData[];
	summary: MonthSummary;
	beforeSummary?: MonthSummary;
}

export default function MonthFeedback({
	year,
	month,
	beforeMonth,
	nowMonth,
	weeks,
	summary,
	beforeSummary,
}: MonthFeedbackProps) {
	const router = useRouter();

	return (
		<div className="p-4 sm:p-6 mt-20 sm:mt-25">
			{/* 타이틀 */}
			<h2 className="text-gray-400 text-base sm:text-lg mb-1 sm:mb-2">
				{year}년 {month}월
			</h2>
			<h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">월간 매매일지</h1>

			{/* 테이블 (모바일 스크롤 지원) */}
			<div className="border border-gray-400 rounded-lg overflow-hidden mb-10 overflow-x-auto">
				<table className="min-w-full border-collapse text-center text-sm sm:text-base">
					<thead>
						<tr>
							<th className="w-28 sm:w-40 border border-gray-300 bg-gray-50"></th>
							{weeks.map((w) => (
								<th
									key={w.week}
									className="border border-gray-300 py-2 px-2 sm:px-4"
								>
									<button
										className="relative px-2 sm:px-4 py-1 bg-gray-800 text-white text-xs sm:text-sm rounded-md cursor-pointer"
										onClick={() =>
											router.push(
												`/weekfeedback?year=${year}&month=${month}&week=${w.week}`
											)
										}
									>
										{w.week}
										{w.new && (
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
							{weeks.map((w) => (
								<td key={w.week + "-trades"} className="border border-gray-300">
									{w.trades}
								</td>
							))}
						</tr>
						<tr>
							<td className="border border-gray-300 py-2 px-2 sm:px-4 text-left">
								주간 p&l
							</td>
							{weeks.map((w) => (
								<td key={w.week + "-pnl"} className="border border-gray-300">
									{w.weeklyPnL}
								</td>
							))}
						</tr>
						<tr>
							<td className="border border-gray-300 py-2 px-2 sm:px-4 text-left">
								월간 최종 승률
							</td>
							<td className="border border-gray-300" colSpan={weeks.length}>
								{summary.winRate}
							</td>
						</tr>
						<tr>
							<td className="border border-gray-300 py-2 px-2 sm:px-4 text-left">
								월간 평균 손익비
							</td>
							<td className="border border-gray-300" colSpan={weeks.length}>
								{summary.avgProfit}
							</td>
						</tr>
						<tr>
							<td className="border border-gray-300 py-2 px-2 sm:px-4 text-left">
								월간 최종 p&l
							</td>
							<td className="border border-gray-300" colSpan={weeks.length}>
								{summary.finalPnL}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* 비교 섹션 */}
			<div className="mt-8 sm:mt-12">
				<h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 sm:mb-8">
					<span className="bg-yellow-100 px-2">
						{beforeMonth} 대비 {nowMonth}의 매매 성적 변화량
					</span>
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16">
					{/* Before Month */}
					<div>
						<h3 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
							{beforeMonth}
						</h3>
						<div className="border-t-2 border-yellow-900 pt-3 sm:pt-4">
							<div className="flex justify-between py-2 text-gray-700 text-sm sm:text-base">
								<span>월간 최종 승률</span>
								<span>{beforeSummary?.winRate || summary.winRate}</span>
							</div>
							<div className="flex justify-between py-2 text-gray-700 text-sm sm:text-base">
								<span>월간 평균 손익비</span>
								<span>{beforeSummary?.avgProfit || summary.avgProfit}</span>
							</div>
							<div className="flex justify-between py-2 text-gray-700 text-sm sm:text-base">
								<span>월간 최종 p&l</span>
								<span>{beforeSummary?.finalPnL || summary.finalPnL}</span>
							</div>
						</div>
					</div>

					{/* Now Month */}
					<div>
						<h3 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
							{nowMonth}
						</h3>
						<div className="border-t-2 border-yellow-900 pt-3 sm:pt-4">
							<div className="flex justify-between py-2 text-gray-900 font-semibold text-sm sm:text-base">
								<span>월간 최종 승률</span>
								<span>{summary.winRate}</span>
							</div>
							<div className="flex justify-between py-2 text-gray-900 font-semibold text-sm sm:text-base">
								<span>월간 평균 손익비</span>
								<span>{summary.avgProfit}</span>
							</div>
							<div className="flex justify-between py-2 text-gray-900 font-semibold text-sm sm:text-base">
								<span>월간 최종 p&l</span>
								<span>{summary.finalPnL}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
