"use client";

import { useState, useEffect } from "react";
import { User } from "@/app/types/user";
import WeekSelector from "../WeekSelector";

type Props = {
	onSubmit: (data: any) => void;
	currentUser: User;
	riskTaking?: number;
};

const investmentTypeMap: Record<string, string> = {
	SWING: "스윙",
	DAY: "데이",
	SCALPING: "스켈핑",
};

const completionMap: Record<string, string> = {
	BEFORE_COMPLETION: "완강 전",
	AFTER_COMPLETION: "완강 후",
	FREE: "무료",
};

export default function BasicOrBeforeForm({ onSubmit, currentUser, riskTaking = 5 }: Props) {
	const { investmentType, completion } = currentUser;

	const investmentTypeLabel = investmentTypeMap[investmentType] || investmentType;
	const completionLabel = completionMap[completion] || completion;

	const handleWeekChange = (data: { month: number; week: number }) => {
		console.log("현재 선택된 값:", data);
		// TODO: 필요하면 form 데이터에 포함해서 서버 전송
	};

	const [screenshot, setScreenshot] = useState<string | null>(null);
	const [position, setPosition] = useState<"Long" | "Short" | null>(null);
	const [isPositive, setIsPositive] = useState(true);
	const [pl, setPl] = useState<number>(0); // P&L 입력값 (퍼센트)
	const [rr, setRr] = useState<number>(0); // R&R 값

	useEffect(() => {
		if (pl !== 0) {
			setRr(Number((riskTaking / Math.abs(pl)).toFixed(2)));
		} else {
			setRr(0);
		}
	}, [pl, riskTaking]);

	// 게이지 범위: -3 ~ +3
	const gaugeMin = -3;
	const gaugeMax = 3;
	const normalized = Math.min(Math.max(pl / riskTaking, gaugeMin), gaugeMax);

	// 화살표 색상 조건
	let arrowColor = "text-gray-500";
	if (normalized <= -2) arrowColor = "text-red-500";
	else if (normalized >= 2) arrowColor = "text-green-600";

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const imageUrl = URL.createObjectURL(file);
			setScreenshot(imageUrl);
		}
	};

	const handleUploadClick = () => {
		document.getElementById("screenshotInput")?.click();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = {
			screenshot,
			position,
			pl: isPositive ? pl : -pl,
			rr,
		};
		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">

			{/* 상단: 투자유형, 완강여부, (스윙일 때 주차 선택) */}
			<div className="flex items-center gap-3 mb-6">
				<span
					className={`px-3 py-1 text-white rounded
    ${investmentType === "SWING" ? "bg-orange-400" : ""}
    ${investmentType === "DAY" ? "bg-green-400" : ""}
    ${investmentType === "SCALPING" ? "bg-sky-400" : ""}`}
				>
					{investmentTypeLabel}
				</span>
				<span className="px-3 py-1 border rounded">{completionLabel}</span>

				{investmentType === "SWING" && (
					<WeekSelector onChange={handleWeekChange} />
				)}
			</div>

			<div>
				<label className="block mb-1 font-medium">기록 날짜</label>
				<input
					type="date"
					value={new Date().toISOString().split("T")[0]}
					readOnly
					className="border border-gray-300 rounded p-2 w-full cursor-not-allowed bg-gray-100"
				/>
			</div>

			{/* 종목 */}
			<div>
				<label className="block mb-1 font-medium">종목</label>
				<input
					type="text"
					placeholder="투자 종목을 입력하세요."
					className="bg-[#F4F4F4] rounded p-2 w-full"
				/>
			</div>

			{/* 포지션 홀딩 시간 */}
			<div>
				<label className="block mb-1 font-medium">포지션 홀딩 시간</label>
				<input
					type="text"
					placeholder="내용 입력"
					className="bg-[#F4F4F4] rounded p-2 w-full"
				/>
			</div>

			{/* 스크린샷 업로드 */}
			<div>
				<label className="block mb-1 font-medium">스크린샷 업로드</label>
				<div
					className="w-full h-40 rounded bg-[#F4F4F4] flex items-center justify-center cursor-pointer overflow-hidden"
					onClick={handleUploadClick}
				>
					{screenshot ? (
						<img
							src={screenshot}
							alt="screenshot preview"
							className="object-contain w-full h-full"
						/>
					) : (
						<span className="text-gray-400">이미지를 업로드하세요</span>
					)}
				</div>
				<input
					type="file"
					id="screenshotInput"
					accept="image/*"
					className="hidden"
					onChange={handleFileChange}
				/>
			</div>

			{/* 포지션 */}
			<div className="flex gap-3">
				<button
					type="button"
					onClick={() => setPosition("Long")}
					className={`px-4 py-2 cursor-pointer rounded ${position === "Long" ? "bg-[#273042] text-white" : "bg-[#F4F4F4] text-black"
						}`}
				>
					Long
				</button>
				<button
					type="button"
					onClick={() => setPosition("Short")}
					className={`px-4 py-2 cursor-pointer rounded ${position === "Short" ? "bg-[#273042] text-white" : "bg-[#F4F4F4] text-black"
						}`}
				>
					Short
				</button>
			</div>

			{/* 비중 */}
			<div className="flex-1">
				<label className="block mb-1 font-medium">비중 (운용 자금 대비)</label>
				<input type="number" className="bg-[#F4F4F4] rounded p-2 w-full" />
			</div>

			{/* Entry / Exit */}
			<div className="flex gap-4">
				<div className="flex-1">
					<label className="block mb-1 font-medium">Entry Price</label>
					<input type="number" className="bg-[#F4F4F4] rounded p-2 w-full" />
				</div>
				<div className="flex-1">
					<label className="block mb-1 font-medium">Exit Price</label>
					<input type="number" className="bg-[#F4F4F4] rounded p-2 w-full" />
				</div>
			</div>

			{/* 리스크 테이킹 */}
			<div className="flex-1">
				<label className="block mb-1 font-medium">리스크 테이킹 (%)</label>
				<input type="number" className="bg-[#F4F4F4] rounded p-2 w-full" />
			</div>

			{/* 손절/익절 */}
			<div className="flex gap-4">
				<div className="flex-1">
					<label className="block mb-1 font-medium">설정 손절가</label>
					<input type="number" className="bg-[#F4F4F4] rounded p-2 w-full" />
				</div>
				<div className="flex-1">
					<label className="block mb-1 font-medium">설정 익절가</label>
					<input type="number" className="bg-[#F4F4F4] rounded p-2 w-full" />
				</div>
			</div>

			{/* P&L / R&R / 게이지 */}
			<div className="flex flex-col gap-6">
				{/* P&L */}
				<div className="flex items-center gap-3">
					<span className="font-semibold">P&amp;L:</span>
					<div className="flex gap-2">
						<button
							type="button"
							className={`px-3 py-1 border rounded ${isPositive ? "bg-green-500 text-white" : "bg-white text-green-500 border-green-500"
								}`}
							onClick={() => setIsPositive(true)}
						>
							+
						</button>
						<button
							type="button"
							className={`px-3 py-1 border rounded ${!isPositive ? "bg-red-500 text-white" : "bg-white text-red-500 border-red-500"
								}`}
							onClick={() => setIsPositive(false)}
						>
							-
						</button>
					</div>
					<input
						type="number"
						value={pl}
						onChange={(e) => setPl(Number(e.target.value))}
						className="w-20 border rounded p-1 text-center"
					/>
					<span>%</span>
				</div>

				{/* R&R */}
				<div className="flex items-center gap-3">
					<span className="font-semibold">R&amp;R:</span>
					<span>{rr}</span>
				</div>

				{/* 게이지 */}
				<div className="relative w-full h-20">
					<div className="absolute top-1/2 w-full border-t border-gray-300" />
					<div className="flex justify-between text-xs text-gray-500 mt-6">
						{Array.from({ length: gaugeMax - gaugeMin + 1 }, (_, i) => (
							<span key={i}>{gaugeMin + i}</span>
						))}
					</div>

					{/* 화살표 */}
					<div
						className={`absolute top-2 ${arrowColor}`}
						style={{
							left: `${((normalized - gaugeMin) / (gaugeMax - gaugeMin)) * 100}%`,
							transform: "translateX(-50%)",
						}}
					>
						▼
					</div>

					{/* Fail */}
					<span className="absolute left-0 top-0 text-red-500 font-semibold">Fail</span>
				</div>
			</div>

			{/* 근거 및 복기 */}
			<div>
				<label className="block mb-1 font-medium">포지션 진입 근거</label>
				<textarea className="bg-[#F4F4F4] rounded p-2 w-full h-24" />
			</div>
			<div>
				<label className="block mb-1 font-medium">포지션 탈출 근거</label>
				<textarea className="bg-[#F4F4F4] rounded p-2 w-full h-24" />
			</div>
			<div>
				<label className="block mb-1 font-medium">최종 복기</label>
				<textarea className="bg-[#F4F4F4] rounded p-2 w-full h-24" />
			</div>

			{/* 제출 */}
			<button
				type="submit"
				className="bg-gradient-to-r from-[#D2C693] to-[#928346] text-white py-3 rounded mb-20"
			>
				매매일지 기록하기
			</button>
		</form>
	);
}
