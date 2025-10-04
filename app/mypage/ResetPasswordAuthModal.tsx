"use client";

import React, { useState } from "react";
import CustomModal from "../components/CustomModal";
import CustomInputField from "../components/CustomInputField";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../hooks/useAuth";

interface ResetPasswordAuthModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function ResetPasswordAuthModal({ isOpen, onClose }: ResetPasswordAuthModalProps) {
	// 입력 상태
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	// UI 상태
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	// useAuth에서 불러오기
	const { resetPasswordAuthenticated } = useAuth();

	// 비밀번호 재설정 요청
	const handleResetPassword = async () => {
		if (!currentPassword || !newPassword) {
			setErrorMsg("모든 항목을 입력해주세요.");
			return;
		}

		setErrorMsg(null);
		setSuccessMsg(null);
		setLoading(true);

		const res = await resetPasswordAuthenticated(currentPassword, newPassword);
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

				{/* 새 비밀번호 재입력 */}
				<CustomInputField
					placeholder="현재 비밀번호 입력"
					value={currentPassword}
					onChange={setCurrentPassword}
					variant={2}
					type="password"
					autoComplete="new-password"
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
