"use client";
import { useEffect, useState, use } from "react";
import MonthFeedback from "./MonthFeedback";
import { tradingAPI } from "../lib/api";

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

export default function Page({
	searchParams,
}: {
	searchParams: Promise<{ year?: string; month?: string }>;
}) {
	const params = use(searchParams);
	const year = params.year || "2025";
	const month = params.month || "8";

	const [loading, setLoading] = useState(true);
	const [weeks, setWeeks] = useState<WeekData[]>([]);
	const [summary, setSummary] = useState<MonthSummary>({
		winRate: "-",
		avgProfit: "-",
		finalPnL: "-",
	});
	const [beforeMonth, setBeforeMonth] = useState("");
	const [nowMonth, setNowMonth] = useState("");
	const [beforeSummary, setBeforeSummary] = useState<MonthSummary>({
		winRate: "-",
		avgProfit: "-",
		finalPnL: "-",
	});

	useEffect(() => {
		const fetchMonthlySummary = async () => {
			setLoading(true);
			try {
				const response = await tradingAPI.getMonthlySummary(
					parseInt(year),
					parseInt(month)
				);

				if (response.success && response.data) {
					const data = response.data;

					// 주차별 데이터 변환
					const weekNames = ["첫째 주", "둘째 주", "셋째 주", "넷째 주", "다섯째 주"];
					const weeksData: WeekData[] =
						data.monthlyFeedbackSummaryResponseDTO.monthlyWeekFeedbackSummaryResponseDTOS.map(
							(weekData) => ({
								week: weekNames[weekData.week - 1] || `${weekData.week}주`,
								trades: weekData.tradingCount,
								weeklyPnL: weekData.weeklyPnl,
								new: weekData.status === "FN", // FN: 피드백 답변 안 읽음
							})
						);
					setWeeks(weeksData);

					// 현재 월 요약 데이터
					setSummary({
						winRate: `${data.monthlyFeedbackSummaryResponseDTO.winningRate.toFixed(1)}%`,
						avgProfit: `${data.monthlyFeedbackSummaryResponseDTO.monthlyAverageRnr.toFixed(
							2
						)}`,
						finalPnL: `${data.monthlyFeedbackSummaryResponseDTO.monthlyPnl.toFixed(2)}`,
					});

					// 비교 데이터 (이전 월 vs 현재 월)
					if (data.performanceComparison) {
						const beforeData = data.performanceComparison.before;
						const currentData = data.performanceComparison.current;

						setBeforeMonth(`${year}년 ${beforeData.month}월`);
						setNowMonth(`${year}년 ${currentData.month}월`);

						setBeforeSummary({
							winRate: `${beforeData.finalWinRate.toFixed(1)}%`,
							avgProfit: `${beforeData.averageRnr.toFixed(2)}`,
							finalPnL: `${beforeData.finalPnL.toFixed(2)}`,
						});
					} else {
						setBeforeMonth(`${year}년 ${parseInt(month) - 1}월`);
						setNowMonth(`${year}년 ${month}월`);
					}
				} else {
					console.error("월간 통계 조회 실패:", response.error);
				}
			} catch (error) {
				console.error("월간 통계 조회 에러:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMonthlySummary();
	}, [year, month]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg">로딩 중...</div>
			</div>
		);
	}

	return (
		<MonthFeedback
			year={year}
			month={month}
			beforeMonth={beforeMonth}
			nowMonth={nowMonth}
			weeks={weeks}
			summary={summary}
			beforeSummary={beforeSummary}
		/>
	);
}
