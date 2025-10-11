"use client";

import { useState, useEffect, useCallback } from "react";
import { User } from "@/app/types/user";
import WeekSelector from "../WeekSelector";
import { FixedModalButton } from "@/app/components/FixedModalButton";
import CustomDivider from "@/app/components/CustomDivider";
import EntryTable from "../EntryTable";

type Props = {
	onSubmit: (data: any) => void;
	currentUser: User;
	// currentUser: User & {
	// 	userLevel: "BASIC" | "PREMIUM";
	// 	completion: "BEFORE_COMPLETION" | "AFTER_COMPLETION";
	// 	investmentType: "SWING" | "DAY" | "SCALPING";
	// };
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

export default function SwingAfterForm({ onSubmit, currentUser, riskTaking = 5 }: Props) {
	const { investmentType, completion } = currentUser;

	const investmentTypeLabel = investmentTypeMap[investmentType] || investmentType;
	const completionLabel = completionMap[completion] || completion;

	// 상태
	const [category, setCategory] = useState("");
	const [entryDate, setEntryDate] = useState("");
	const [exitDate, setExitDate] = useState("");
	const [trendAnalysis, setTrendAnalysis] = useState("");
	const [tradingReview, setTradingReview] = useState("");
	const [trainerFeedback, setTrainerFeedback] = useState("");
	const [risk, setRisk] = useState<number>(riskTaking);
	const [leverage, setLeverage] = useState<number>(0);
	const [position, setPosition] = useState<"LONG" | "SHORT" | null>(null);
	const [isPositive, setIsPositive] = useState(true);
	const [pl, setPl] = useState<number>(0);
	const [rr, setRr] = useState<number>(0);

	// 프레임 선택
	const [directionFrame, setDirectionFrame] = useState("");
	const [mainFrame, setMainFrame] = useState("");
	const [subFrame, setSubFrame] = useState("");

	// 주차 선택
	const [selectedWeek, setSelectedWeek] = useState<{ month: number; week: number } | null>(null);

	// 진입 타점 관련
	const [isOpen, setIsOpen] = useState(false);
	const [isOpen2, setIsOpen2] = useState(false);
	const [isOpen3, setIsOpen3] = useState(false);
	const [entryPoint1, setEntryPoint1] = useState<string>("");
	const [grade1, setGrade1] = useState<string>("");
	const [entryPoint2, setEntryPoint2] = useState<string>("");
	const [entryPoint3, setEntryPoint3] = useState<string>("");

	const handleSelect1 = (data: { target: string; grade: string }) => {
		setEntryPoint1(data.target);
		setGrade1(data.grade);
		setIsOpen(false);
	};
	const handleSelect2 = (data: { target: string; grade: string }) => {
		setEntryPoint2(data.target);
		setIsOpen2(false);
	};
	const handleSelect3 = (data: { target: string; grade: string }) => {
		setEntryPoint3(data.target);
		setIsOpen3(false);
	};

	// 스크린샷 파일
	const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
	const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setScreenshotFile(file);
			setScreenshotPreview(URL.createObjectURL(file));
		}
	};

	const handleUploadClick = () => {
		document.getElementById("screenshotInput")?.click();
	};

	// R&R 자동 계산
	useEffect(() => {
		if (pl !== 0) setRr(Number((risk / Math.abs(pl)).toFixed(2)));
		else setRr(0);
	}, [pl, risk]);

	// 주차 선택
	const handleWeekChange = useCallback((data: { month: number; week: number }) => {
		setSelectedWeek(data);
	}, []); // deps 비워서 최초 한 번만 생성

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const formData = {
			screenshot: screenshotFile,
			category,
			entryDate,
			exitDate,
			directionFrame,
			mainFrame,
			subFrame,
			trendAnalysis,
			entryPoint1,
			grade1,
			entryPoint2,
			entryPoint3,
			risk,
			leverage,
			position,
			pl: isPositive ? pl : -pl,
			rr,
			tradingReview,
			trainerFeedback,
			selectedWeek,
		};

		console.log("제출된 스윙 폼 데이터:", formData);
		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
			{/* 상단: 투자유형, 완강여부, 주차 */}
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
			</div>

			<WeekSelector onChange={handleWeekChange} />

			{/* 날짜 */}
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
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className="bg-[#F4F4F4] rounded p-2 w-full"
				/>
			</div>

			{/* 포지션 진입/종료 */}
			<div className="flex gap-4">
				<div className="flex-1">
					<label className="block mb-1 font-medium">포지션 진입 날짜</label>
					<input
						type="date"
						value={entryDate}
						onChange={(e) => setEntryDate(e.target.value)}
						className="border border-gray-300 rounded p-2 w-full cursor-pointer"
					/>
				</div>
				<div className="flex-1">
					<label className="block mb-1 font-medium">포지션 종료 날짜</label>
					<input
						type="date"
						value={exitDate}
						onChange={(e) => setExitDate(e.target.value)}
						className="border border-gray-300 rounded p-2 w-full cursor-pointer"
					/>
				</div>
			</div>

			{/* 스크린샷 업로드 */}
			<div>
				<label className="block mb-1 font-medium">스크린샷 업로드</label>
				<div
					className="w-full h-40 rounded bg-[#F4F4F4] flex items-center justify-center cursor-pointer overflow-hidden"
					onClick={handleUploadClick}
				>
					{screenshotPreview ? (
						<img src={screenshotPreview} alt="screenshot" className="object-contain w-full h-full" />
					) : (
						<span className="text-gray-400">이미지를 업로드하세요</span>
					)}
				</div>
				<input type="file" id="screenshotInput" accept="image/*" className="hidden" onChange={handleFileChange} />
			</div>

			{/* 프레임 선택 */}
			<div className="flex gap-4">
				<div className="flex-1 flex items-center justify-center gap-2">
					<label className="block mb-1 text-sm">디렉션 프레임</label>
					<FixedModalButton options={["1D", "4H"]} defaultValue="선택" onSelect={setDirectionFrame} />
				</div>
				<div className="flex-1 flex items-center justify-center gap-2">
					<label className="block mb-1 text-sm">메인 프레임</label>
					<FixedModalButton options={["4H", "1H"]} defaultValue="선택" onSelect={setMainFrame} />
				</div>
				<div className="flex-1 flex items-center justify-center gap-2">
					<label className="block mb-1 text-sm">서브 프레임</label>
					<FixedModalButton options={["1H", "15M"]} defaultValue="선택" onSelect={setSubFrame} />
				</div>
			</div>

			{/* 추세 분석 */}
			<div>
				<label className="block mb-1 font-medium">추세 분석</label>
				<textarea
					className="bg-[#F4F4F4] rounded p-2 w-full h-12"
					value={trendAnalysis}
					onChange={(e) => setTrendAnalysis(e.target.value)}
				/>
			</div>

			{/* 진입 타점 1, 2, 3 */}
			<div className="flex flex-col gap-3">
				<div className="flex gap-2 items-center">
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="px-4 py-2 border border-gray-300 text-black rounded text-sm cursor-pointer"
					>
						1진입타점
					</button>
					{entryPoint1 && (
						<div className="text-sm">
							{entryPoint1}, {grade1}
						</div>
					)}
					<EntryTable isOpen={isOpen} onClose={() => setIsOpen(false)} onSelect={handleSelect1} />
				</div>

				<div className="flex gap-2 items-center">
					<button
						type="button"
						onClick={() => setIsOpen2(true)}
						className="px-4 py-2 border border-gray-300 text-black rounded text-sm cursor-pointer"
					>
						추가매수 (1)
					</button>
					<FixedModalButton options={["1D", "4H", "1H", "15M"]} defaultValue="선택" onSelect={setEntryPoint2} />
					<EntryTable isOpen={isOpen2} onClose={() => setIsOpen2(false)} onSelect={handleSelect2} />
				</div>

				<div className="flex gap-2 items-center">
					<button
						type="button"
						onClick={() => setIsOpen3(true)}
						className="px-4 py-2 border border-gray-300 text-black rounded text-sm cursor-pointer"
					>
						추가매수 (2)
					</button>
					<FixedModalButton options={["1D", "4H", "1H", "15M"]} defaultValue="선택" onSelect={setEntryPoint3} />
					<EntryTable isOpen={isOpen3} onClose={() => setIsOpen3(false)} onSelect={handleSelect3} />
				</div>
			</div>

			{/* 리스크, 레버리지 */}
			<div className="flex gap-4">
				<div className="flex-1">
					<label className="block mb-1 font-medium">리스크 테이킹 (%)</label>
					<input
						type="number"
						value={risk}
						onChange={(e) => setRisk(Number(e.target.value))}
						className="bg-[#F4F4F4] rounded p-2 w-full"
					/>
				</div>
				<div className="flex-1">
					<label className="block mb-1 font-medium">레버리지 (배점)</label>
					<input
						type="number"
						value={leverage}
						onChange={(e) => setLeverage(Number(e.target.value))}
						className="bg-[#F4F4F4] rounded p-2 w-full"
					/>
				</div>
			</div>

			<CustomDivider variant="horizontal" />

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

			{/* 매매 복기 */}
			<div>
				<label className="block mb-1 font-medium">매매 복기</label>
				<textarea
					className="bg-[#F4F4F4] rounded p-2 w-full h-24"
					value={tradingReview}
					onChange={(e) => setTradingReview(e.target.value)}
				/>
			</div>

			{/* 피드백 */}
			<div>
				<label className="block mb-1 font-medium">담당 트레이너 피드백 요청 사항</label>
				<textarea
					className="bg-[#F4F4F4] rounded p-2 w-full h-24"
					value={trainerFeedback}
					onChange={(e) => setTrainerFeedback(e.target.value)}
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
