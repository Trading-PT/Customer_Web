import { fetcher } from "./base/fetcher";
import {
	ApiResponse,
	SwingFeedbackRequest,
	DayFeedbackRequest,
	ScalpingFeedbackRequest,
} from "./apiTypes";

export const feedbackAPI = {
	/** 스윙 피드백 요청 */
	requestSwingFeedback(data: SwingFeedbackRequest): Promise<ApiResponse> {
		// data는 이미 FormData 객체이므로 그대로 전달
		return fetcher("/api/v1/feedback-requests/swing", { method: "POST", body: data });
	},

	/** 데이 피드백 요청 */
	requestDayFeedback(data: DayFeedbackRequest): Promise<ApiResponse> {
		// data는 이미 FormData 객체이므로 그대로 전달
		return fetcher("/api/v1/feedback-requests/day", { method: "POST", body: data });
	},

	/** 스켈핑 피드백 요청 */
	requestScalpingFeedback(data: ScalpingFeedbackRequest): Promise<ApiResponse> {
		// data는 이미 FormData 객체이므로 그대로 전달
		return fetcher("/api/v1/feedback-requests/scalping", { method: "POST", body: data });
	},
};
