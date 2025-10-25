"use client";

import { useState } from "react";
import { useFormState } from "./hooks/useFormState";
import FormHeader from "./components/FormHeader";
import { User } from "@/app/types/user";
import SaveSuccess from "../SaveSuccess";

type Props = {
	onSubmit: (data: any) => void;
	currentUser: User & {
		userLevel: "BASIC" | "PREMIUM";
		completion: "BEFORE_COMPLETION" | "AFTER_COMPLETION";
		investmentType: "SWING" | "DAY" | "SCALPING";
	};
	riskTaking?: number;
};

export default function BasicOrBeforeForm({
	onSubmit,
	currentUser,
	riskTaking = 5,
}: Props) {
	const {
		form,
		handleChange,
		handleFileChange,
		handleWeekChange,
		screenshotPreview,
		position,
		setPosition,
		isPositive,
		setIsPositive,
		pl,
		setPl,
		rr,
		screenshot,
	} = useFormState(riskTaking);

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

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
			{/* 상단 헤더 */}
			<FormHeader
				investmentType={currentUser.investmentType}
				userLevel={currentUser.userLevel}
				completion={currentUser.completion}
				onWeekChange={handleWeekChange}
			/>

			{/* 안내 문구 */}
			<div className="text-sm text-gray-600 -mt-3">
				담당 트레이너에게 피드백을 요청합니다.
			</div>

			{/* === 2. 기본 정보 입력 섹션 === */}
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

			{/* 포지션 홀딩 시간 */}
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
					onClick={() => document.getElementById("screenshotInput")?.click()}
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

			{/* === 3. 포지션 설정 섹션 === */}
			{/* 레버리지 */}
			<div>
				<label className="block mb-1 font-medium">레버리지 (배점)</label>
				<input
					type="number"
					name="leverage"
					value={form.leverage}
					onChange={handleChange}
					className="bg-[#F4F4F4] rounded p-2 w-full"
				/>
			</div>

			{/* 포지션 선택 */}
			<div>
				<label className="block mb-1 font-medium">포지션</label>
				<div className="flex gap-3">
					<button
						type="button"
						onClick={() => setPosition("LONG")}
						className={`flex-1 px-4 py-2 cursor-pointer rounded ${position === "LONG"
							? "bg-[#2AC287] text-white"
							: "bg-[#F4F4F4] text-black"
							}`}
					>
						Long
					</button>
					<button
						type="button"
						onClick={() => setPosition("SHORT")}
						className={`flex-1 px-4 py-2 cursor-pointer rounded ${position === "SHORT"
							? "bg-[#F74C5F] text-white"
							: "bg-[#F4F4F4] text-black"
							}`}
					>
						Short
					</button>
				</div>
			</div>

			{/* === 4. 손익 및 리스크 섹션 === */}
			{/* 비중 */}
			<div>
				<label className="block mb-1 font-medium">비중 (운용 자금 대비)</label>
				<input
					type="number"
					name="operatingFundsRatio"
					placeholder="%"
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
						placeholder="진입가"
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
						placeholder="탈출가"
						value={form.exitPrice}
						onChange={handleChange}
						className="bg-[#F4F4F4] rounded p-2 w-full"
					/>
				</div>
			</div>

			{/* 리스크 테이킹 */}
			<div>
				<label className="block mb-1 font-medium">Risk Taking (%)</label>
				<input
					type="number"
					name="riskTaking"
					placeholder="%"
					value={form.riskTaking}
					onChange={handleChange}
					className="bg-[#F4F4F4] rounded p-2 w-full"
				/>
			</div>

			{/* 손절 / 익절 */}
			<div className="flex gap-4">
				<div className="flex-1">
					<label className="block mb-1 font-medium">설정 손절가</label>
					<input
						type="number"
						name="settingStopLoss"
						placeholder="손절가"
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
						placeholder="익절가"
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
								? "bg-[#2AC287] text-white"
								: "bg-white text-[#2AC287] border-[#2AC287]"
								}`}
							onClick={() => setIsPositive(true)}
						>
							+
						</button>
						<button
							type="button"
							className={`px-3 py-1 border rounded ${!isPositive
								? "bg-[#F74C5F] text-white"
								: "bg-white text-[#F74C5F] border-[#F74C5F]"
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

				{/* 손익 결과 게이지바 */}
				<div className="relative w-full h-20 mt-4">
					<div className="absolute top-1/2 w-full border-t border-gray-300" />
					<div className="flex justify-between text-xs text-gray-500 mt-6">
						{Array.from({ length: 7 }, (_, i) => (
							<span key={i}>{-3 + i}</span>
						))}
					</div>
					<div
						className={`absolute top-2 ${
							(() => {
								const gaugeMin = -3;
								const gaugeMax = 3;
								const actualPl = isPositive ? pl : -pl;
								const normalized = Math.min(
									Math.max(actualPl / Number(form.riskTaking || riskTaking), gaugeMin),
									gaugeMax
								);
								if (normalized <= -2) return "text-red-500";
								if (normalized >= 2) return "text-green-600";
								return "text-gray-500";
							})()
						}`}
						style={{
							left: `${(() => {
								const gaugeMin = -3;
								const gaugeMax = 3;
								const actualPl = isPositive ? pl : -pl;
								const normalized = Math.min(
									Math.max(actualPl / Number(form.riskTaking || riskTaking), gaugeMin),
									gaugeMax
								);
								return ((normalized - gaugeMin) / (gaugeMax - gaugeMin)) * 100;
							})()}%`,
							transform: "translateX(-50%)",
						}}
					>
						▼
					</div>
					<span className="absolute left-0 top-0 text-red-500 font-semibold">Fail</span>
					<span className="absolute right-0 top-0 text-green-600 font-semibold">Success</span>
				</div>
			</div>

			{/* === 5. 피드백 참고 입력 섹션 === */}
			<div>
				<label className="block mb-1 font-medium">포지션 진입 근거</label>
				<textarea
					name="positionStartReason"
					placeholder="포지션 진입 이유를 작성해주세요."
					value={form.positionStartReason}
					onChange={handleChange}
					className="bg-[#F4F4F4] rounded p-2 w-full h-24"
				/>
			</div>

			<div>
				<label className="block mb-1 font-medium">포지션 탈출 근거</label>
				<textarea
					name="positionEndReason"
					placeholder="포지션 탈출 이유를 작성해주세요."
					value={form.positionEndReason}
					onChange={handleChange}
					className="bg-[#F4F4F4] rounded p-2 w-full h-24"
				/>
			</div>

			<div>
				<label className="block mb-1 font-medium">최종 복기</label>
				<textarea
					name="tradingReview"
					placeholder="매매에 대한 종합적인 복기를 작성해주세요."
					value={form.tradingReview}
					onChange={handleChange}
					className="bg-[#F4F4F4] rounded p-2 w-full h-24"
				/>
			</div>

			{/* 제출 버튼 */}
			<button
				type="submit"
				className="bg-gradient-to-r from-[#D2C693] to-[#928346] text-white py-3 rounded mb-20 cursor-pointer"
			>
				트레이딩 피드백 요청하기
			</button>
		</form>
	);
}
