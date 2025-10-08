"use client";

import FeedbackHeader from "./FeedbackHeader";
import BasicOrBeforeForm from "./forms/BasicOrBeforeForm";
import SwingAfterForm from "./forms/SwingAfterForm";
import DayAfterForm from "./forms/DayAfterForm";
import ScalpingAfterForm from "./forms/ScalpingAfterForm";
import { mockUsers } from "../mocks/user";
import { useAuth } from "../hooks/useAuth";
import { mapSwingFormData, mapDayFormData, mapScalpingFormData, mapFreeFormData } from "../utils/feedbackFormMapper";

export default function RequestFeedback() {
	// 현재 로그인된 사용자
	// 0 - 무료, 1 - 스윙, 2 - 데이, 3 - 스켈핑 
	const currentUser = mockUsers[0];
	const { requestSwingFeedback, requestDayFeedback, requestScalpingFeedback } = useAuth();

	// 사용자 지위, 투자 유형, 완강 여부 
	const { userLevel, investmentType, completion } = currentUser;

	console.log("User::");
	console.log(investmentType);
	console.log(completion);



	const handleSubmit = async (formData: any) => {
		console.log("서버로 전송할 데이터:", formData);

		try {
			let fd: FormData;
			let res;

			if (investmentType === "SWING") {
				console.log("******** userLevel은:", userLevel);
				// SWING 이면서 무료인 경우 데이터 가공 따로 하기 
				if (userLevel === "BASIC") {
					console.log("*** SWING + BASIC ***");
					fd = mapFreeFormData(formData); // 여기서 필드만 가공
					console.log("-----------BASIC: 정제된 데이터는 (entries):-----------");
					fd.forEach((value, key) => console.log(key, value));
					res = await requestSwingFeedback(fd); // 동일한 API에게 요청함 
					console.log("저장 결과:", res);
				}

				else if (userLevel === "PREMIUM") {
					console.log("*** SWING + PREMIUM ***");
					fd = mapSwingFormData(formData);
					console.log("-----------정제된 데이터는 (entries):-----------");
					fd.forEach((value, key) => console.log(key, value));
					res = await requestSwingFeedback(fd);
					console.log("저장 결과:", res);
				}

			} else if (investmentType === "DAY") {
				// DAY 이면서 무료인 경우 데이터 가공 따로 하기
				if (userLevel === "BASIC") {
					console.log("DAY + BASIC");
					fd = mapFreeFormData(formData);
					console.log("-----------BASIC: 정제된 데이터는 (entries):-----------");
					fd.forEach((value, key) => console.log(key, value));
					res = await requestDayFeedback(fd);
					console.log("저장 결과:", res);
				}

				else if (userLevel === "PREMIUM") {
					console.log("DAY + PREMIUM");
					fd = mapDayFormData(formData);
					console.log("-----------정제된 데이터는 (entries):-----------");
					fd.forEach((value, key) => console.log(key, value));
					console.log("-------------정제된 데이터 끝------------------");
					res = await requestDayFeedback(fd);
					console.log("저장 결과:", res);
				}

			} else if (investmentType === "SCALPING") {
				// TODO: SCALPING 이면서 무료인 경우 데이터 가공 따로 하기
				if (userLevel === "BASIC") {
					console.log("SCALPING + BASIC");
					fd = mapFreeFormData(formData);
					console.log("-----------BASIC: 정제된 데이터는 (entries):-----------");
					fd.forEach((value, key) => console.log(key, value));
					res = await requestScalpingFeedback(fd);
					console.log("저장 결과:", res);
				}

				else if (userLevel === "PREMIUM") {
					console.log("SCALPING + PREMIUM");
					fd = mapScalpingFormData(formData);
					console.log("정제된 데이터는 (entries):");
					fd.forEach((value, key) => console.log(key, value));
					res = await requestScalpingFeedback(fd);
					console.log("저장 결과:", res);
				}
			}

			console.log("서버 응답:", res);
		} catch (error) {
			console.error("피드백 요청 예외 발생:", error);
			alert("네트워크 오류가 발생했습니다.");
		}
	};

	const renderForm = () => {
		if (completion === "FREE" || completion === "BEFORE_COMPLETION") {
			return <BasicOrBeforeForm onSubmit={handleSubmit} currentUser={currentUser} />;
		}
		if (completion === "AFTER_COMPLETION") {
			if (investmentType === "SWING") return <SwingAfterForm currentUser={currentUser} onSubmit={handleSubmit} />;
			if (investmentType === "DAY") return <DayAfterForm currentUser={currentUser} onSubmit={handleSubmit} />;
			if (investmentType === "SCALPING") return <ScalpingAfterForm currentUser={currentUser} onSubmit={handleSubmit} />;
		}
		return <div>조건에 맞는 Form이 없습니다.</div>;
	};

	return (
		<div className="flex h-screen bg-white flex-col items-center gap-6 p-6 mt-20">
			{(completion == "AFTER_COMPLETION") && (
				<FeedbackHeader />
			)}

			{/* 조건부 렌더링된 폼 */}
			<div className="w-full max-w-lg p-6">
				{renderForm()}
			</div>
		</div>
	);
}
