"use client";

import { useAuthCheck } from "../stores/useAuthCheck";

/** 앱 전체에서 최초 1회 인증 검증을 실행 */
export default function AuthInitializer() {
	useAuthCheck();
	return null; // UI 렌더링 없음
}
