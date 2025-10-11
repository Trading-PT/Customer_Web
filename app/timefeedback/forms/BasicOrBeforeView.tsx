"use client";

import React from "react";
import { FeedbackResponseDTO } from "@/app/lib/api/apiTypes";

interface BasicOrBeforeViewProps {
	response: FeedbackResponseDTO;
}

export default function BasicOrBeforeView({ response }: BasicOrBeforeViewProps) {
	// 날짜 포맷팅
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString('ko-KR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<div className="flex flex-col gap-5 text-left p-5 mt-8 border-t-2 border-blue-200">
			{/* 피드백 답변 헤더 */}
			<div className="flex items-center gap-3 mb-6">
				<span className="px-3 py-1 text-white rounded bg-blue-500">트레이너 피드백</span>
			</div>

			{/* 피드백 제목 */}
			<div>
				<label className="block mb-1 font-medium text-lg">피드백 제목</label>
				<div className="p-3 bg-blue-50 rounded font-semibold">{response.title}</div>
			</div>

			{/* 트레이너 정보 */}
			<div>
				<label className="block mb-1 font-medium">담당 트레이너</label>
				<div className="p-3 bg-gray-50 rounded flex items-center gap-3">
					{response.trainer.profileImageUrl && (
						<img
							src={response.trainer.profileImageUrl}
							alt={response.trainer.name}
							className="w-10 h-10 rounded-full object-cover"
						/>
					)}
					<span className="font-medium">{response.trainer.name}</span>
				</div>
			</div>

			{/* 피드백 제공 시각 */}
			<div>
				<label className="block mb-1 font-medium">피드백 제공 시각</label>
				<div className="p-2 bg-gray-100 rounded text-sm">{formatDate(response.submittedAt)}</div>
			</div>

			{/* 피드백 내용 */}
			<div>
				<label className="block mb-1 font-medium text-lg">피드백 내용</label>
				<div className="p-4 bg-blue-50 rounded whitespace-pre-wrap min-h-[200px]">
					{response.content}
				</div>
			</div>
		</div>
	);
}
