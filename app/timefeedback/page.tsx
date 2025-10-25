"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TimeFeedback from "./TimeFeedback";
import BasicOrBeforeView from "./forms/BasicOrBeforeView";
import DayAfterView from "./forms/DayAfterView";
import SwingAfterView from "./forms/SwingAfterForm";
import ScalpingAfterView from "./forms/ScalpingAfterView";
import { feedbackAPI } from "../lib/api/feedbackAPI";
import { FeedbackRequestDetailResponseDTO, InvestmentType } from "../lib/api/apiTypes";

export default function Page() {
	const searchParams = useSearchParams();
	const feedbackId = searchParams.get("id");

	const [feedbackDetail, setFeedbackDetail] = useState<FeedbackRequestDetailResponseDTO | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!feedbackId) {
			setError("피드백 ID가 없습니다.");
			setLoading(false);
			return;
		}

		const loadFeedbackDetail = async () => {
			try {
				setLoading(true);
				const response = await feedbackAPI.getFeedbackRequestDetail(Number(feedbackId));

				if (response.success && response.data) {
					setFeedbackDetail(response.data);
				} else {
					setError(response.message || "피드백 상세 정보를 불러오는데 실패했습니다.");
				}
			} catch (err) {
				console.error("피드백 상세 조회 오류:", err);
				setError("네트워크 오류가 발생했습니다.");
			} finally {
				setLoading(false);
			}
		};

		loadFeedbackDetail();
	}, [feedbackId]);

	if (loading) {
		return (
			<div className="w-full p-6 mt-20 flex flex-col items-center">
				<div className="text-center py-10">로딩 중...</div>
			</div>
		);
	}

	if (error || !feedbackDetail) {
		return (
			<div className="w-full p-6 mt-20 flex flex-col items-center">
				<div className="text-center text-red-500">{error || "피드백 정보를 찾을 수 없습니다."}</div>
			</div>
		);
	}

	const investmentType: InvestmentType = feedbackDetail.investmentType;
	const detail = feedbackDetail.swingDetail || feedbackDetail.dayDetail || feedbackDetail.scalpingDetail;

	if (!detail) {
		return (
			<div className="w-full p-6 mt-20 flex flex-col items-center">
				<div className="text-center text-red-500">피드백 상세 데이터가 없습니다.</div>
			</div>
		);
	}

	// 날짜 정보 추출
	const getWeekNumber = (weekNum: number) => {
		const weeks = ["첫째 주", "둘째 주", "셋째 주", "넷째 주", "다섯째 주"];
		return weeks[weekNum - 1] || `${weekNum}째 주`;
	};

	const date = new Date(detail.createdAt);
	const year = detail.feedbackYear.toString();
	const month = detail.feedbackMonth.toString();
	const week = getWeekNumber(detail.feedbackWeek);
	const day = date.getDate().toString();
	const time = date.toTimeString().split(" ")[0];

	// membershipLevel이 BASIC인 경우 BasicOrBeforeView 사용, PREMIUM인 경우 각 투자타입별 AfterView 사용
	const shouldUseBasicView = detail.membershipLevel === "BASIC";

	return (
		<div className="w-full p-6 mt-20 flex flex-col items-center">
			<TimeFeedback
				year={year}
				month={month}
				week={week}
				day={day}
				time={time}
				title={`${month}/${day} (${investmentType}) 작성 완료`}
			/>

			{shouldUseBasicView ? (
				<BasicOrBeforeView detail={detail} investmentType={investmentType} />
			) : (
				<>
					{investmentType === "SWING" && feedbackDetail.swingDetail && (
						<SwingAfterView detail={feedbackDetail.swingDetail} />
					)}
					{investmentType === "DAY" && feedbackDetail.dayDetail && (
						<DayAfterView detail={feedbackDetail.dayDetail} />
					)}
					{investmentType === "SCALPING" && feedbackDetail.scalpingDetail && (
						<ScalpingAfterView detail={feedbackDetail.scalpingDetail} />
					)}
				</>
			)}
		</div>
	);
}


