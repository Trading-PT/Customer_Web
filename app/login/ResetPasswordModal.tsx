"use client";

import React, { useState } from "react";
import CustomModal from "../components/CustomModal";
import CustomInputField from "../components/CustomInputField";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../hooks/useAuth";
import { authAPI } from "../lib/api/auth";

interface ResetPasswordModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function ResetPasswordModal({ isOpen, onClose }: ResetPasswordModalProps) {
	// 입력 상태
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordCheck, setNewPasswordCheck] = useState("");

	// UI 상태
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	// useAuth에서 불러오기
	const { resetPasswordUnauthenticated } = useAuth();

	// 이메일 인증코드 발송
	const handleSendEmailCode = async () => {
		if (!email) {
			setErrorMsg("이메일을 입력해주세요.");
			return;
		}
		setLoading(true);
		setErrorMsg(null);
		const res = await authAPI.sendEmailCode(email);
		setLoading(false);

		if (res.success) {
			setSuccessMsg("인증코드가 이메일로 전송되었습니다.");
		} else {
			setErrorMsg(res.error || "인증코드 전송에 실패했습니다.");
		}
	};

	// 비밀번호 재설정 요청
	const handleResetPassword = async () => {
		if (!email || !code || !newPassword || !newPasswordCheck) {
			setErrorMsg("모든 항목을 입력해주세요.");
			return;
		}

		if (newPassword !== newPasswordCheck) {
			setErrorMsg("비밀번호가 일치하지 않습니다.");
			return;
		}

		setErrorMsg(null);
		setSuccessMsg(null);
		setLoading(true);

		const res = await resetPasswordUnauthenticated(email, code, newPassword, newPasswordCheck);
		setLoading(false);

		if (res.success) {
			setSuccessMsg("비밀번호가 성공적으로 재설정되었습니다.");
			setTimeout(() => {
				onClose();
			}, 1500);
		} else {
			setErrorMsg(res.error || "비밀번호 재설정에 실패했습니다.");
		}
	};

	return (
		<CustomModal isOpen={isOpen} onClose={onClose} variant={1} width="w-xl">
			<div className="p-3 flex flex-col items-center justify-center space-y-4">
				<h2 className="text-lg font-semibold text-gray-800 mb-2">비밀번호 재설정</h2>

				{/* 이메일 입력 + 인증코드 발송 버튼 */}
				<CustomInputField
					placeholder="이메일 입력"
					value={email}
					onChange={setEmail}
					variant={3}
					buttonLabel="인증하기"
					onButtonClick={handleSendEmailCode}
					disabled={loading}
					type="email"
					autoComplete="off"
				/>

				{/* 인증코드 입력 */}
				<CustomInputField
					placeholder="이메일로 받은 인증코드 입력"
					value={code}
					onChange={setCode}
					variant={2}
					autoComplete="off"
				/>

				{/* 새 비밀번호 입력 */}
				<CustomInputField
					placeholder="새 비밀번호 입력"
					value={newPassword}
					onChange={setNewPassword}
					variant={2}
					type="password"
					autoComplete="new-password"
				/>

				{/* 새 비밀번호 재입력 */}
				<CustomInputField
					placeholder="새 비밀번호 재입력"
					value={newPasswordCheck}
					onChange={setNewPasswordCheck}
					variant={2}
					type="password"
					autoComplete="new-password"
				/>

				{/* 메시지 영역 */}
				{errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
				{successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

				{/* 완료 버튼 */}
				<div className="w-full mt-2 flex items-center justify-center">
					<CustomButton
						variant="prettyFull"
						onClick={handleResetPassword}
						disabled={loading}
					>
						{loading ? "처리 중..." : "완료"}
					</CustomButton>
				</div>
			</div>
		</CustomModal>
	);
}
