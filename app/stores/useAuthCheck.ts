"use client";
import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useAuth } from "../hooks/useAuth";

export const useAuthCheck = () => {
	const { checkAuth } = useAuthStore();
	const { myInfo } = useAuth();

	useEffect(() => {
		checkAuth(myInfo);
	}, [checkAuth, myInfo]);
};
