"use client";
import { useState, useEffect } from "react";
import CustomModal from "../components/CustomModal";
import { investmentTypeChangeAPI } from "../lib/api";
import type { InvestmentType, ChangeRequestResponse } from "../lib/api/apiTypes";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	currentType: string;
}

const INVESTMENT_TYPE_LABELS: Record<InvestmentType, string> = {
	SWING: "스윙 트레이딩",
	DAY: "데이 트레이딩",
	SCALPING: "스켈핑 트레이딩",
};

export default function InvestmentTypeChangeModal({ isOpen, onClose, currentType }: Props) {
	const [selectedType, setSelectedType] = useState<InvestmentType | null>(null);
	const [reason, setReason] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [pendingRequest, setPendingRequest] = useState<ChangeRequestResponse | null>(null);
	const [isLoadingRequests, setIsLoadingRequests] = useState(true);

	// 대기 중인 신청 조회
	useEffect(() => {
		if (!isOpen) return;

		const fetchPendingRequest = async () => {
			setIsLoadingRequests(true);
			try {
				const response = await investmentTypeChangeAPI.getMyChangeRequests();
				if (response.success && response.data) {
					// 대기 중인 신청만 필터링
					const pending = response.data.find((req) => req.status === "PENDING");
					setPendingRequest(pending || null);
				}
			} catch (error) {
				console.error("신청 내역 조회 중 오류:", error);
			} finally {
				setIsLoadingRequests(false);
			}
		};

		fetchPendingRequest();
	}, [isOpen]);

	// 변경 신청 제출
	const handleSubmit = async () => {
		if (!selectedType) {
			alert("변경할 투자 유형을 선택해주세요.");
			return;
		}

		if (selectedType === currentType) {
			alert("현재 투자 유형과 동일합니다. 다른 유형을 선택해주세요.");
			return;
		}

		if (!confirm("신청 이후 다음달 1일에 변경 요청이 승인됩니다.\n정말 신청하시겠습니까?")) {
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await investmentTypeChangeAPI.createChangeRequest({
				requestedType: selectedType,
				reason: reason || undefined,
			});

			if (response.success) {
				alert("투자 유형 변경 신청이 완료되었습니다.\n다음달 1일에 변경 요청이 승인됩니다.");
				setPendingRequest(response.data || null);
				setSelectedType(null);
				setReason("");
			} else {
				alert(`신청 실패: ${response.message}`);
			}
		} catch (error) {
			console.error("신청 중 오류:", error);
			alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// 신청 취소
	const handleCancelRequest = async () => {
		if (!pendingRequest) return;

		if (!confirm("변경 신청을 취소하시겠습니까?")) {
			return;
		}

		try {
			const response = await investmentTypeChangeAPI.cancelChangeRequest(pendingRequest.id);
			if (response.success) {
				alert("신청이 취소되었습니다.");
				setPendingRequest(null);
			} else {
				alert(`취소 실패: ${response.message}`);
			}
		} catch (error) {
			console.error("취소 중 오류:", error);
			alert("취소 중 오류가 발생했습니다.");
		}
	};

	// 날짜 포맷팅
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
	};

	return (
		<CustomModal variant={1} isOpen={isOpen} onClose={onClose} width="max-w-xl">
			<div className="space-y-6">
				<h2 className="text-xl font-semibold text-gray-900">투자 유형 변경 신청</h2>

				{/* 현재 투자 유형 */}
				<div className="bg-gray-50 p-4 rounded-md">
					<p className="text-sm text-gray-600 mb-1">현재 투자 유형</p>
					<p className="text-lg font-semibold text-gray-900">{currentType}</p>
				</div>

				{isLoadingRequests ? (
					<div className="text-center py-8 text-gray-500">신청 내역을 불러오는 중...</div>
				) : pendingRequest ? (
					// 대기 중인 신청이 있는 경우
					<div className="border border-yellow-400 bg-yellow-50 p-4 rounded-md">
						<h3 className="text-sm font-semibold text-yellow-800 mb-3">신청 대기 중</h3>
						<div className="space-y-2 text-sm text-gray-700">
							<p>
								변경 요청: <span className="font-semibold">{INVESTMENT_TYPE_LABELS[pendingRequest.requestedType]}</span>
							</p>
							<p>신청일: {formatDate(pendingRequest.requestedDate)}</p>
							<p>변경 예정일: {formatDate(pendingRequest.targetChangeDate)}</p>
							{pendingRequest.reason && (
								<p className="mt-2">
									<span className="text-gray-600">사유:</span> {pendingRequest.reason}
								</p>
							)}
						</div>
						<button
							onClick={handleCancelRequest}
							className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
						>
							신청 취소
						</button>
						<p className="mt-3 text-xs text-yellow-700">
							※ 대기 중인 신청이 있으면 추가 신청이 불가능합니다.
						</p>
					</div>
				) : (
					// 신청 폼
					<div className="space-y-4">
						{/* 안내 메시지 */}
						<div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
							<p className="text-sm text-blue-800">
								<strong>안내:</strong> 신청 이후 다음달 1일에 변경 요청이 승인됩니다.
							</p>
						</div>

						{/* 투자 유형 선택 */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								변경할 투자 유형 선택 <span className="text-red-500">*</span>
							</label>
							<div className="space-y-2">
								{(["SWING", "DAY", "SCALPING"] as InvestmentType[]).map((type) => (
									<button
										key={type}
										onClick={() => setSelectedType(type)}
										disabled={type === currentType}
										className={`w-full p-3 rounded-md border text-left transition-all ${
											type === currentType
												? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
												: selectedType === type
													? "bg-indigo-50 border-indigo-400 text-indigo-700 font-medium"
													: "border-gray-300 hover:border-indigo-300 hover:bg-gray-50"
										}`}
									>
										{INVESTMENT_TYPE_LABELS[type]}
										{type === currentType && <span className="ml-2 text-xs">(현재 유형)</span>}
									</button>
								))}
							</div>
						</div>

						{/* 변경 사유 (선택사항) */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								변경 사유 (선택사항)
							</label>
							<textarea
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								placeholder="변경 사유를 입력해주세요."
								rows={3}
								className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
							/>
						</div>

						{/* 제출 버튼 */}
						<button
							onClick={handleSubmit}
							disabled={!selectedType || isSubmitting}
							className={`w-full py-3 rounded-md font-semibold transition-all ${
								!selectedType || isSubmitting
									? "bg-gray-200 text-gray-500 cursor-not-allowed"
									: "bg-indigo-600 text-white hover:bg-indigo-700"
							}`}
						>
							{isSubmitting ? "신청 중..." : "변경 신청하기"}
						</button>
					</div>
				)}
			</div>
		</CustomModal>
	);
}
