"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NotionPageButton from "../components/NotionPageButton";
import { CustomDropdownButton } from "../components/CustomDropdown";
import { tradingAPI } from "../lib/api";

export default function BottomNotion() {
	const router = useRouter();

	// 드롭다운 연도 옵션
	const yearOptions = ["2025", "2024", "2023"];
	const [selectedYear, setSelectedYear] = useState("2025");
	const [monthList, setMonthList] = useState<number[]>([]);
	const [loading, setLoading] = useState(false);

	// 연도별 월 목록 조회
	useEffect(() => {
		const fetchMonthList = async () => {
			setLoading(true);
			try {
				const response = await tradingAPI.getYearlyMonths(parseInt(selectedYear));
				if (response.success && response.data) {
					// 월 목록 추출 (API 응답의 months 배열에서 month 값만 추출)
					const months = response.data.months.map((item) => item.month);
					setMonthList(months);
				} else {
					console.error("월 목록 조회 실패:", response.error);
					setMonthList([]);
				}
			} catch (error) {
				console.error("월 목록 조회 에러:", error);
				setMonthList([]);
			} finally {
				setLoading(false);
			}
		};

		fetchMonthList();
	}, [selectedYear]);

	return (
		<div className="w-full flex flex-col items-start">
			{/* 제목 */}
			<h2 className="text-xl mb-6">월간 매매일지</h2>

			{/* 드롭다운 */}
			<div className="mb-6">
				<CustomDropdownButton
					options={yearOptions}
					defaultValue={selectedYear}
					onSelect={(value) => setSelectedYear(value)}
				/>
			</div>

			{/* 버튼 리스트 */}
			{loading ? (
				<div className="w-full text-center py-4">로딩 중...</div>
			) : monthList.length > 0 ? (
				<div className="flex flex-col gap-2 w-full">
					{monthList.map((month) => (
						<NotionPageButton
							key={month}
							number={month}
							text="월간 매매일지"
							onClick={() =>
								router.push(`/monthfeedback?year=${selectedYear}&month=${month}`)
							}
						/>
					))}
				</div>
			) : (
				<div className="w-full text-center py-4 text-gray-500">
					해당 연도에 매매일지가 없습니다.
				</div>
			)}
		</div>
	);
}
