"use client";

import { useState, useEffect, useCallback } from "react";
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

export default function BasicOrBeforeForm({
	onSubmit,
	currentUser,
	riskTaking = 5,
}: Props) {
	const { investmentType, completion } = currentUser;

	const investmentTypeLabel = investmentTypeMap[investmentType] || investmentType;
	const completionLabel = completionMap[completion] || completion;

	// 상태 
	const [form, setForm] = useState({
		feedbackRequestDate: new Date().toISOString().split("T")[0],
		category: "",
		positionHoldingTime: "",
		operatingFundsRatio: "",
		entryPrice: "",
		exitPrice: "",
		riskTaking: riskTaking.toString(),
		settingStopLoss: "",
		settingTakeProfit: "",
		positionStartReason: "",
		positionEndReason: "",
		tradingReview: "",
	});

	const [screenshot, setScreenshot] = useState<File | null>(null);
	const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
	const [position, setPosition] = useState<"LONG" | "SHORT" | null>(null);
	const [isPositive, setIsPositive] = useState(true);
	const [pl, setPl] = useState<number>(0);
	const [rr, setRr] = useState<number>(0);

	// R&R 자동 계산
	useEffect(() => {
		if (pl !== 0) {
			setRr(Number((riskTaking / Math.abs(pl)).toFixed(2)));
		} else {
			setRr(0);
		}
	}, [pl, riskTaking]);

	// WeekSelector 변경 처리
	const handleWeekChange = useCallback((data: { month: number; week: number }) => {
		setForm((prev) => ({
			...prev,
			month: data.month,
			week: data.week,
		}));
	}, []);


	// input 공통 핸들러
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// 파일 업로드
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setScreenshot(file);
			setScreenshotPreview(URL.createObjectURL(file));
		}
	};

	const handleUploadClick = () => {
		document.getElementById("screenshotInput")?.click();
	};

	// Submit 시 부모에게 모든 데이터 전달
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const formData = {
			...form,
			screenshot,
			position,
			isPositive,
			pl: isPositive ? pl : -pl,
			rr,
		};

		onSubmit(formData);
	};

	// 게이지 표시 관련
	const gaugeMin = -3;
	const gaugeMax = 3;
	const normalized = Math.min(Math.max(pl / riskTaking, gaugeMin), gaugeMax);
	let arrowColor = "text-gray-500";
	if (normalized <= -2) arrowColor = "text-red-500";
	else if (normalized >= 2) arrowColor = "text-green-600";

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
			{/* 상단 */}
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

				{investmentType === "SWING" && <WeekSelector onChange={handleWeekChange} />}
			</div>

			{/* 날짜 */}
			<div>
				<label className="block mb-1 font-medium">기록 날짜</label>
				<input
					type="date"
					name="feedbackRequestDate"
					value={form.feedbackRequestDate}
					onChange={handleChange}
					className="border border-gray-300 rounded p-2 w-full bg-gray-100"
					readOnly
				/>
			</div>

			{/* 종목 */}
			<div>
				<label className="block mb-1 font-medium">종목</label>
				<input
					type="text"
					name="category"
					placeholder="투자 종목을 입력하세요."
					value={form.category}
					onChange={handleChange}
					className="bg-[#F4F4F4] rounded p-2 w-full"
				/>
			</div>

			{/* 홀딩 시간 */}
			<div>
				<label className="block mb-1 font-medium">포지션 홀딩 시간</label>
				<input
					type="text"
					name="positionHoldingTime"
					placeholder="내용 입력"
					value={form.positionHoldingTime}
					onChange={handleChange}
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
					{screenshotPreview ? (
						<img
							src={screenshotPreview}
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
					onClick={() => setPosition("LONG")}
					className={`px-4 py-2 cursor-pointer rounded ${position === "LONG" ? "bg-green-500 text-white" : "bg-[#F4F4F4] text-black"
						}`}
				>
					Long
				</button>
				<button
					type="button"
					onClick={() => setPosition("SHORT")}
					className={`px-4 py-2 cursor-pointer rounded ${position === "SHORT" ? "bg-red-400 text-white" : "bg-[#F4F4F4] text-black"
						}`}
				>
					Short
				</button>
			</div>

			{/* 비중 */}
			<div>
				<label className="block mb-1 font-medium">비중 (운용 자금 대비)</label>
				<input
					type="number"
					name="operatingFundsRatio"
					value={form.operatingFundsRatio}
					onChange={handleChange}
					className="bg-[#F4F4F4] rounded p-2 w-full"
				/>
			</div>

			{/* Entry / Exit */}
			<div className="flex gap-4">
				<div className="flex-1">
					<label className="block mb-1 font-medium">Entry Price</label>
					<input
						type="number"
						name="entryPrice"
						value={form.entryPrice}
						onChange={handleChange}
						className="bg-[#F4F4F4] rounded p-2 w-full"
					/>
				</div>
				<div className="flex-1">
					<label className="block mb-1 font-medium">Exit Price</label>
					<input
						type="number"
						name="exitPrice"
						value={form.exitPrice}
						onChange={handleChange}
						className="bg-[#F4F4F4] rounded p-2 w-full"
					/>
				</div>
			</div>

			{/* 리스크 테이킹 */}
			<div>
				<label className="block mb-1 font-medium">리스크 테이킹 (%)</label>
				<input
					type="number"
					name="riskTaking"
					value={form.riskTaking}
					onChange={handleChange}
					className="bg-[#F4F4F4] rounded p-2 w-full"
				/>
			</div>

			{/* 손절/익절 */}
			<div className="flex gap-4">
				<div className="flex-1">
					<label className="block mb-1 font-medium">설정 손절가</label>
					<input
						type="number"
						name="settingStopLoss"
						value={form.settingStopLoss}
						onChange={handleChange}
						className="bg-[#F4F4F4] rounded p-2 w-full"
					/>
				</div>
				<div className="flex-1">
					<label className="block mb-1 font-medium">설정 익절가</label>
					<input
						type="number"
						name="settingTakeProfit"
						value={form.settingTakeProfit}
						onChange={handleChange}
						className="bg-[#F4F4F4] rounded p-2 w-full"
					/>
				</div>
			</div>

			{/* P&L / R&R */}
			<div className="flex flex-col gap-6">
				<div className="flex items-center gap-3">
					<span className="font-semibold">P&amp;L:</span>
					<div className="flex gap-2">
						<button
							type="button"
							className={`px-3 py-1 border rounded ${isPositive
								? "bg-green-500 text-white"
								: "bg-white text-green-500 border-green-500"
								}`}
							onClick={() => setIsPositive(true)}
						>
							+
						</button>
						<button
							type="button"
							className={`px-3 py-1 border rounded ${!isPositive
								? "bg-red-500 text-white"
								: "bg-white text-red-500 border-red-500"
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

				<div className="flex items-center gap-3">
					<span className="font-semibold">R&amp;R:</span>
					<span>{rr}</span>
				</div>
			</div>

			{/* 복기 */}
			<div>
				<label className="block mb-1 font-medium">포지션 진입 근거</label>
				<textarea
					name="positionStartReason"
					value={form.positionStartReason}
					onChange={handleChange}
					className="bg-[#F4F4F4] rounded p-2 w-full h-24"
				/>
			</div>
			<div>
				<label className="block mb-1 font-medium">포지션 탈출 근거</label>
				<textarea
					name="positionEndReason"
					value={form.positionEndReason}
					onChange={handleChange}
					className="bg-[#F4F4F4] rounded p-2 w-full h-24"
				/>
			</div>
			<div>
				<label className="block mb-1 font-medium">최종 복기</label>
				<textarea
					name="tradingReview"
					value={form.tradingReview}
					onChange={handleChange}
					className="bg-[#F4F4F4] rounded p-2 w-full h-24"
				/>
			</div>

			<button
				type="submit"
				className="bg-gradient-to-r from-[#D2C693] to-[#928346] text-white py-3 rounded mb-20 cursor-pointer"
			>
				매매일지 기록하기
			</button>
		</form>
	);
}
