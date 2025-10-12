"use client";

import { useState, useEffect } from "react";
import { User } from "@/app/types/user";
import WeekSelector from "../WeekSelector";

type Props = {
	onSubmit: (data: any) => void;
	currentUser: User;
	// currentUser: User & {
	// 	userLevel: "BASIC" | "PREMIUM";
	// 	completion: "BEFORE_COMPLETION" | "AFTER_COMPLETION";
	// 	investmentType: "SWING" | "DAY" | "SCALPING";
	// };
	riskTaking?: number; // 기본값 5%
};

export default function ScalpingAfterForm({ onSubmit, currentUser, riskTaking = 5 }: Props) {
	const { investmentType, completion } = currentUser;

	const handleWeekChange = (data: { month: number; week: number }) => {
		console.log("현재 선택된 값:", data);
	};

	// ---- 상태 관리 ----
	const [screenshot, setScreenshot] = useState<File | null>(null);
	const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

	const [position, setPosition] = useState<"LONG" | "SHORT" | null>(null);
	const [isPositive, setIsPositive] = useState(true);
	const [pl, setPl] = useState<number>(0);
	const [rr, setRr] = useState<number>(0);

	const [symbol, setSymbol] = useState("");
	const [dailyTradingCount, setDailyTradingCount] = useState<number>(0);
	const [risk, setRisk] = useState<number>(riskTaking);
	const [leverage, setLeverage] = useState<number>(1);
	const [totalPositions, setTotalPositions] = useState<number>(0);
	const [totalProfitTrades, setTotalProfitTrades] = useState<number>(0);
	const [trendAnalysis, setTrendAnalysis] = useState("");
	const [trainerFeedback, setTrainerFeedback] = useState("");

	// ---- RR 계산 ----
	useEffect(() => {
		if (pl !== 0) {
			setRr(Number((risk / Math.abs(pl)).toFixed(2)));
		} else {
			setRr(0);
		}
	}, [pl, risk]);

	// ---- 파일 업로드 ----
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

	// ---- 제출 ----
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = {
			symbol,
			dailyTradingCount,
			risk,
			leverage,
			totalPositions,
			totalProfitTrades,
			trendAnalysis,
			trainerFeedback,
			screenshot, // 실제 파일
			position,
			pl: isPositive ? pl : -pl,
			rr,
			requestDate: new Date().toISOString().split("T")[0], // 기록 날짜
		};
		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
			{/* 상단: 투자유형, 완강여부 */}
			<div className="flex items-center gap-3 mb-6">
				<span
					className={`px-3 py-1 text-white rounded
            ${investmentType === "SWING" ? "bg-orange-400" : ""}
            ${investmentType === "DAY" ? "bg-[#2AC287]" : ""}
            ${investmentType === "SCALPING" ? "bg-sky-400" : ""}`}
				>
					{investmentType}
				</span>
				<span className="px-3 py-1 border rounded">{completion}</span>
				{investmentType === "SWING" && <WeekSelector onChange={handleWeekChange} />}
			</div>

			{/* 기록 날짜 */}
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
					value={symbol}
					onChange={(e) => setSymbol(e.target.value)}
					placeholder="투자 종목을 입력하세요."
					className="bg-[#F4F4F4] rounded p-2 w-full"
				/>
			</div>

			{/* 하루 매매 횟수 */}
			<div>
				<label className="block mb-1 font-medium">하루 매매 횟수</label>
				<input
					type="number"
					value={dailyTradingCount}
					onChange={(e) => setDailyTradingCount(Number(e.target.value))}
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

			{/* 리스크 테이킹 */}
			<div>
				<label className="block mb-1 font-medium">리스크 테이킹 (%)</label>
				<input
					type="number"
					value={risk}
					onChange={(e) => setRisk(Number(e.target.value))}
					className="bg-[#F4F4F4] rounded p-2 w-full"
				/>
			</div>

			{/* 레버리지 */}
			<div>
				<label className="block mb-1 font-medium">레버리지 (배)</label>
				<input
					type="number"
					value={leverage}
					onChange={(e) => setLeverage(Number(e.target.value))}
					className="bg-[#F4F4F4] rounded p-2 w-full"
				/>
			</div>

			{/* 총 포지션 횟수 */}
			<div>
				<label className="block mb-1 font-medium">총 포지션 잡은 횟수</label>
				<input
					type="number"
					value={totalPositions}
					onChange={(e) => setTotalPositions(Number(e.target.value))}
					className="bg-[#F4F4F4] rounded p-2 w-full"
				/>
			</div>

			{/* 총 매매 대비 수익 매매 */}
			<div>
				<label className="block mb-1 font-medium">총 매매횟수 대비 수익 매매횟수</label>
				<input
					type="number"
					value={totalProfitTrades}
					onChange={(e) => setTotalProfitTrades(Number(e.target.value))}
					className="bg-[#F4F4F4] rounded p-2 w-full"
				/>
			</div>

			{/* 추세 분석 */}
			<div>
				<label className="block mb-1 font-medium">15분봉 기준 추세 분석</label>
				<textarea
					value={trendAnalysis}
					onChange={(e) => setTrendAnalysis(e.target.value)}
					className="bg-[#F4F4F4] rounded p-2 w-full h-24"
				/>
			</div>

			{/* 트레이너 피드백 */}
			<div>
				<label className="block mb-1 font-medium">담당 트레이너 피드백 요청 사항</label>
				<textarea
					value={trainerFeedback}
					onChange={(e) => setTrainerFeedback(e.target.value)}
					className="bg-[#F4F4F4] rounded p-2 w-full h-24"
				/>
			</div>

			{/* 제출 */}
			<button
				type="submit"
				className="bg-gradient-to-r from-[#D2C693] to-[#928346] text-white py-3 rounded mb-20 cursor-pointer"
			>
				매매일지 기록하기
			</button>
		</form>
	);
}
