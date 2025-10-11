import { ApiResponse, ServerResponse } from "../apiTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI;

/**
 * 공통 API 요청 함수
 * - 모든 API 훅에서 이 함수를 사용
 * - HTTP 상태 코드 및 서버의 result 구조를 기반으로 일관된 ApiResponse 반환
 */
export async function fetcher<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> {
	try {
		const isFormData = options.body instanceof FormData;
		const xsrfToken = localStorage.getItem("XSRF-TOKEN");

		const headers: HeadersInit = {
			...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
			...(options.headers || {}),
		};

		// JSON이 아닌 FormData일 경우 Content-Type 자동 설정 방지
		if (!isFormData) {
			(headers as Record<string, string>)["Content-Type"] = "application/json";
		}

		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			headers,
			credentials: "include",
			...options,
		});

		// 본문이 비어 있을 가능성 대비
		const text = await response.text();
		const raw: ServerResponse<T> | null = text ? JSON.parse(text) : null;

		// 2xx 가 아닐 경우 실패 처리
		if (!response.ok) {
			console.warn(`⚠️ API 요청 실패 (${response.status}): ${endpoint}`);

			return {
				success: false,
				status: response.status,
				message: raw?.message || "요청이 실패했습니다.",
				error: raw?.message || `HTTP ${response.status} 오류`,
			};
		}

		// 정상 응답 (2xx)
		return {
			success: true,
			status: response.status,
			data: raw?.result,
			message: raw?.message || "요청이 성공했습니다.",
		};
	} catch (error) {
		// 네트워크 또는 JSON 파싱 실패
		console.error("❌ API Error:", error);
		return {
			success: false,
			status: 0,
			message: "네트워크 오류 또는 서버 응답 없음",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
