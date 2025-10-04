"use client";
import React, { useState } from "react";
import Image from "next/image";

import { useAuthStore } from "../stores/authStore";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { authAPI } from "../lib/api/auth";

import CustomInputField from "../components/CustomInputField";
import CustomButton from "../components/CustomButton";
import CustomCheckBox from "../components/CustomCheckBox";
import CustomModal from "../components/CustomModal";
import { CustomLink } from "../components/CustomLink";
import ResetPasswordModal from "./ResetPasswordModal";

export default function Login() {
	const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
	const kakaoLoginUrl = `${apiBaseUrl}/oauth2/authorization/kakao`;
	const naverLoginUrl = `${apiBaseUrl}/oauth2/authorization/naver`;

	const router = useRouter();
	const setAuthLogin = useAuthStore((state) => state.login);
	const { login, isLoading } = useAuth();
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [checked, setChecked] = useState(false);
	const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);

	const handleLogin = async () => {
		if (!userId || !password) {
			setError("아이디와 비밀번호를 입력해주세요.");
			setShowErrorModal(true);
			return;
		}

		setError("");
		const loginData = {
			username: userId,
			password: password,
			rememberMe: checked,
		};

		const result = await login(loginData);
		console.log("전송된 로그인 데이터:", loginData);

		if (result.success) {
			setAuthLogin({ username: userId }); // 전역 상태 갱신
			router.push("/");
		} else {
			console.log("로그인 실패:", result);
			setError(result.error || "로그인에 실패했습니다.");
			setShowErrorModal(true);
		}
	};

	const [findIdModalOpen, setFindIdModalOpen] = useState(false);
	const [findIdEmail, setFindIdEmail] = useState("");
	const [foundId, setFoundId] = useState<string | null>(null);
	const [loadingFindId, setLoadingFindId] = useState(false);

	const handleFindId = async () => {
		if (!findIdEmail) return;
		try {
			setLoadingFindId(true);
			const res = await authAPI.findIdByEmail(findIdEmail);
			if (res.success && res.data?.userName) {
				setFoundId(`당신의 아이디는: ${res.data.userName}`);
			} else {
				setFoundId("해당 이메일로 등록된 아이디가 없습니다.");
			}
		} catch (err) {
			setFoundId("아이디 찾기 중 오류가 발생했습니다.");
		} finally {
			setLoadingFindId(false);
		}
	};

	const handleKakaoLogin = () => {
		window.location.href = kakaoLoginUrl;
	};

	const handleNaverLogin = () => {
		window.location.href = naverLoginUrl;
	};

	const handleSignupNavigation = () => {
		router.push("/signup");
	};

	const isLoginEnabled = !!(userId && password) && !isLoading;

	return (
		<div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
			<main className="w-full pt-16 flex items-center justify-center bg-gray-100 px-4 sm:px-6">
				<form
					className="
            w-full max-w-sm sm:max-w-md md:max-w-lg 
            bg-white shadow-md rounded-md 
            flex flex-col gap-10 sm:gap-12 md:gap-14 
            p-6 sm:p-8 md:p-10
          "
					onSubmit={(e) => {
						e.preventDefault();
						handleLogin();
					}}
				>
					<div className="w-full flex flex-col gap-6 items-center">
						<div className="w-full flex justify-center items-center">
							<Image
								src="/images/logo_main.png"
								alt="logo"
								width={60}
								height={60}
								priority
							/>
						</div>

						<div className="flex flex-col gap-4 w-full">
							<CustomInputField
								id="userId"
								label="아이디"
								placeholder="아이디를 입력하세요"
								value={userId}
								onChange={setUserId}
								variant={2}
								required
								autoComplete="username"
							/>
							<CustomInputField
								id="password"
								label="비밀번호"
								placeholder="비밀번호를 입력하세요"
								value={password}
								onChange={setPassword}
								variant={2}
								type="password"
								required
								autoComplete="current-password"
							/>
						</div>

						{/* 회원가입 링크 */}
						<div className="text-center text-sm sm:text-base">
							<span className="text-gray-600">첫 방문이신가요? </span>
							<CustomButton variant="onlyText" onClick={handleSignupNavigation}>
								회원가입
							</CustomButton>
						</div>

						<div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 text-sm">
							<button
								type="button"
								onClick={() => setFindIdModalOpen(true)}
								className="text-blue-600 cursor-pointer underline"
							>
								아이디 찾기
							</button>
							<button
								type="button"
								onClick={() => setResetPasswordModalOpen(true)}
								className="text-blue-600 cursor-pointer underline"
							>
								비밀번호 찾기
							</button>
						</div>

						<div className="flex flex-col w-full items-center gap-2">
							<CustomButton
								type="submit"
								width="w-full"
								variant="prettyFull"
								disabled={!isLoginEnabled}
							>
								{isLoading ? "로그인 중..." : "로그인"}
							</CustomButton>
							<CustomCheckBox
								checked={checked}
								onChange={setChecked}
								label="자동 로그인"
								size="sm"
							/>
						</div>
					</div>

					{/* 소셜 로그인 */}
					<div className="flex flex-col gap-2">
						<CustomButton
							className="bg-yellow-300 text-black px-2 py-2 rounded-lg"
							onClick={handleKakaoLogin}
							disabled={isLoading}
						>
							카카오 로그인
						</CustomButton>
						<CustomButton
							variant="normalFull"
							bgColor="bg-green-500"
							textColor="text-white"
							onClick={handleNaverLogin}
							disabled={isLoading}
						>
							네이버 로그인
						</CustomButton>
					</div>

					{/* 에러 모달 */}
					{showErrorModal && (
						<CustomModal
							isOpen={showErrorModal}
							onClose={() => setShowErrorModal(false)}
							variant={2}
							width="max-w-sm sm:max-w-md md:max-w-lg"
						>
							<div className="p-4 text-center">
								<h3 className="text-lg font-semibold mb-2">알림</h3>
								<p className="text-gray-700 mb-4">
									아이디 또는 비밀번호가 일치하지 않습니다.
								</p>
							</div>
						</CustomModal>
					)}

					{resetPasswordModalOpen && (
						<ResetPasswordModal
							isOpen={resetPasswordModalOpen}
							onClose={() => setResetPasswordModalOpen(false)}
						/>
					)}

					{/* 아이디 찾기 모달 */}
					{findIdModalOpen && (
						<CustomModal
							isOpen={findIdModalOpen}
							onClose={() => {
								setFindIdModalOpen(false);
								setFindIdEmail("");
								setFoundId(null);
							}}
							variant={1}
							width="max-w-sm sm:max-w-md md:max-w-lg"
						>
							<div className="p-6 flex flex-col gap-4">
								<CustomInputField
									variant={0}
									id="findIdEmail"
									label="이메일"
									placeholder="가입 시 등록한 이메일을 입력하세요"
									value={findIdEmail}
									onChange={setFindIdEmail}
									type="email"
									required
								/>

								<CustomButton
									variant="prettyFull"
									onClick={handleFindId}
									disabled={loadingFindId}
									width="w-full"
								>
									{loadingFindId ? "조회 중..." : "아이디 찾기"}
								</CustomButton>

								{foundId && (
									<p className="text-center text-gray-700 mt-2">{foundId}</p>
								)}
							</div>
						</CustomModal>
					)}
				</form>
			</main>
		</div>
	);
}
