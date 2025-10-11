"use client";
import React from "react";
import WeekSelector from "../../WeekSelector";

interface FormHeaderProps {
	investmentType: "SWING" | "DAY" | "SCALPING";
	userLevel: "BASIC" | "PREMIUM";
	completion: "BEFORE_COMPLETION" | "AFTER_COMPLETION";
	onWeekChange?: (data: { month: number; week: number }) => void;
}

const investmentTypeMap = {
	SWING: { label: "스윙", color: "bg-orange-400" },
	DAY: { label: "데이", color: "bg-green-400" },
	SCALPING: { label: "스켈핑", color: "bg-sky-400" },
};

const FormHeader: React.FC<FormHeaderProps> = ({
	investmentType,
	userLevel,
	completion,
	onWeekChange,
}) => {
	const investment = investmentTypeMap[investmentType];
	let completionLabel = "무료";

	if (userLevel === "PREMIUM" && completion === "BEFORE_COMPLETION") completionLabel = "완강 전";
	if (userLevel === "PREMIUM" && completion === "AFTER_COMPLETION") completionLabel = "완강 후";

	return (
		<div className="flex items-center gap-3 mb-6">
			<span className={`px-3 py-1 text-white rounded ${investment.color}`}>
				{investment.label}
			</span>
			<span className="px-3 py-1 border rounded">{completionLabel}</span>
			{investmentType === "SWING" && onWeekChange && (
				<WeekSelector onChange={onWeekChange} />
			)}
		</div>
	);
};

export default React.memo(FormHeader);
