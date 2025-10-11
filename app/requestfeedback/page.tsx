"use client";

import FeedbackHeader from "./FeedbackHeader";
import BasicOrBeforeForm from "./forms/BasicOrBeforeForm";
import SwingAfterForm from "./forms/SwingAfterForm";
import DayAfterForm from "./forms/DayAfterForm";
import ScalpingAfterForm from "./forms/ScalpingAfterForm";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";
import {
	mapSwingFormData,
	mapDayFormData,
	mapScalpingFormData,
	mapFreeFormData,
} from "../utils/feedbackFormMapper";

export default function RequestFeedback() {
	// Zustand에서 현재 로그인 유저 정보 가져오기
	const { user } = useAuthStore();

	const { requestSwingFeedback, requestDayFeedback, requestScalpingFeedback } = useAuth();

	// Zustand에 유저 정보가 없으면 로딩 또는 예외 처리
	if (!user) {
		return <div className="text-center mt-20">로그인이 필요합니다.</div>;
	}

	const investmentType = user.investmentType || "SCALPING"; // fallback
	const userLevel = user.isPremium ? "PREMIUM" : "BASIC";
	const completion = user.isCourseCompleted ? "AFTER_COMPLETION" : "BEFORE_COMPLETION";

	console.log("현재 로그인 유저 정보:");
	console.log("투자 유형:", investmentType);
	console.log("회원 등급:", userLevel);
	console.log("완강 상태:", completion);

	const handleSubmit = async (formData: any) => {
		console.log("서버로 전송할 데이터:", formData);

		try {
			let fd: FormData;
			let res;

			if (investmentType === "SWING") {
				if (userLevel === "BASIC") {
					console.log("*** SWING + BASIC ***");
					fd = mapFreeFormData(formData);
					res = await requestSwingFeedback(fd);
				} else {
					console.log("*** SWING + PREMIUM ***");
					fd = mapSwingFormData(formData);
					res = await requestSwingFeedback(fd);
				}
			} else if (investmentType === "DAY") {
				if (userLevel === "BASIC") {
					console.log("*** DAY + BASIC ***");
					fd = mapFreeFormData(formData);
					res = await requestDayFeedback(fd);
				} else {
					console.log("*** DAY + PREMIUM ***");
					fd = mapDayFormData(formData);
					res = await requestDayFeedback(fd);
				}
			} else if (investmentType === "SCALPING") {
				if (userLevel === "BASIC") {
					console.log("*** SCALPING + BASIC ***");
					fd = mapFreeFormData(formData);
					res = await requestScalpingFeedback(fd);
				} else {
					console.log("*** SCALPING + PREMIUM ***");
					fd = mapScalpingFormData(formData);
					res = await requestScalpingFeedback(fd);
				}
			}

			console.log("서버 응답:", res);
		} catch (error) {
			console.error("피드백 요청 예외 발생:", error);
			alert("네트워크 오류가 발생했습니다.");
		}
	};

	const renderForm = () => {
		if (userLevel === "BASIC" || completion === "BEFORE_COMPLETION") {
			// Zustand의 user를 그대로 넘긴다
			return <BasicOrBeforeForm onSubmit={handleSubmit} currentUser={user} />;
		}
		if (completion === "AFTER_COMPLETION") {
			if (investmentType === "SWING")
				return <SwingAfterForm currentUser={user} onSubmit={handleSubmit} />;
			if (investmentType === "DAY")
				return <DayAfterForm currentUser={user} onSubmit={handleSubmit} />;
			if (investmentType === "SCALPING")
				return <ScalpingAfterForm currentUser={user} onSubmit={handleSubmit} />;
		}
		return <div>조건에 맞는 Form이 없습니다.</div>;
	};

	return (
		<div className="flex h-screen bg-white flex-col items-center gap-6 p-6 mt-20">
			{completion === "AFTER_COMPLETION" && <FeedbackHeader />}

			{/* 조건부 렌더링된 폼 */}
			<div className="w-full max-w-lg p-6">{renderForm()}</div>
		</div>
	);
}
