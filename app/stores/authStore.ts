import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../lib/api/auth";

interface User {
	name?: string;
	username?: string;
	isSub?: boolean;
}

interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	login: (user: User) => void;
	logout: () => void;
	checkAuth: (myInfoFn?: () => Promise<any>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			isAuthenticated: false,
			user: null,

			login: (user) =>
				set({
					isAuthenticated: true,
					user,
				}),

			logout: () =>
				set({
					isAuthenticated: false,
					user: null,
				}),

			// 최초 접속 시 myInfo를 호출
			checkAuth: async (myInfoFn?: () => Promise<any>) => {
				try {
					const res = myInfoFn ? await myInfoFn() : await authAPI.getUserProfile();

					if (res?.success && res?.data) {
						set({
							isAuthenticated: true,
							user: res.data,
						});
					} else {
						set({ isAuthenticated: false, user: null });
					}
				} catch (err) {
					console.error("checkAuth 오류:", err);
					set({ isAuthenticated: false, user: null });
				}
			},
		}),
		{
			name: "auth-storage",
		}
	)
);
