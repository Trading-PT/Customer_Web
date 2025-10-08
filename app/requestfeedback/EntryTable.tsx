"use client";

import CustomModal from "../components/CustomModal";

type EntryTableProps = {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (data: { target: string; grade: string }) => void;
};

export default function EntryTable({ isOpen, onClose, onSelect }: EntryTableProps) {
	const rows = [
		{ name: "Reverse", color: "text-red-500", grades: ["S", "A", "B", "C", "*"] },
		{ name: "Pull back", color: "text-blue-500", grades: ["S+", "S", "A", "B", "C"] },
		{ name: "Break out", color: "text-green-600", grades: ["A", "B", "*"] },
	];

	// 선택된 값을 서버 전송용 포맷으로 변환하는 함수
	const normalizeValue = (target: string, grade: string) => {
		let normalizedTarget = target
			.toUpperCase()
			.replace(/\s+/g, "_") // 공백 → _
			.replace("BREAKOUT", "BREAK_OUT") // "Break out" 보정
			.replace("PULLBACK", "PULL_BACK"); // "Pull back" 보정

		let normalizedGrade = grade
			.toUpperCase()
			.replace("+", "_PLUS") // S+ → S_PLUS
			.replace("*", "NONE") // * → NONE
			.replace("C", "NONE"); // C → NONE

		return { target: normalizedTarget, grade: normalizedGrade };
	};

	return (
		<CustomModal isOpen={isOpen} onClose={onClose} variant={1}>
			<div className="p-4">
				<h2 className="text-lg font-bold mb-4">타겟 / 등급 선택</h2>
				<table className="w-full border-collapse border border-gray-300 text-center">
					<thead>
						<tr className="bg-gray-100">
							<th className="border border-gray-300 px-4 py-2">타점</th>
							<th className="border border-gray-300 px-4 py-2">등급</th>
							<th className="border border-gray-300 px-4 py-2"></th>
							<th className="border border-gray-300 px-4 py-2"></th>
							<th className="border border-gray-300 px-4 py-2"></th>
							<th className="border border-gray-300 px-4 py-2"></th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row, rowIndex) => (
							<tr key={rowIndex}>
								{/* 타점 */}
								<td className={`border border-gray-300 px-4 py-2 font-semibold ${row.color}`}>
									{row.name}
								</td>
								{/* 버튼들 */}
								{Array.from({ length: 5 }).map((_, colIndex) => {
									const grade = row.grades[colIndex];
									return (
										<td key={colIndex} className="border border-gray-300 px-4 py-2">
											{grade ? (
												<button
													onClick={() => {
														const normalized = normalizeValue(row.name, grade);
														onSelect(normalized);
														onClose();
													}}
													className="px-3 py-1 rounded bg-gray-100 transition cursor-pointer hover:bg-gray-200"
												>
													{grade}
												</button>
											) : (
												"-"
											)}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</CustomModal>
	);
}
