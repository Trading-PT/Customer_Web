import { fetcher } from "./base/fetcher";
import {
	ApiResponse,
	ConsultationCreateRequest,
	ConsultationUpdateRequest,
	ConsultationResponse,
	SlotAvailabilityDTO,
} from "./apiTypes";

/**
 * 상담 관련 API
 */
export const consultationAPI = {
	/**
	 * 특정 날짜의 상담 가능 시간대 조회
	 * @param date - 조회할 날짜 (YYYY-MM-DD 형식)
	 */
	getAvailableSlots: async (
		date: string
	): Promise<ApiResponse<SlotAvailabilityDTO[]>> => {
		return fetcher<SlotAvailabilityDTO[]>(
			`/api/v1/consultations/availability?date=${date}`,
			{
				method: "GET",
			}
		);
	},

	/**
	 * 상담 예약 생성
	 * @param data - 상담 예약 생성 요청 데이터
	 */
	createConsultation: async (
		data: ConsultationCreateRequest
	): Promise<ApiResponse<number>> => {
		return fetcher<number>("/api/v1/consultations", {
			method: "POST",
			body: JSON.stringify(data),
		});
	},

	/**
	 * 고객별 상담 예약 목록 조회
	 */
	getMyConsultations: async (): Promise<
		ApiResponse<ConsultationResponse[]>
	> => {
		return fetcher<ConsultationResponse[]>("/api/v1/consultations/me", {
			method: "GET",
		});
	},

	/**
	 * 상담 예약 수정
	 * @param data - 상담 예약 수정 요청 데이터
	 */
	updateConsultation: async (
		data: ConsultationUpdateRequest
	): Promise<ApiResponse<number>> => {
		return fetcher<number>("/api/v1/consultations/me", {
			method: "PUT",
			body: JSON.stringify(data),
		});
	},

	/**
	 * 상담 예약 삭제
	 * @param consultationId - 삭제할 상담 예약 ID
	 */
	deleteConsultation: async (
		consultationId: number
	): Promise<ApiResponse<void>> => {
		return fetcher<void>(`/api/v1/consultations/me/${consultationId}`, {
			method: "DELETE",
		});
	},
};
