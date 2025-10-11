/**
 * 스윙 폼 데이터를 FormData로 변환
 */
export const mapSwingFormData = (formData: any): FormData => {
	const fd = new FormData();

	fd.append("courseStatus", formData.courseStatus || "AFTER_COMPLETION");
	fd.append("membershipLevel", formData.membershipLevel || "PREMIUM");

	fd.append("feedbackYear", String(formData.feedbackYear || 2025));
	fd.append("feedbackMonth", String(formData.feedbackMonth || 10));
	fd.append("feedbackWeek", String(formData.feedbackWeek || 2)); // ex) 2주차
	fd.append("feedbackRequestDate", formData.feedbackRequestDate || new Date().toISOString().split("T")[0]);

	fd.append("category", formData.category || "string");
	fd.append("positionHoldingTime", formData.positionHoldingTime || "");
	if (formData.screenshot) fd.append("screenshotFiles", formData.screenshot);
	fd.append("position", formData.position || "LONG");
	fd.append("riskTaking", String(formData.risk || 0));
	fd.append("leverage", String(formData.leverage || 0));
	fd.append("pnl", String(formData.pl || 0));
	fd.append("rnr", String(formData.rnr || 0));
	fd.append("tradingReview", formData.tradingReview || "");
	fd.append("operatingFundsRatio", String(formData.operatingFundsRatio || 0));
	fd.append("entryPrice", String(formData.entryPrice || 0));
	fd.append("exitPrice", String(formData.exitPrice || 0));
	fd.append("settingStopLoss", String(formData.settingStopLoss || 0));
	fd.append("settingTakeProfit", String(formData.settingTakeProfit || 0));
	fd.append("positionStartReason", formData.positionStartReason || "string");
	fd.append("positionEndReason", formData.positionEndReason || "string");

	fd.append("positionStartDate", formData.positionStartDate || "");
	fd.append("positionEndDate", formData.positionEndDate || "");
	fd.append("directionFrameExists", formData.directionFrameExists ? "true" : "false");
	fd.append("directionFrame", formData.directionFrame || "");

	fd.append("mainFrame", formData.mainFrame || "");
	fd.append("subFrame", formData.subFrame || "");
	fd.append("trendAnalysis", formData.trendAnalysis || "");
	fd.append("trainerFeedbackRequestContent", formData.trainerFeedback || "");

	fd.append("entryPoint1", formData.entryPoint1 || "REVERSE");
	fd.append("entryPoint2", formData.entryPoint2 || new Date().toISOString());
	fd.append("entryPoint3", formData.entryPoint3 || new Date().toISOString());
	fd.append("grade", formData.grade || "S_PLUS");

	console.log("SWING: append 후 form data:----------------");
	fd.forEach((value, key) => console.log(key, value));

	return fd;
};

/**
 * 데이 폼 데이터를 FormData로 변환 -> 정상동작 확인 
 */
export const mapDayFormData = (formData: any): FormData => {
	const fd = new FormData();

	// console.log("append 전 foam data:----------------");
	// fd.forEach((value, key) => console.log(key, value));

	fd.append("courseStatus", formData.courseStatus || "AFTER_COMPLETION");
	fd.append("membershipLevel", formData.membershipLevel || "PREMIUM");
	fd.append("requestDate", new Date().toISOString().split("T")[0]);
	// fd.append("requestDate", "2025-09-28");
	fd.append("category", formData.category || "string");
	fd.append("positionHoldingTime", formData.positionHoldingTime || "string");
	// if (formData.screenshotFile) fd.append("screenshotFiles", formData.screenshotFile);
	if (formData.screenshot) fd.append("screenshotFiles", formData.screenshot);
	fd.append("riskTaking", String(formData.risk || 0));
	fd.append("leverage", String(formData.risk || 0));
	fd.append("position", formData.position || "LONG");
	// fd.append("position", "LONG");
	fd.append("pnl", String(formData.pl || 0));
	fd.append("rnr", String(formData.rnr || 0));
	fd.append("tradingReview", formData.tradingReview || "string");
	fd.append("operatingFundsRatio", String(formData.operatingFundsRatio || 0)); // 완강 전 필수

	fd.append("directionFrame", formData.directionFrame || "string");
	fd.append("mainFrame", formData.mainFrame || "string");
	fd.append("subFrame", formData.subFrame || "string");
	fd.append("directionFrameExists", formData.directionFrameExists ? "true" : "false");

	fd.append("trendAnalysis", formData.trendAnalysis || "string");
	fd.append("trainerFeedbackRequestContent", formData.trainerFeedback || "string");

	fd.append("entryPoint1", formData.entryPoint1 || "REVERSE");
	fd.append("grade", formData.grade || "S_PLUS");
	fd.append("entryPoint2", formData.entryPoint2 || "1H");

	fd.append("entryPrice", String(formData.entryPrice || 0)); // 완강 전 필수
	fd.append("exitPrice", String(formData.exitPrice || 0)); // 완강 전 필수
	fd.append("settingStopLoss", String(formData.settingStopLoss || 0)); // 완강 전 필수
	fd.append("settingTakeProfit", String(formData.settingTakeProfit || 0)); // 완강 전 필수
	fd.append("positionStartReason", formData.positionStartReason || "string"); // 완강 전 필수
	fd.append("positionEndReason", formData.positionEndReason || "string"); // 완강 전 필수

	console.log("DAY: append 후 form data:----------------");
	fd.forEach((value, key) => console.log(key, value));

	return fd;
};

