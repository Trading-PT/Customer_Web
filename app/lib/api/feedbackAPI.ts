import { fetcher } from "./base/fetcher";
import {
	ApiResponse,
	SwingFeedbackRequest,
	DayFeedbackRequest,
	ScalpingFeedbackRequest,
	FeedbackListResponseDTO,
	FeedbackRequestDetailResponseDTO,
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

	/** 피드백 요청 목록 조회 (무한 스크롤) */
	getFeedbackRequests(page: number = 0, size: number = 12): Promise<ApiResponse<FeedbackListResponseDTO>> {
		const params = new URLSearchParams({
			page: page.toString(),
			size: size.toString(),
		});
		return fetcher(`/api/v1/feedback-requests?${params.toString()}`, { method: "GET" });
	},

	/** 피드백 요청 상세 조회 */
	getFeedbackRequestDetail(feedbackRequestId: number): Promise<ApiResponse<FeedbackRequestDetailResponseDTO>> {
		return fetcher(`/api/v1/feedback-requests/${feedbackRequestId}`, { method: "GET" });
	},

	/** 피드백 요청 삭제 */
	deleteFeedbackRequest(feedbackRequestId: number): Promise<ApiResponse> {
		return fetcher(`/api/v1/feedback-requests/${feedbackRequestId}`, { method: "DELETE" });
	},
};
