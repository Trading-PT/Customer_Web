"use client";
import React, { useEffect, useState } from "react";
import ReviewSummary from "./ReviewSummary";
import SubscribeModal from "../mypage/subscribeModal";
import { useNicepayPayment } from "../mypage/useNicePayments";

// 리뷰 타입
type Review = {
	id: number;
	user: string;
	rating: number;
	content: string;
	image?: string;
	date: string;
};

// 숫자 애니메이션 컴포넌트
const RollingNumber = ({ value }: { value: number }) => {
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		let start = 0;
		const end = value;
		const duration = 1500; // 1.5초
		const stepTime = 20; // 20ms마다 증가
		const increment = Math.ceil(end / (duration / stepTime));

		const timer = setInterval(() => {
			start += increment;
			if (start >= end) {
				start = end;
				clearInterval(timer);
			}
			setDisplayValue(start);
		}, stepTime);

		return () => clearInterval(timer);
	}, [value]);

	return (
		<span className="text-4xl font-serif sm:text-5xl md:text-6xl text-[#B9AB70] tracking-wide">
			{displayValue.toLocaleString()}
		</span>
	);
};

export default function ReviewPage() {
	const [isSubModalOpen, setIsSubModalOpen] = useState(false);
	const { openPayment } = useNicepayPayment();

	const mockReviews: Review[] = [
		{
			id: 1,
			user: "고객아이디1",
			rating: 5,
			content: "여기에 후기 내용이 들어가게 됩니다. 여기에 후기 내용이 들어가게 됩니다.",
			image: "https://via.placeholder.com/150",
			date: "2025.8.3.21:49",
		},
		{
			id: 2,
			user: "고객아이디2",
			rating: 5,
			content: "후기 작성 본문 예시 텍스트입니다.",
			image: "https://via.placeholder.com/150",
			date: "2025.8.3.21:49",
		},
		{
			id: 3,
			user: "고객아이디3",
			rating: 5,
			content: "여기도 후기 본문이 들어갑니다.",
			date: "2025.8.3.21:49",
		},
		{
			id: 4,
			user: "고객아이디4",
			rating: 5,
			content:
				"긴 후기 내용 예시입니다. 이 후기는 여러 줄로 작성되어서 영역이 어떻게 보이는지 확인할 수 있습니다.",
			image: "https://via.placeholder.com/150",
			date: "2025.8.3.21:49",
		},
		{
			id: 5,
			user: "고객아이디1",
			rating: 5,
			content: "여기에 후기 내용이 들어가게 됩니다. 여기에 후기 내용이 들어가게 됩니다.",
			image: "https://via.placeholder.com/150",
			date: "2025.8.3.21:49",
		},
		{
			id: 6,
			user: "고객아이디2",
			rating: 5,
			content: "후기 작성 본문 예시 텍스트입니다.",
			image: "https://via.placeholder.com/150",
			date: "2025.8.3.21:49",
		},
		{
			id: 7,
			user: "고객아이디3",
			rating: 5,
			content: "여기도 후기 본문이 들어갑니다.",
			date: "2025.8.3.21:49",
		},
		{
			id: 8,
			user: "고객아이디4",
			rating: 5,
			content:
				"긴 후기 내용 예시입니다. 이 후기는 여러 줄로 작성되어서 영역이 어떻게 보이는지 확인할 수 있습니다.",
			image: "https://via.placeholder.com/150",
			date: "2025.8.3.21:49",
		},
	];

	return (
		<div className="max-w-6xl mx-auto">
			<h1 className="text-xl sm:text-2xl md:text-3xl mt-20 mb-4 text-center">
				TPT 이용 고객의 실제 후기를 만나보세요.
			</h1>

			{/* 상단 고정 영역 */}
			<div className="sticky top-0 z-20 bg-white px-4 py-6 flex flex-col items-center gap-6 sm:gap-8 lg:gap-10">

				{/* 상단 콘텐츠 묶음 */}
				<div className="w-full flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
					{/* 왼쪽: 누적 리뷰 개수 */}
					<div className="flex flex-col items-center justify-center sm:items-start gap-2">
						<span className="text-[#B9AB70] font-medium text-sm sm:text-base">
							누적 리뷰 개수
						</span>
						<RollingNumber value={54321} />
					</div>

					{/* 오른쪽: 리뷰 요약 */}
					<div className="w-full sm:w-2/3 lg:w-1/2">
						<ReviewSummary />
					</div>
				</div>

				{/* CTA 버튼 */}
				<button className="w-full sm:w-auto bg-gradient-to-r from-[#D2C693] to-[#928346] text-white px-6 py-2 rounded-md font-medium cursor-pointer"
					onClick={() => setIsSubModalOpen(true)}
				>
					구독하고 트레이닝 받으러 가기
				</button>

				<SubscribeModal
					isOpen={isSubModalOpen}
					onClose={() => setIsSubModalOpen(false)}
					onConfirmPayment={() => {
						setIsSubModalOpen(false);
						openPayment(); // 결제창 열기
					}}
				/>
			</div>


			{/* 리뷰 리스트 */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 mt-6">
				{mockReviews.map((review) => (
					<div
						key={review.id}
						className="bg-white rounded-lg p-4 flex flex-col gap-3"
					>
						{/* 아이디 + 별점 */}
						<div className="flex items-center justify-between pb-1 border-b border-gray-200">
							<span className="text-sm font-medium text-[#B9AB70]">{review.user}</span>
							<div className="flex items-center gap-1 text-[#B9AB70] text-sm">
								<span>★</span>
								<span>{review.rating.toFixed(1)}</span>
							</div>
						</div>

						{/* 후기 본문 (스크롤 가능 영역) */}
						<p className="text-sm text-gray-800 leading-relaxed max-h-40 overflow-y-auto">
							{review.content}
						</p>

						{/* 첨부 이미지 */}
						{review.image && (
							<div className="w-full h-32 bg-gray-300 flex items-center justify-center text-gray-700 text-sm rounded-md">
								후기 첨부한 이미지
							</div>
						)}

						{/* 날짜 */}
						<p className="text-xs text-gray-400 text-right">{review.date}</p>
					</div>

				))}
			</div>
		</div>
	);
}
