import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../lib/api/auth";

// zustand/middleware/persist 활용하여, zustand 상태를 localStorage와 동기화 했음 

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
	checkAuth: () => Promise<void>;
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

			// 최초 접속 시 쿠키 기반 인증 확인
			checkAuth: async () => {
				try {
					const res = await authAPI.getUserProfile();
					if (res.status === 200 && res.data) {
						set({
							isAuthenticated: true,
							user: res.data,
						});
					} else {
						set({ isAuthenticated: false, user: null });
					}
				} catch {
					set({ isAuthenticated: false, user: null });
				}
			},
		}),
		{
			name: "auth-storage",
		}
	)
);