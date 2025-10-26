import { fetcher } from "./base/fetcher";
import {
	ApiResponse,
	LevelTestQuestionUserResponse,
	LeveltestSubmitRequest,
	LeveltestAttemptSubmitResponse,
	SliceResponse,
} from "./apiTypes";

/**
 * 레벨테스트 관련 API
 */
export const leveltestAPI = {
	/**
	 * 문제 전체 조회 (무한 스크롤)
	 * @param page - 페이지 번호 (0부터 시작)
	 * @param size - 페이지 크기
	 */
	getQuestions: async (
		page: number = 0,
		size: number = 100
	): Promise<ApiResponse<LevelTestQuestionUserResponse[]>> => {
		const response = await fetcher<SliceResponse<LevelTestQuestionUserResponse>>(
			`/api/v1/leveltests?page=${page}&size=${size}&sort=id,asc`,
			{
				method: "GET",
			}
		);

		// Slice 응답에서 content 배열만 추출
		if (response.success && response.data) {
			return {
				success: response.success,
				status: response.status,
				message: response.message,
				data: response.data.content,
			};
		}

		// 실패 시 빈 배열 반환
		return {
			success: false,
			status: response.status,
			message: response.message,
			error: response.error,
			data: [],
		};
	},

	/**
	 * 레벨테스트 제출
	 * @param data - 제출 데이터 (모든 문제의 답변)
	 */
	submitLeveltest: async (
		data: LeveltestSubmitRequest
	): Promise<ApiResponse<LeveltestAttemptSubmitResponse>> => {
		return fetcher<LeveltestAttemptSubmitResponse>(
			"/api/v1/leveltests/attempts",
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);
	},

	/**
	 * 시도 상세 조회
	 * @param attemptId - 시도 ID
	 */
	getAttemptDetail: async (attemptId: number): Promise<ApiResponse<any>> => {
		return fetcher<any>(`/api/v1/leveltests/attempts/${attemptId}`, {
			method: "GET",
		});
	},

	/**
	 * 채점 완료된 시도 조회
	 */
	getGradedAttempts: async (): Promise<ApiResponse<any[]>> => {
		return fetcher<any[]>("/api/v1/leveltests/attempts/graded", {
			method: "GET",
		});
	},
};