/**
 * 스켈핑 폼 데이터를 FormData로 변환
 * API 스펙에 따라 필수 필드 포함: position, pnl, rnr, entryPrice, exitPrice 등
 */
export const mapScalpingFormData = (formData: any): FormData => {
	const fd = new FormData();

	// 필수 필드
	fd.append("courseStatus", formData.courseStatus || "AFTER_COMPLETION");
	fd.append("membershipLevel", formData.membershipLevel || "PREMIUM");
	fd.append("feedbackRequestDate", formData.requestDate || new Date().toISOString().split("T")[0]);
	fd.append("category", formData.category || "string");
	fd.append("riskTaking", String(formData.risk || 0));
	fd.append("leverage", String(formData.leverage || 0));
	fd.append("position", formData.position || "LONG");
	fd.append("pnl", String(formData.pl || 0));
	fd.append("rnr", String(formData.rnr || 0));

	// 항상 필수 필드 (스켈핑 API 스펙)
	fd.append("operatingFundsRatio", String(formData.operatingFundsRatio || 0));
	fd.append("entryPrice", String(formData.entryPrice || 0));
	fd.append("exitPrice", String(formData.exitPrice || 0));
	fd.append("settingStopLoss", String(formData.settingStopLoss || 0));
	fd.append("settingTakeProfit", String(formData.settingTakeProfit || 0));
	fd.append("positionStartReason", formData.positionStartReason || "string");
	fd.append("positionEndReason", formData.positionEndReason || "string");

	// 선택 필드
	fd.append("positionHoldingTime", formData.positionHoldingTime || "");
	if (formData.screenshot) fd.append("screenshotFiles", formData.screenshot);
	fd.append("tradingReview", formData.tradingReview || "");
	fd.append("trainerFeedbackRequestContent", formData.trainerFeedback || "");

	console.log("SCALPING: append 후 form data:----------------");
	fd.forEach((value, key) => console.log(key, value));

	return fd;
};

/**
 * 데이, 스윙, 스켈핑 -> 무엇이든, 무료인 고객의 폼 데이터를 FormData로 변환
 */
export const mapFreeFormData = (formData: any): FormData => {
	const fd = new FormData();

	fd.append("courseStatus", formData.courseStatus || "BEFORE_COMPLETION");
	fd.append("membershipLevel", formData.membershipLevel || "BASIC");

	fd.append("feedbackRequestDate", formData.feedbackRequestDate || new Date().toISOString().split("T")[0]);
	// fd.append("feedbackRequestDate", "2025-10-09");
	fd.append("feedbackYear", "2025"); // 스윙-필수 
	fd.append("feedbackMonth", "10"); // 스윙-필수
	fd.append("feedbackWeek", "2"); // 스윙-필수 

	fd.append("category", formData.category || "string");
	fd.append("positionHoldingTime", formData.positionHoldingTime || "");
	if (formData.screenshot) fd.append("screenshotFiles", formData.screenshot);

	fd.append("position", formData.position || "LONG");
	fd.append("riskTaking", String(formData.riskTaking || 0));
	fd.append("leverage", String(formData.leverage || 0)); 
	fd.append("pnl", String(formData.pl || 0));
	fd.append("rnr", String(formData.rnr || 0));

	fd.append("operatingFundsRatio", String(formData.operatingFundsRatio || 0));
	fd.append("entryPrice", String(formData.entryPrice || 0));
	fd.append("exitPrice", String(formData.exitPrice || 0));
	fd.append("settingStopLoss", String(formData.settingStopLoss || 0));
	fd.append("settingTakeProfit", String(formData.settingTakeProfit || 0));

	fd.append("positionStartReason", formData.positionStartReason || "string");
	fd.append("positionEndReason", formData.positionEndReason || "string");
	fd.append("tradingReview", formData.tradingReview || "");

	console.log("FREE: append 후 form data:----------------");
	fd.forEach((value, key) => console.log(key, value));

	return fd;
};
