import { fetcher } from "./base/fetcher";
import {
	ApiResponse,
	SignupRequest,
	LoginRequest,
	FindIdResult,
	FindIdResponse
} from "./apiTypes";

export const authAPI = {
	signup(signupData: SignupRequest): Promise<ApiResponse> {
		return fetcher("/api/v1/auth/signup", {
			method: "POST",
			body: JSON.stringify(signupData),
		});
	},

	login(loginData: LoginRequest): Promise<ApiResponse> {
		return fetcher("/api/v1/auth/login", {
			method: "POST",
			body: JSON.stringify(loginData),
		});
	},

	logout(): Promise<ApiResponse> {
		return fetcher("/api/v1/auth/logout", { method: "POST" });
	},

	deleteUser(): Promise<ApiResponse> {
		return fetcher("/api/v1/auth/users", { method: "DELETE" });
	},

	sendPhoneCode(phone: string): Promise<ApiResponse> {
		return fetcher("/api/v1/auth/phone/code", {
			method: "POST",
			body: JSON.stringify({ phone }),
		});
	},

	verifyPhoneCode(phone: string, code: string): Promise<ApiResponse> {
		return fetcher("/api/v1/auth/phone/verify", {
			method: "POST",
			body: JSON.stringify({ type: "PHONE", value: phone, code }),
		});
	},

	sendEmailCode(email: string): Promise<ApiResponse> {
		return fetcher("/api/v1/auth/email/code", {
			method: "POST",
			body: JSON.stringify({ email }),
		});
	},

	verifyEmailCode(email: string, code: string): Promise<ApiResponse> {
		return fetcher("/api/v1/auth/email/verify", {
			method: "POST",
			body: JSON.stringify({ type: "EMAIL", value: email, code }),
		});
	},

	findIdByEmail(email: string): Promise<FindIdResponse> {
		return fetcher<FindIdResult>("/api/v1/auth/id/find", {
			method: "POST",
			body: JSON.stringify({ email }),
		});
	},

	getUserProfile(): Promise<ApiResponse> {
		return fetcher("/api/v1/auth/me");
	},

	getSocialInfo(): Promise<
		ApiResponse<{
			userId: number;
			username: string;
			name: string;
			email: string;
			passwordHash: string;
		}>
	> {
		return fetcher("/api/v1/auth/social-info", { method: "GET" });
	},

	/** 비로그인 상태 비밀번호 재설정 */
	resetPasswordUnauthenticated(
		email: string,
		code: string,
		newPassword: string,
		newPasswordCheck: string
	): Promise<ApiResponse> {
		return fetcher("/api/v1/auth/password/update", {
			method: "PUT",
			body: JSON.stringify({
				email,
				code,
				newPassword,
				newPasswordCheck,
			}),
		});
	},

	/** 로그인 상태 비밀번호 변경 */
	resetPasswordAuthenticated(
		currentPassword: string,
		newPassword: string
	): Promise<ApiResponse> {
		return fetcher("/api/v1/user/password/change", {
			method: "POST",
			body: JSON.stringify({
				currentPassword,
				newPassword,
			}),
		});
	},

	/** 프로필 이미지 변경 */
	updateProfileImage(file: File): Promise<ApiResponse> {
		const formData = new FormData();
		formData.append("file", file);

		return fetcher("/api/v1/user/profile-image", {
			method: "POST",
			body: formData,
		});
	},
};
