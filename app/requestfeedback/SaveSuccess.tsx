"use client";

import { useRouter } from "next/navigation";
import CustomModal from "../components/CustomModal";
import CustomButton from "../components/CustomButton";

interface SaveSuccessProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function SaveSuccess({ isOpen, onClose }: SaveSuccessProps) {
	const router = useRouter();

	const handleConfirm = () => {
		onClose(); // 모달 닫기
		router.push("/mypage"); // 마이페이지로 이동
	};

	return (
		<CustomModal
			isOpen={isOpen}
			onClose={onClose}
			variant={0} // X 버튼으로 닫힘
			width="w-[90%] sm:w-[400px]"
			padding="p-6"
			borderRadius="rounded-xl"
			bgColor="bg-white"
			overlayColor="bg-black/40"
		>
			{/* 본문 내용 */}
			<div className="flex flex-col items-center justify-center text-center">
				<p className="text-lg text-gray-800 mb-6">
					매매일지 저장이 완료되었습니다.
				</p>

				<CustomButton
					variant="prettyFull"
					onClick={handleConfirm}
				>
					확인
				</CustomButton>
			</div>
		</CustomModal>
	);
}
