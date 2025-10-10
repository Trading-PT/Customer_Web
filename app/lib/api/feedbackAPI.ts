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
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => formData.append(key, value as any));
		return fetcher("/api/v1/feedback-requests/swing", { method: "POST", body: formData });
	},

	/** 데이 피드백 요청 */
	requestDayFeedback(data: DayFeedbackRequest): Promise<ApiResponse> {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (typeof value === "boolean") {
				formData.append(key, value ? "true" : "false");
			} else if (value !== undefined && value !== null) {
				formData.append(key, String(value));
			}
		});
		return fetcher("/api/v1/feedback-requests/day", { method: "POST", body: formData });
	},

	/** 스켈핑 피드백 요청 */
	requestScalpingFeedback(data: ScalpingFeedbackRequest): Promise<ApiResponse> {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => formData.append(key, value as any));
		return fetcher("/api/v1/feedback-requests/scalping", { method: "POST", body: formData });
	},
};
