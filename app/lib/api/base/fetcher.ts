import { ApiResponse, ServerResponse } from "../apiTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI;

/**
 * 공통 API 요청 함수
 * 모든 API 클래스가 이 함수를 통해 fetch 요청을 수행
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

		if (!isFormData) {
			(headers as Record<string, string>)["Content-Type"] = "application/json";
		}

		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			headers,
			credentials: "include",
			...options,
		});

		const text = await response.text();
		const raw: ServerResponse<T> = text ? JSON.parse(text) : null;

		return {
			success: true,
			data: raw?.result,
			message: raw?.message,
		};
	} catch (error) {
		console.error("❌ API Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
