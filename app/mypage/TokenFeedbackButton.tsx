"use client";

import { useRouter } from "next/navigation";
import { Coins } from "lucide-react";
import React, { useState } from "react";
import { authAPI } from "../lib/api";
import CustomModal from "../components/CustomModal";

export default function TokenFeedbackButton() {
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(false);
	const [showTokenModal, setShowTokenModal] = useState(false);

	const handleClick = async () => {
		if (isChecking) return;

		setIsChecking(true);
		try {
			// /me API로 현재 유저 정보 조회
			const response = await authAPI.me();

			if (response.success && response.data) {
				const remainingToken = (response.data as any).remainingToken || 0;

				if (remainingToken >= 1) {
					// 토큰이 1개 이상이면 피드백 요청 페이지로 이동
					router.push("/requestfeedback");
				} else {
					// 토큰이 부족하면 모달 표시
					setShowTokenModal(true);
				}
			} else {
				console.error("사용자 정보 조회 실패:", response.message);
				alert("사용자 정보를 불러오는데 실패했습니다.");
			}
		} catch (error) {
			console.error("사용자 정보 조회 중 오류:", error);
			alert("오류가 발생했습니다. 다시 시도해주세요.");
		} finally {
			setIsChecking(false);
		}
	};

	return (
		<>
			<button
				onClick={handleClick}
				disabled={isChecking}
				className="
        fixed bottom-28 right-6
        md:bottom-32 md:right-8
        bg-gradient-to-r from-[#D2C693] to-[#928346]
        text-white rounded-full shadow-lg
        flex items-center justify-center
        w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20
		cursor-pointer
		disabled:opacity-50 disabled:cursor-not-allowed
      "
			>
				{isChecking ? (
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
				) : (
					<Coins size="60%" strokeWidth={2.5} />
				)}
			</button>

			{/* 토큰 부족 모달 */}
			<CustomModal
				variant={1}
				isOpen={showTokenModal}
				onClose={() => setShowTokenModal(false)}
				width="max-w-md"
			>
				<div className="text-center p-4">
					<div className="mb-4 flex justify-center">
						<Coins size={48} className="text-[#D2C693]" />
					</div>
					<p className="text-lg font-semibold text-gray-900 mb-2">
						토큰이 부족합니다
					</p>
					<p className="text-sm text-gray-600 mb-6">
						매매일지에 대한 피드백을 요청하는데 필요한 토큰이 부족합니다.
					</p>
					<button
						onClick={() => setShowTokenModal(false)}
						className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-colors"
					>
						확인
					</button>
				</div>
			</CustomModal>
		</>
	);
}
