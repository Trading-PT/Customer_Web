"use client";

import React from "react";
import CustomDivider from "@/app/components/CustomDivider";
import { DayFeedbackRequestDetailResponseDTO } from "@/app/lib/api/apiTypes";

interface DayAfterViewProps {
	detail: DayFeedbackRequestDetailResponseDTO;
}

export default function DayAfterView({ detail }: DayAfterViewProps) {
	const gaugeMin = -3;
	const gaugeMax = 3;
	const normalized = Math.min(Math.max(detail.pnl / detail.riskTaking, gaugeMin), gaugeMax);

	let arrowColor = "text-gray-500";
	if (normalized <= -2) arrowColor = "text-red-500";
	else if (normalized >= 2) arrowColor = "text-green-600";

	// 완강 여부에 따른 라벨
	const getCourseStatusLabel = (status: string) => {
		switch (status) {
			case "AFTER_COMPLETION": return "완강";
			case "PENDING_COMPLETION": return "완강 대기";
			case "BEFORE_COMPLETION": return "미완강";
			default: return status;
		}
	};

	// 등급 한글 변환
	const getGradeLabel = (grade: string | null) => {
		if (!grade) return "-";
		switch (grade) {
			case "S_PLUS": return "S+";
			case "S": return "S";
			case "A": return "A";
			case "B": return "B";
			case "NONE": return "없음";
			default: return grade;
		}
	};

	// 진입 타점 한글 변환
	const getEntryPointLabel = (entryPoint: string | null) => {
		if (!entryPoint) return "-";
		switch (entryPoint) {
			case "REVERSE": return "역추세";
			case "PULL_BACK": return "풀백";
			case "BREAK_OUT": return "돌파";
			default: return entryPoint;
		}
	};

	return (
		<div className="flex flex-col gap-5 text-left p-5 w-full max-w-lg">
			{/* 상단 */}
			<div className="flex items-center gap-3 mb-6">
				<span className="px-3 py-1 text-white rounded bg-green-600">데이</span>
				<span className="px-3 py-1 border rounded">{getCourseStatusLabel(detail.courseStatus)}</span>
			</div>

			{/* 날짜 */}
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

			{/* 프레임 선택 */}
			<div className="flex gap-4">
				<div className="flex-1">
					<label className="block mb-1 font-medium">디렉션 프레임</label>
					<div className="p-2 bg-gray-100 rounded">{detail.directionFrame || "-"}</div>
				</div>
				<div className="flex-1">
					<label className="block mb-1 font-medium">메인 프레임</label>
					<div className="p-2 bg-gray-100 rounded">{detail.mainFrame || "-"}</div>
				</div>
				<div className="flex-1">
					<label className="block mb-1 font-medium">서브 프레임</label>
					<div className="p-2 bg-gray-100 rounded">{detail.subFrame || "-"}</div>
				</div>
			</div>

			<div className="flex gap-4">
				<div className="flex flex-col flex-1 gap-10">
					<p className="text-gray-300">[포지션 진입]</p>

					{/* 방향성 */}
					<div>
						<label className="block mb-1 font-medium">디렉션 프레임 방향성 유무</label>
						<div className="p-2 bg-gray-100 rounded">
							{detail.directionFrameExists !== null ? (detail.directionFrameExists ? "O" : "X") : "-"}
						</div>
					</div>

					{/* 추세 분석 */}
					<div>
						<label className="block mb-1 font-medium">추세 분석</label>
						<div className="p-2 bg-gray-100 rounded whitespace-pre-wrap">{detail.trendAnalysis || "-"}</div>
					</div>

					{/* 진입 타점 */}
					<div>
						<label className="block mb-1 font-medium">진입 타점</label>
						<div className="flex flex-col gap-2">
							<div className="p-2 bg-gray-100 rounded">
								1차: {getEntryPointLabel(detail.entryPoint1)} ({getGradeLabel(detail.grade)})
							</div>
							{detail.entryPoint2 && (
								<div className="p-2 bg-gray-100 rounded">
									2차: {detail.entryPoint2}
								</div>
							)}
						</div>
					</div>

					{/* 리스크 테이킹 / 레버리지 */}
					<div>
						<label className="block mb-1 font-medium">리스크 테이킹 (%)</label>
						<div className="p-2 bg-gray-100 rounded">{detail.riskTaking}%</div>
					</div>
					<div>
						<label className="block mb-1 font-medium">레버리지 (배점)</label>
						<div className="p-2 bg-gray-100 rounded">{detail.leverage}x</div>
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
				</div>

				<CustomDivider variant="vertical" height="h-150" />

				{/* 결과 */}
				<div className="flex flex-col flex-1 gap-10">
					<p className="text-gray-300">[결과]</p>

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
						<label className="block mb-1 font-medium">R&R</label>
						<div className="p-2 bg-gray-100 rounded">{detail.rnr}</div>
					</div>

					{/* 게이지 */}
					<div className="relative w-full h-20">
						<div className="absolute top-1/2 w-full border-t border-gray-300" />
						<div className="flex justify-between text-xs text-gray-500 mt-6">
							{Array.from({ length: gaugeMax - gaugeMin + 1 }, (_, i) => (
								<span key={i}>{gaugeMin + i}</span>
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
					</div>
				</div>
			</div>

			{/* 복기 */}
			<div>
				<label className="block mb-1 font-medium">매매 복기</label>
				<div className="p-2 bg-gray-100 rounded whitespace-pre-wrap">{detail.tradingReview || "-"}</div>
			</div>

			{/* 트레이너 피드백 */}
			<div>
				<label className="block mb-1 font-medium">담당 트레이너 피드백 요청 사항</label>
				<div className="p-2 bg-gray-100 rounded whitespace-pre-wrap">{detail.trainerFeedbackRequestContent || "-"}</div>
			</div>
		</div>
	);
}
