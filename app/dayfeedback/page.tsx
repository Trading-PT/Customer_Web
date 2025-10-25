"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DayFeedback from "./DayFeedback";
import { feedbackAPI } from "../lib/api/feedbackAPI";
import { FeedbackRequestListItemResponseDTO } from "../lib/api/apiTypes";

interface DayData {
	time: string;
	title: string;
	new: boolean;
	feedbackId: number;
}

export default function Page() {
	const searchParams = useSearchParams();

	// URL 파라미터에서 날짜 정보 가져오기
	const year = searchParams.get("year") || "2025";
	const month = searchParams.get("month") || "1";
	const week = searchParams.get("week") || "첫째 주";
	const day = searchParams.get("day") || "1";

	const [entries, setEntries] = useState<DayData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadFeedbackList = async () => {
			try {
				setLoading(true);
				const response = await feedbackAPI.getFeedbackRequestsByDate(
					Number(year),
					Number(month),
					Number(day)
				);

				if (response.success && response.data) {
					// API 응답을 DayData 형식으로 변환
					const feedbackList: FeedbackRequestListItemResponseDTO[] = response.data;
					const transformedEntries: DayData[] = feedbackList.map((item, index) => {
						// createdAt을 시간으로 변환
						const createdDate = new Date(item.createdAt);
						const hours = createdDate.getHours();
						const minutes = createdDate.getMinutes();
						const seconds = createdDate.getSeconds();
						const period = hours >= 12 ? "pm" : "am";
						const displayHours = hours % 12 || 12;
						const time = `${period} ${displayHours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

						// 피드백 상태가 "FN"(답변 안 읽음)인 경우 new로 표시
						const isNew = item.status === "FN";

						// 제목 생성: investmentType 포함
						const investmentTypeLabel =
							item.investmentType === "DAY" ? "데이" :
							item.investmentType === "SWING" ? "스윙" :
							item.investmentType === "SCALPING" ? "스켈핑" : "";

						return {
							time,
							title: `${month}/${day} (${investmentTypeLabel} ${index + 1}) 작성 완료`,
							new: isNew,
							feedbackId: item.id,
						};
					});

					setEntries(transformedEntries);
				} else {
					setError(response.message || "피드백 목록을 불러오는데 실패했습니다.");
				}
			} catch (err) {
				console.error("피드백 목록 조회 오류:", err);
				setError("네트워크 오류가 발생했습니다.");
			} finally {
				setLoading(false);
			}
		};

		loadFeedbackList();
	}, [year, month, day]);

	if (loading) {
		return (
			<div className="p-6 mt-20 flex justify-center items-center">
				<div className="text-center py-10">로딩 중...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6 mt-20 flex justify-center items-center">
				<div className="text-center text-red-500">{error}</div>
			</div>
		);
	}

	return (
		<DayFeedback
			year={year}
			month={month}
			week={week}
			day={day}
			entries={entries}
		/>
	);
}
