"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomDropdownButton } from "../components/CustomDropdown";
import SubscribeModal from "../mypage/subscribeModal";
import { useNicepayPayment } from "../mypage/useNicePayments";

interface Post {
	id: number;
	category: string;
	trainer: string;
	title: string;
	thumbnail: string;
	likes: number;
	comments: number;
}

const mockData: Post[] = [
	{
		id: 1,
		category: "주식",
		trainer: "트레이너 A",
		title: "칼럼 작성 시 지정한 썸네일 배너 사진",
		thumbnail: "/images/thumbnail1.png",
		likes: 99,
		comments: 2,
	},
	{
		id: 2,
		category: "채권",
		trainer: "트레이너 B",
		title: "칼럼 작성 시 지정한 썸네일 배너 사진",
		thumbnail: "/images/thumbnail2.png",
		likes: 99,
		comments: 2,
	},
	{
		id: 3,
		category: "ETF",
		trainer: "트레이너 C",
		title: "칼럼 작성 시 지정한 썸네일 배너 사진",
		thumbnail: "/images/thumbnail3.png",
		likes: 99,
		comments: 2,
	},
	{
		id: 4,
		category: "주식",
		trainer: "트레이너 B",
		title: "칼럼 작성 시 지정한 썸네일 배너 사진",
		thumbnail: "/images/thumbnail4.png",
		likes: 99,
		comments: 2,
	},
	{
		id: 5,
		category: "채권",
		trainer: "트레이너 A",
		title: "칼럼 작성 시 지정한 썸네일 배너 사진",
		thumbnail: "/images/thumbnail5.png",
		likes: 99,
		comments: 2,
	},
];

export default function AllPost() {
	const router = useRouter();
	const [selectedCategory, setSelectedCategory] = useState("전체 카테고리");
	const [selectedTrainer, setSelectedTrainer] = useState("전체 트레이너");
	const [isSubModalOpen, setIsSubModalOpen] = useState(false);
	const { openPayment } = useNicepayPayment();

	const categories = ["전체 카테고리", "주식", "채권", "ETF"];
	const trainers = ["전체 트레이너", "트레이너 A", "트레이너 B", "트레이너 C"];

	const filteredData = mockData.filter((post) => {
		return (
			(selectedCategory === "전체 카테고리" || post.category === selectedCategory) &&
			(selectedTrainer === "전체 트레이너" || post.trainer === selectedTrainer)
		);
	});

	return (
		<div className="w-full min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 lg:px-8 pb-20">
			<h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl mt-20 mb-14 text-center">
				트레이딩 전문가의 칼럼을 읽어보세요.
			</h1>

			<button className="w-auto px-6 py-2 bg-gradient-to-r from-[#D2C693] to-[#928346] text-white font-medium rounded-md shadow text-sm sm:text-base mb-14 cursor-pointer"
				onClick={() => setIsSubModalOpen(true)}
			>
				구독하고 트레이닝 받아보기
			</button>

			<SubscribeModal
				isOpen={isSubModalOpen}
				onClose={() => setIsSubModalOpen(false)}
				onConfirmPayment={() => {
          		setIsSubModalOpen(false);
          		openPayment(); // 결제창 열기
        }}
			/>

			{/* 필터 영역 */}
			<div className="flex gap-3 w-full max-w-2xl justify-start">
				<CustomDropdownButton
					options={categories}
					defaultValue={selectedCategory}
					onSelect={(value) => setSelectedCategory(value)}
				/>
				<CustomDropdownButton
					options={trainers}
					defaultValue={selectedTrainer}
					onSelect={(value) => setSelectedTrainer(value)}
				/>
			</div>

			{/* 게시물 리스트 */}
			<div className="mt-8 w-full max-w-2xl flex flex-col gap-6">
				{filteredData.map((post) => (
					<div
						key={post.id}
						onClick={() => router.push("/postdetail")}
						className="cursor-pointer border border-gray-200 rounded-md shadow-sm overflow-hidden hover:shadow-md transition"
					>
						{/* 카테고리 뱃지 */}
						<div className="px-3 py-2">
							<span
								className={`inline-block px-2 py-1 text-xs font-medium rounded ${post.category === "주식"
									? "bg-blue-100 text-blue-700"
									: post.category === "채권"
										? "bg-green-100 text-green-700"
										: "bg-yellow-100 text-yellow-700"
									}`}
							>
								{post.category}
							</span>
						</div>

						{/* 썸네일/제목 */}
						<div className="bg-gray-300 flex items-center justify-center h-24 sm:h-32 text-xs sm:text-sm">
							{post.title}
						</div>

						{/* 좋아요/댓글 */}
						<div className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 flex gap-4">
							<span>좋아요 {post.likes}</span>
							<span>댓글 {post.comments}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
