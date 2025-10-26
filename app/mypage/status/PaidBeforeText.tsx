// components/mypage/status/PaidBeforeTest.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomModal from "../../components/CustomModal";
import CustomButton from "@/app/components/CustomButton";

export default function PaidBeforeTest() {
	const router = useRouter();
	const [showModal, setShowModal] = useState(false);

	const handleStartLevelTest = () => {
		setShowModal(true);
	};

	const handleConfirm = () => {
		setShowModal(false);
		router.push("/leveltest");
	};

	return (
		<div>
			<div className="flex w-full justify-between">
				<h1 className="text-2xl text-start mb-2 text-[#B9AB70]">TPT를 구독해주신 고객님 환영합니다.</h1>
				<div className="flex w-auto gap-2">
					<button className="border border-[#B9AB70] text-[#B9AB70] text-sm bg-white rounded-xl px-2 py-1">구독 해지</button>
					<button className="text-white text-sm bg-[#B9AB70] rounded-xl px-2 py-1">후기 작성</button>
				</div>
			</div>
			<div className="text-sm text-start mb-4 text-[#B9AB70]">
				TPT의 트레이딩 전문가와 함께 경험을 축적하세요.
			</div>

			<div className="flex bg-[#0F182B] rounded-xl p-4 gap-4 items-center justify-between text-sm text-white font-bold">
				고객님에게 딱 맞는 트레이너 배정을 위해, 먼저 레벨테스트를 응시해주세요.

				<button
					onClick={handleStartLevelTest}
					className="bg-[#EF5555] rounded-lg p-2 items-center justify-center text-white font-bold cursor-pointer hover:bg-[#DC4444] transition-colors"
				>
					레벨테스트 시작
				</button>
			</div>

			<CustomModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				variant={1}
				width="max-w-md"
			>
				<div className="pt-6">
					<h2 className="text-xl font-bold text-gray-900 mb-4">레벨테스트를 시작하시겠습니까?</h2>
					<div className="text-gray-700 space-y-2 mb-6">
						<p>• 시작 전 네트워크 환경을 점검해주세요.</p>
						<p>• 제한 시간은 60분입니다.</p>
						<p>• 시간 초과 시 자동으로 제출됩니다.</p>
						<p>• 제출하지 않고 뒤로가기를 누르실 경우 답안은 초기화됩니다.</p>
					</div>
					<div className="flex justify-center">
						<CustomButton
							onClick={handleConfirm}
							variant="prettyFull"
							className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
						>
							확인
						</CustomButton>
					</div>
				</div>
			</CustomModal>
		</div>
	);
}