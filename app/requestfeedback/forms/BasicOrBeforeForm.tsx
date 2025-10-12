"use client";

import React from "react";
import { useFormState } from "./hooks/useFormState";
import FormHeader from "./components/FormHeader";
import { User } from "@/app/types/user";

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

			{/* 포지션 선택 */}
			<div className="flex gap-3">
				<button
					type="button"
					onClick={() => setPosition("LONG")}
					className={`px-4 py-2 cursor-pointer rounded ${position === "LONG"
						? "bg-[#2AC287] text-white"
						: "bg-[#F4F4F4] text-black"
						}`}
				>
					Long
				</button>
				<button
					type="button"
					onClick={() => setPosition("SHORT")}
					className={`px-4 py-2 cursor-pointer rounded ${position === "SHORT"
						? "bg-[#F74C5F] text-white"
						: "bg-[#F4F4F4] text-black"
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

			{/* 리스크 테이킹 / 레버리지 */}
			<div className="flex gap-4">
				<div className="flex-1">
					<label className="block mb-1 font-medium">리스크 테이킹 (%)</label>
					<input
						type="number"
						name="riskTaking"
						value={form.riskTaking}
						onChange={handleChange}
						className="bg-[#F4F4F4] rounded p-2 w-full"
					/>
				</div>
				<div className="flex-1">
					<label className="block mb-1 font-medium">레버리지 (배점)</label>
					<input
						type="number"
						name="leverage"
						value={form.leverage}
						onChange={handleChange}
						className="bg-[#F4F4F4] rounded p-2 w-full"
					/>
				</div>
			</div>

			{/* 손절 / 익절 */}
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
			</div>

			{/* 복기 영역 */}
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

			{/* 제출 버튼 */}
			<button
				type="submit"
				className="bg-gradient-to-r from-[#D2C693] to-[#928346] text-white py-3 rounded mb-20 cursor-pointer"
			>
				매매일지 기록하기
			</button>
		</form>
	);
}
