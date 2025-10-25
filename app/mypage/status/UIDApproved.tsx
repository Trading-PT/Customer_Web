import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SubscribeModal from "../subscribeModal";
import { consultationAPI } from "../../lib/api";
import type { ConsultationResponse } from "../../lib/api/apiTypes";

export default function UIDApproved() {
	const router = useRouter();
	const [isSubModalOpen, setIsSubModalOpen] = useState(false);
	const [consultations, setConsultations] = useState<ConsultationResponse[]>([]);
	const [isLoadingConsultations, setIsLoadingConsultations] = useState(true);

	// 상담 내역 조회
	useEffect(() => {
		const fetchConsultations = async () => {
			try {
				const response = await consultationAPI.getMyConsultations();
				if (response.success && response.data) {
					setConsultations(response.data);
				} else {
					console.error("상담 내역 조회 실패:", response.message);
				}
			} catch (error) {
				console.error("상담 내역 조회 중 오류:", error);
			} finally {
				setIsLoadingConsultations(false);
			}
		};

		fetchConsultations();
	}, []);

	// 상담 취소
	const handleCancelConsultation = async (consultationId: number) => {
		if (!confirm("상담 예약을 취소하시겠습니까?")) return;

		try {
			const response = await consultationAPI.deleteConsultation(consultationId);
			if (response.success) {
				alert("상담 예약이 취소되었습니다.");
				// 목록에서 제거
				setConsultations(consultations.filter((c) => c.id !== consultationId));
			} else {
				alert(`상담 취소에 실패했습니다: ${response.message}`);
			}
		} catch (error) {
			console.error("상담 취소 중 오류:", error);
			alert("상담 취소 중 오류가 발생했습니다.");
		}
	};

	// 날짜 포맷팅 함수
	const formatConsultationDateTime = (date: string, time: string) => {
		const dateObj = new Date(date);
		const year = dateObj.getFullYear();
		const month = dateObj.getMonth() + 1;
		const day = dateObj.getDate();

		// 시간 포맷팅 (HH:MM:SS -> HH:MM)
		const timeStr = time.substring(0, 5);

		return `${year}년 ${month}월 ${day}일 ${timeStr}`;
	};

	return (
		<div>
			<h1 className="text-3xl font-serif text-[#B9AB70] mb-6">Invitation Card</h1>

			<button className="w-full bg-gradient-to-r from-[#D2C693] to-[#928346] text-white rounded-md p-6 mb-6 cursor-pointer"
				onClick={() => setIsSubModalOpen(true)}
			>
				<h2 className="text-xl font-semibold mb-2">정기 결제 구독하기</h2>
				<p className="text-sm text-white/90 mb-4">
					TPT가 엄선한 트레이딩 전문가에게
					<br />
					나의 트레이딩을 피드백 받아 보세요.
					<br />
					트레이딩 성과를 체계적으로 개선할 수 있습니다.
				</p>
				<p className="text-2xl font-bold">260,000원/월 갱신</p>
			</button>

			<SubscribeModal
				isOpen={isSubModalOpen}
				onClose={() => setIsSubModalOpen(false)}
			/>


			<button
				onClick={() => router.push("/reservation")}
				className="w-full py-3 bg-[#F5F5F5] text-[#0f172a] rounded-md cursor-pointer"
			>
				고민된다면, 무료 전화 상담 신청하기
			</button>


			<div className="text-left mt-10">
				<h3 className="mb-3">상담 신청 내역</h3>
				{isLoadingConsultations ? (
					<div className="bg-[#F5F5F5] text-[#0f172a] rounded-md p-4 text-center text-sm">
						상담 내역을 불러오는 중...
					</div>
				) : consultations.length === 0 ? (
					<div className="bg-[#F5F5F5] text-[#0f172a] rounded-md p-4 text-center text-sm">
						예약된 상담이 없습니다.
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{consultations.map((consultation) => (
							<div
								key={consultation.id}
								className="bg-[#F5F5F5] text-[#0f172a] rounded-md p-4 flex justify-between items-center text-sm"
							>
								<span>
									{formatConsultationDateTime(consultation.date, consultation.time)} 전화 상담 예약
								</span>
								<div className="flex gap-2">
									<button
										onClick={() => handleCancelConsultation(consultation.id)}
										className="px-3 py-1 rounded-md border text-red-500 border-red-300 cursor-pointer hover:bg-red-50"
									>
										취소
									</button>
									<button
										onClick={() => router.push(`/reservation?consultationId=${consultation.id}`)}
										className="px-3 py-1 rounded-md border text-blue-500 border-blue-300 cursor-pointer hover:bg-blue-50"
									>
										변경
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}