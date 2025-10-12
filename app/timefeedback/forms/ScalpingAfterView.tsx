"use client";

import React from "react";
import { ScalpingFeedbackRequestDetailResponseDTO } from "@/app/lib/api/apiTypes";

interface ScalpingAfterViewProps {
	detail: ScalpingFeedbackRequestDetailResponseDTO;
}

export default function ScalpingAfterView({ detail }: ScalpingAfterViewProps) {
	// 완강 여부에 따른 라벨
	const getCourseStatusLabel = (status: string) => {
		switch (status) {
			case "AFTER_COMPLETION": return "완강";
			case "PENDING_COMPLETION": return "완강 대기";
			case "BEFORE_COMPLETION": return "미완강";
			default: return status;
		}
	};
	return (
		<div className="flex flex-col gap-5 text-left p-5 w-full max-w-lg">
			{/* 상단 */}
			<div className="flex items-center gap-3 mb-6">
				<span className="px-3 py-1 text-white rounded bg-sky-400">스켈핑</span>
				<span className="px-3 py-1 border rounded">{getCourseStatusLabel(detail.courseStatus)}</span>
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

			{/* 홀딩 시간 */}
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

			{/* 리스크 테이킹 */}
			<div>
				<label className="block mb-1 font-medium">리스크 테이킹 (%)</label>
				<div className="p-2 bg-gray-100 rounded">{detail.riskTaking}%</div>
			</div>

			{/* 레버리지 */}
			<div>
				<label className="block mb-1 font-medium">레버리지 (배)</label>
				<div className="p-2 bg-gray-100 rounded">{detail.leverage}x</div>
			</div>

			{/* 운용 자금 대비 비중 */}
			<div>
				<label className="block mb-1 font-medium">비중 (운용 자금 대비)</label>
				<div className="p-2 bg-gray-100 rounded">{detail.operatingFundsRatio}%</div>
			</div>

			{/* 진입가/탈출가 */}
			<div className="flex gap-4">
				<div className="flex-1">
					<label className="block mb-1 font-medium">진입가</label>
					<div className="p-2 bg-gray-100 rounded">{detail.entryPrice || "-"}</div>
				</div>
				<div className="flex-1">
					<label className="block mb-1 font-medium">탈출가</label>
					<div className="p-2 bg-gray-100 rounded">{detail.exitPrice || "-"}</div>
				</div>
			</div>

			{/* 설정 손절가/익절가 */}
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

			{/* 포지션 진입/탈출 근거 */}
			<div>
				<label className="block mb-1 font-medium">포지션 진입 근거</label>
				<div className="p-2 bg-gray-100 rounded whitespace-pre-wrap">{detail.positionStartReason || "-"}</div>
			</div>
			<div>
				<label className="block mb-1 font-medium">포지션 탈출 근거</label>
				<div className="p-2 bg-gray-100 rounded whitespace-pre-wrap">{detail.positionEndReason || "-"}</div>
			</div>

			{/* 포지션 */}
			<div>
				<label className="block mb-1 font-medium">포지션</label>
				<div className="p-2 bg-gray-100 rounded">{detail.position || "-"}</div>
			</div>

			{/* P&L */}
			<div>
				<label className="block mb-1 font-medium">P&L</label>
				<div className="p-2 bg-gray-100 rounded">{detail.pnl}%</div>
			</div>

			{/* R&R */}
			<div>
				<label className="block mb-1 font-medium">R&R (손익비)</label>
				<div className="p-2 bg-gray-100 rounded">{detail.rnr}</div>
			</div>

			{/* 매매 복기 */}
			<div>
				<label className="block mb-1 font-medium">매매 복기</label>
				<div className="p-2 bg-gray-100 rounded whitespace-pre-wrap">{detail.tradingReview || "-"}</div>
			</div>
		</div>
	);
}
