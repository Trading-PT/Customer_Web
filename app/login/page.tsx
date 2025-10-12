"use client";
import Image from "next/image";
import { useLoginForm } from "./useLoginForm";
import LoginForm from "./LoginForm";
import SocialLoginButtons from "./SocialLoginButtons";
import FindIdModal from "./FindIdModal";
import ResetPasswordModal from "./ResetPasswordModal";
import ErrorModal from "./ErrorModal";
import CustomButton from "../components/CustomButton";
import { useState } from "react";

export default function Login() {
	const {
		userId,
		setUserId,
		password,
		setPassword,
		checked,
		setChecked,
		error,
		showErrorModal,
		setShowErrorModal,
		isLoading,
		handleLogin,
	} = useLoginForm();

	const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
	const kakaoLoginUrl = `${apiBaseUrl}/oauth2/authorization/kakao`;
	const naverLoginUrl = `${apiBaseUrl}/oauth2/authorization/naver`;

	const [findIdModalOpen, setFindIdModalOpen] = useState(false);
	const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);

	return (
		<div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
			<main className="w-full pt-16 flex items-center justify-center bg-gray-100 px-4 sm:px-6">
				<div
					className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white shadow-md rounded-md
          flex flex-col gap-10 sm:gap-12 md:gap-14 p-6 sm:p-8 md:p-10"
				>
					<div className="w-full flex flex-col gap-6 items-center">
						<Image src="/images/logo_main.png" alt="logo" width={60} height={60} priority />

						<LoginForm
							userId={userId}
							setUserId={setUserId}
							password={password}
							setPassword={setPassword}
							checked={checked}
							setChecked={setChecked}
							isLoading={isLoading}
							onSubmit={handleLogin}
						/>
						{showErrorModal && (
							<div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded w-full">
								아이디 또는 비밀번호가 일치하지 않습니다.
							</div>
						)}

						<div className="text-center text-sm sm:text-base">
							<span className="text-gray-600">첫 방문이신가요? </span>
							<CustomButton variant="onlyText" onClick={() => location.href = "/signup"}>
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

						<SocialLoginButtons
							onKakao={() => (window.location.href = kakaoLoginUrl)}
							onNaver={() => (window.location.href = naverLoginUrl)}
							disabled={isLoading}
						/>
					</div>
				</div>
			</main>

			{/* 모달 */}
			{/* <ErrorModal
				isOpen={showErrorModal}
				message={"아이디 또는 비밀번호가 일치하지 않습니다."}
				onClose={() => setShowErrorModal(false)}
			/> */}
			<FindIdModal isOpen={findIdModalOpen} onClose={() => setFindIdModalOpen(false)} />
			<ResetPasswordModal
				isOpen={resetPasswordModalOpen}
				onClose={() => setResetPasswordModalOpen(false)}
			/>
		</div>
	);
}
