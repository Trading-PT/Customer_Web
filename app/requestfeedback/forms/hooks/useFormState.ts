"use client";
import { useState, useEffect, useCallback } from "react";

export function useFormState(riskTaking: number = 5) {
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

	// 입력 핸들러
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// 파일 핸들러
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setScreenshot(file);
			setScreenshotPreview(URL.createObjectURL(file));
		}
	};

	const handleWeekChange = useCallback((data: { month: number; week: number }) => {
		setForm((prev) => ({ ...prev, month: data.month, week: data.week }));
	}, []);

	return {
		form,
		setForm,
		screenshot,
		screenshotPreview,
		handleChange,
		handleFileChange,
		handleWeekChange,
		position,
		setPosition,
		isPositive,
		setIsPositive,
		pl,
		setPl,
		rr,
	};
}
