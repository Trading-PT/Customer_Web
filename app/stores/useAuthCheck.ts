"use client";

import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

/**
 * 최초 접속 시 서버에 /api/v1/auth/getUserInfo 요청을 보내
 * 로그인 상태인지 확인하는 훅
 */
export const useAuthCheck = () => {
	const { checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);
};
