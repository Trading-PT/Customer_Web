"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import { feedbackAPI } from "../lib/api/feedbackAPI";
import { FeedbackCardDTO } from "../lib/api/apiTypes";
import { useAuthStore } from "../stores/authStore";

export default function AllFeedback() {
	const [crownFeedbacks, setCrownFeedbacks] = useState<FeedbackCardDTO[]>([]);
	const [otherFeedbacks, setOtherFeedbacks] = useState<FeedbackCardDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const router = useRouter();
	const { user } = useAuthStore();

	const handleNavigate = (fb: FeedbackCardDTO) => {
		// feedbackRequestId를 사용하여 상세 페이지로 이동
		router.push(`/timefeedback?id=${fb.feedbackRequestId}`);
	};

	const loadFeedbacks = async (page: number = 0) => {
		try {
			setLoading(true);
			const response = await feedbackAPI.getFeedbackRequests(page, 12);

			if (response.success && response.data) {
				const feedbacks = response.data.feedbacks;
				const crowns = feedbacks.filter((f) => f.isBestFeedback);
				const others = feedbacks.filter((f) => !f.isBestFeedback);

				if (page === 0) {
					// 첫 페이지는 덮어쓰기
					setCrownFeedbacks(crowns);
					setOtherFeedbacks(others);
				} else {
					// 다음 페이지는 추가
					setCrownFeedbacks((prev) => [...prev, ...crowns]);
					setOtherFeedbacks((prev) => [...prev, ...others]);
				}

				setHasMore(response.data.sliceInfo.hasNext);
				setCurrentPage(page);
			} else {
				setError(response.message || "피드백 목록을 불러오는데 실패했습니다.");
			}
		} catch (err) {
			console.error("피드백 목록 조회 오류:", err);
			setError("네트워크 오류가 발생했습니다.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadFeedbacks(0);
	}, []);

	// 날짜 포맷팅 함수
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${year}.${month}.${day}.${hours}:${minutes}`;
	};

	if (error) {
		return (
			<div className="max-w-6xl mx-auto p-6 pt-20">
				<div className="text-center text-red-500">{error}</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto p-6 pt-20">
			<h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl mb-20 text-center">
				TPT의 실시간 트레이딩 피드백을 둘러보세요.
			</h1>

			{loading && currentPage === 0 ? (
				<div className="text-center py-10">로딩 중...</div>
			) : (
				<>
					{/* 상단 베스트 피드백 */}
					{crownFeedbacks.length > 0 && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
							{crownFeedbacks.map((fb) => (
								<button
									key={fb.feedbackRequestId}
									onClick={() => handleNavigate(fb)}
									className="cursor-pointer relative bg-gray-100 rounded-lg p-4 flex flex-col justify-between text-left hover:shadow-md transition-shadow"
								>
									{/* Crown 아이콘 */}
									<div className="absolute -top-3 left-4 z-10">
										<Crown size={24} className="text-yellow-500 drop-shadow-md" />
									</div>

									{/* 카드 본문 */}
									<div className="mt-4">
										<span className="font-semibold block mb-2">{fb.title}</span>
										<p className="text-sm text-gray-700 mb-4 line-clamp-2">{fb.contentPreview}</p>
										<p className="text-xs text-gray-500 text-right">{formatDate(fb.createdAt)}</p>
									</div>
								</button>
							))}
						</div>
					)}

					{/* 일반 피드백 - BASIC 사용자는 blur 처리 */}
					<div className="relative">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{otherFeedbacks.map((fb) => (
								<button
									key={fb.feedbackRequestId}
									onClick={() => handleNavigate(fb)}
									className="cursor-pointer bg-gray-100 rounded-lg p-4 flex flex-col justify-between text-left hover:shadow-md transition-shadow"
								>
									<span className="font-semibold mb-2">{fb.title}</span>
									<p className="text-sm text-gray-700 mb-4 line-clamp-2">{fb.contentPreview}</p>
									<p className="text-xs text-gray-500 text-right">{formatDate(fb.createdAt)}</p>
								</button>
							))}
						</div>

						{/* BASIC 사용자용 블러 오버레이 */}
						{user && !user.isPremium && otherFeedbacks.length > 0 && (
							<div className="absolute inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center rounded-lg">
								<p className="text-center text-lg font-semibold text-gray-800 px-6">
									TPT를 구독하시고 모든 피드백을 확인하세요.
								</p>
							</div>
						)}
					</div>

					{/* 더보기 버튼 */}
					{hasMore && (
						<div className="text-center mt-8">
							<button
								onClick={() => loadFeedbacks(currentPage + 1)}
								disabled={loading}
								className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								{loading ? "로딩 중..." : "더보기"}
							</button>
						</div>
					)}

					{/* 피드백 없음 */}
					{!loading && crownFeedbacks.length === 0 && otherFeedbacks.length === 0 && (
						<div className="text-center py-10 text-gray-500">
							등록된 피드백이 없습니다.
						</div>
					)}
				</>
			)}
		</div>
	);
}
