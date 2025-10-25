"use client";
import { useRouter } from "next/navigation";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";

interface SubscribeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirmPayment: () => void;
}

export default function SubscribeModal({
	isOpen,
	onClose,
	onConfirmPayment,
}: SubscribeModalProps) {
	const router = useRouter();

	return (
		<CustomModal
			variant={1}
			isOpen={isOpen}
			onClose={onClose}
			// 모바일은 꽉 차게, 데스크탑은 3xl 크기로
			width="w-full max-w-sm sm:max-w-3xl"
		>
			<div className="w-full bg-white p-4 sm:p-10 text-gray-800 flex flex-col gap-6">
				{/* 제목 */}
				<h2 className="text-xl sm:text-2xl text-center text-[#0f172a] font-semibold">
					전문가의 힘을 빌려 성장하세요.
				</h2>

				{/* 혜택 설명 */}
				<ul className="w-full bg-gradient-to-r from-[#D2C693] to-[#928346] text-white p-4 sm:p-6 text-sm sm:text-base leading-relaxed rounded-md">
					<li className="mb-2">
						<strong>나를 위한 전문 트레이딩 트레이너 배정</strong>
					</li>
					<li className="mb-2">
						트레이너에게 <strong>24시간 무제한 피드백 요청</strong> 가능
					</li>
					<li className="mb-2">모든 피드백 24시간 이내 답변</li>
					<li className="mb-2">
						<strong>다른 고객의 피드백도</strong> 실시간으로 열람 가능
					</li>
					<li className="mb-2">주차별 트레이딩 강의 및 과제 공개</li>
					<li className="mb-2">
						과제 미수행 시 <strong>삼진아웃 제도</strong>
					</li>
					<li>내가 받은 모든 피드백을 확인하여 복습 가능</li>
				</ul>

				{/* 가격 */}
				<div className="text-right text-base sm:text-xl text-[#0f172a]">
					260,000원/월 갱신
				</div>

				{/* 버튼 */}
				<div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
					<CustomButton
						variant="simpleBlack"
						width="w-full sm:w-md"
						onClick={() => router.push("/mypage/payment")}
					>
						전화상담 신청하기
					</CustomButton>
					{/* 부모에서 전달받은 결제 실행 */}
					<CustomButton
						variant="prettyFull"
						width="w-full sm:w-md"
						onClick={onConfirmPayment}
					>
						TPT 정기 결제 구독하기
					</CustomButton>
				</div>
			</div>
		</CustomModal>
	);
}
