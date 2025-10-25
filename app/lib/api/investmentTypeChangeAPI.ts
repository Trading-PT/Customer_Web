import { fetcher } from "./base/fetcher";
import {
	ApiResponse,
	CreateChangeRequest,
	ChangeRequestResponse,
} from "./apiTypes";

/**
 * 투자 유형 변경 신청 관련 API
 */
export const investmentTypeChangeAPI = {
	/**
	 * 내 변경 신청 목록 조회
	 */
	getMyChangeRequests: async (): Promise<
		ApiResponse<ChangeRequestResponse[]>
	> => {
		return fetcher<ChangeRequestResponse[]>(
			"/api/v1/investment-type-change-requests",
			{
				method: "GET",
			}
		);
	},

	/**
	 * 투자 유형 변경 신청
	 * @param data - 변경 신청 데이터
	 */
	createChangeRequest: async (
		data: CreateChangeRequest
	): Promise<ApiResponse<ChangeRequestResponse>> => {
		return fetcher<ChangeRequestResponse>(
			"/api/v1/investment-type-change-requests",
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);
	},

	/**
	 * 변경 신청 상세 조회
	 * @param requestId - 신청 ID
	 */
	getChangeRequest: async (
		requestId: number
	): Promise<ApiResponse<ChangeRequestResponse>> => {
		return fetcher<ChangeRequestResponse>(
			`/api/v1/investment-type-change-requests/${requestId}`,
			{
				method: "GET",
			}
		);
	},

	/**
	 * 변경 신청 취소
	 * @param requestId - 신청 ID
	 */
	cancelChangeRequest: async (
		requestId: number
	): Promise<ApiResponse<void>> => {
		return fetcher<void>(
			`/api/v1/investment-type-change-requests/${requestId}`,
			{
				method: "DELETE",
			}
		);
	},
};
