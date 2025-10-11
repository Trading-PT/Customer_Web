import { ApiResponse, ServerResponse } from "../apiTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI;

export async function fetcher<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> {
	try {
		const isFormData = options.body instanceof FormData;

		// ✅ 1️⃣ 로컬에서 기존 토큰 읽기
		const localToken = localStorage.getItem("XSRF-TOKEN");

		const headers: HeadersInit = {
			...(localToken ? { "X-XSRF-TOKEN": localToken } : {}),
			...(options.headers || {}),
		};

		if (!isFormData) {
			(headers as Record<string, string>)["Content-Type"] = "application/json";
		}

		console.log("🚀 API 요청 시작:", endpoint);
		console.log("👉 요청에 사용된 XSRF-TOKEN:", localToken);

		// ✅ 2️⃣ 실제 요청
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			headers,
			credentials: "include", // 쿠키 포함 필수
			...options,
		});

		// ✅ 3️⃣ 응답 헤더에서 새 CSRF 토큰 확인
		const newHeaderToken =
			response.headers.get("x-csrf-token") ||
			response.headers.get("x-xsrf-token") ||
			response.headers.get("csrf-token") ||
			response.headers.get("xsrf-token");

		if (newHeaderToken) {
			const currentToken = localStorage.getItem("XSRF-TOKEN");
			if (newHeaderToken !== currentToken) {
				console.log("🆕 서버에서 새로운 CSRF 토큰 수신:", newHeaderToken);
				localStorage.setItem("XSRF-TOKEN", newHeaderToken);
			}
		} else {
			console.log("⚠️ 응답에 새로운 CSRF 토큰 헤더 없음 — 기존 값 유지");
		}

		// ✅ 4️⃣ 본문 파싱
		const text = await response.text();
		const raw: ServerResponse<T> | null = text ? JSON.parse(text) : null;

		// ✅ 5️⃣ 오류 처리
		if (!response.ok) {
			console.warn(`⚠️ API 요청 실패 (${response.status}): ${endpoint}`);
			return {
				success: false,
				status: response.status,
				message: raw?.message || "요청이 실패했습니다.",
				error: raw?.message || `HTTP ${response.status} 오류`,
			};
		}

		console.log("✅ 요청 성공:", endpoint);
		return {
			success: true,
			status: response.status,
			data: raw?.result,
			message: raw?.message || "요청이 성공했습니다.",
		};
	} catch (error) {
		console.error("❌ API Error:", error);
		return {
			success: false,
			status: 0,
			message: "네트워크 오류 또는 서버 응답 없음",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
