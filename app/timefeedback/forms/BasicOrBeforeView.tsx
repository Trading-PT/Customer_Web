"use client";

import React from "react";
import {
	DayFeedbackRequestDetailResponseDTO,
	ScalpingFeedbackRequestDetailResponseDTO,
	SwingFeedbackRequestDetailResponseDTO,
	InvestmentType
} from "@/app/lib/api/apiTypes";

interface BasicOrBeforeViewProps {
	detail: DayFeedbackRequestDetailResponseDTO | ScalpingFeedbackRequestDetailResponseDTO | SwingFeedbackRequestDetailResponseDTO;
	investmentType: InvestmentType;
}

export default function BasicOrBeforeView({ detail, investmentType }: BasicOrBeforeViewProps) {
	// 완강 여부에 따른 라벨
	const getCourseStatusLabel = (status: string) => {
		switch (status) {
			case "AFTER_COMPLETION": return "완강";
			case "PENDING_COMPLETION": return "완강 대기";
			case "BEFORE_COMPLETION": return "미완강";
			default: return status;
		}
	};

	// 멤버십 등급 라벨
	const getMembershipLabel = (level: string) => {
		return level === "BASIC" ? "무료" : "Pro";
	};

	// 투자 타입 라벨
	const getInvestmentTypeLabel = (type: InvestmentType) => {
		switch (type) {
			case "DAY": return "데이";
			case "SWING": return "스윙";
			case "SCALPING": return "스켈핑";
			default: return type;
		}
	};

	// 투자 타입별 배경 색상
	const getInvestmentTypeBgColor = (type: InvestmentType) => {
		switch (type) {
			case "DAY": return "bg-[#2AC287]";
			case "SWING": return "bg-orange-400";
			case "SCALPING": return "bg-sky-400";
			default: return "bg-gray-400";
		}
	};

	// P&L 계산 및 게이지 설정
	const gaugeMin = -3;
	const gaugeMax = 3;
	const pnl = detail.pnl || 0;
	const riskTaking = detail.riskTaking || 1;
	const normalized = Math.min(Math.max(pnl / riskTaking, gaugeMin), gaugeMax);

	let arrowColor = "text-gray-500";
	if (normalized <= -2) arrowColor = "text-red-500";
	else if (normalized >= 2) arrowColor = "text-green-600";

	return (
		<div className="flex flex-col gap-5 text-left p-5 w-full max-w-lg">
			{/* 상단 헤더 */}
			<div className="flex items-center gap-3 mb-6">
				<span className={`px-3 py-1 text-white rounded ${getInvestmentTypeBgColor(investmentType)}`}>
					{getInvestmentTypeLabel(investmentType)}
				</span>
				<span className="px-3 py-1 border rounded">{getCourseStatusLabel(detail.courseStatus)}</span>
				<span className="px-3 py-1 border rounded">{getMembershipLabel(detail.membershipLevel)}</span>
			</div>

			{/* 기록 날짜 */}
			<div>
				<label className="block mb-1 font-medium">기록 날짜</label>
				<div className="p-2 bg-gray-100 rounded">{detail.feedbackRequestDate || "-"}</div>
			</div>

			{/* 종목 */}
			<div>
				<label className="block mb-1 font-medium">종목</label>
				<div className="p-2 bg-gray-100 rounded">{detail.category || "-"}</div>
			</div>

			{/* 포지션 홀딩 시간 */}
			<div>
				<label className="block mb-1 font-medium">포지션 홀딩 시간</label>
				<div className="p-2 bg-gray-100 rounded">{detail.positionHoldingTime || "-"}</div>
			</div>

			{/* 스크린샷 */}
			<div>
				<label className="block mb-1 font-medium">스크린샷</label>
				{detail.screenshotImageUrls && detail.screenshotImageUrls.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{detail.screenshotImageUrls.map((url, idx) => (
							<div key={idx} className="w-full h-40 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
								<img src={url} alt={`screenshot-${idx}`} className="object-contain w-full h-full" />
							</div>
						))}
					</div>
				) : (
					<div className="w-full h-40 rounded bg-gray-100 flex items-center justify-center text-gray-400">
						스크린샷 없음
					</div>
				)}
			</div>

			{/* 레버리지 */}
			<div>
				<label className="block mb-1 font-medium">레버리지 (배점)</label>
				<div className="p-2 bg-gray-100 rounded">{detail.leverage}x</div>
			</div>

			{/* 포지션 */}
			<div>
				<label className="block mb-1 font-medium">포지션</label>
				<div className="p-2 bg-gray-100 rounded">{detail.position || "-"}</div>
			</div>

			{/* ScalpingDetail인 경우 추가 필드 표시 */}
			{'operatingFundsRatio' in detail && (
				<>
					{/* 비중 */}
					<div>
						<label className="block mb-1 font-medium">비중 (운용 자금 대비)</label>
						<div className="p-2 bg-gray-100 rounded">{detail.operatingFundsRatio}%</div>
					</div>

					{/* Entry / Exit */}
					<div className="flex gap-4">
						<div className="flex-1">
							<label className="block mb-1 font-medium">Entry Price</label>
							<div className="p-2 bg-gray-100 rounded">{detail.entryPrice || "-"}</div>
						</div>
						<div className="flex-1">
							<label className="block mb-1 font-medium">Exit Price</label>
							<div className="p-2 bg-gray-100 rounded">{detail.exitPrice || "-"}</div>
						</div>
					</div>

					{/* 손절 / 익절 */}
					<div className="flex gap-4">
						<div className="flex-1">
							<label className="block mb-1 font-medium">설정 손절가</label>
							<div className="p-2 bg-gray-100 rounded">{detail.settingStopLoss || "-"}</div>
						</div>
						<div className="flex-1">
							<label className="block mb-1 font-medium">설정 익절가</label>
							<div className="p-2 bg-gray-100 rounded">{detail.settingTakeProfit || "-"}</div>
						</div>
					</div>
				</>
			)}

			{/* 리스크 테이킹 */}
			<div>
				<label className="block mb-1 font-medium">Risk Taking (%)</label>
				<div className="p-2 bg-gray-100 rounded">{detail.riskTaking}%</div>
			</div>

			{/* P&L / R&R */}
			<div className="flex flex-col gap-6">
				<div className="flex items-center gap-3">
					<span className="font-semibold">P&L:</span>
					<span>{pnl}%</span>
				</div>

				<div className="flex items-center gap-3">
					<span className="font-semibold">R&R:</span>
					<span>{detail.rnr}</span>
				</div>

				{/* 손익 결과 게이지바 */}
				<div className="relative w-full h-20 mt-4">
					<div className="absolute top-1/2 w-full border-t border-gray-300" />
					<div className="flex justify-between text-xs text-gray-500 mt-6">
						{Array.from({ length: 7 }, (_, i) => (
							<span key={i}>{-3 + i}</span>
						))}
					</div>
					<div
						className={`absolute top-2 ${arrowColor}`}
						style={{
							left: `${((normalized - gaugeMin) / (gaugeMax - gaugeMin)) * 100}%`,
							transform: "translateX(-50%)",
						}}
					>
						▼
					</div>
					<span className="absolute left-0 top-0 text-red-500 font-semibold">Fail</span>
					<span className="absolute right-0 top-0 text-green-600 font-semibold">Success</span>
				</div>
			</div>

			{/* 포지션 진입 근거 */}
			<div>
				<label className="block mb-1 font-medium">포지션 진입 근거</label>
				<div className="p-2 bg-gray-100 rounded whitespace-pre-wrap">{detail.positionStartReason || "-"}</div>
			</div>

			{/* 포지션 탈출 근거 */}
			<div>
				<label className="block mb-1 font-medium">포지션 탈출 근거</label>
				<div className="p-2 bg-gray-100 rounded whitespace-pre-wrap">{detail.positionEndReason || "-"}</div>
			</div>

			{/* 최종 복기 */}
			<div>
				<label className="block mb-1 font-medium">최종 복기</label>
				<div className="p-2 bg-gray-100 rounded whitespace-pre-wrap">{detail.tradingReview || "-"}</div>
			</div>
		</div>
	);
}
