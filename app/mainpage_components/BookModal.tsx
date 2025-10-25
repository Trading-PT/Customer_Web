"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CustomModal from "../components/CustomModal";
import CustomDivider from "../components/CustomDivider";
import { consultationAPI } from "../lib/api";
import type { SlotAvailabilityDTO } from "../lib/api/apiTypes";

type TimeSlot = {
	time: string;
	available: boolean;
};

type ReservationProps = {
	onClose: () => void; // 부모가 내려줄 닫기 함수
};

export default function Reservation({ onClose }: ReservationProps) {
	const router = useRouter();

	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
	const [isLoadingSlots, setIsLoadingSlots] = useState(false);

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const back = () => {
		setIsModalOpen(false);
		router.push("/");
	};

	// 시간 슬롯을 시간 문자열로 변환하는 함수
	const convertSlotToTime = (slot: string): string => {
		const hour = slot.replace("H", "");
		return `${hour}:00`;
	};

	// 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
	const formatDateForAPI = (date: Date): string => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	// 날짜 선택 시 해당 날짜의 상담 가능 시간대 조회
	useEffect(() => {
		if (!selectedDate) return;

		const fetchAvailableSlots = async () => {
			setIsLoadingSlots(true);
			try {
				const dateStr = formatDateForAPI(selectedDate);
				const response = await consultationAPI.getAvailableSlots(dateStr);

				if (response.success && response.data) {
					// API 응답을 TimeSlot 타입으로 변환
					const slots: TimeSlot[] = response.data.map((slot: SlotAvailabilityDTO) => ({
						time: convertSlotToTime(slot.timeSlot),
						available: slot.available,
					}));
					setTimeSlots(slots);
				} else {
					console.error("상담 가능 시간대 조회 실패:", response.message);
					// 실패 시 빈 배열로 설정
					setTimeSlots([]);
				}
			} catch (error) {
				console.error("상담 가능 시간대 조회 중 오류:", error);
				setTimeSlots([]);
			} finally {
				setIsLoadingSlots(false);
			}
		};

		fetchAvailableSlots();
	}, [selectedDate]);

	const handleReserve = async () => {
		if (!selectedDate || !selectedTime) return;

		try {
			const dateStr = formatDateForAPI(selectedDate);
			// 시간을 HH:MM:SS 형식으로 변환
			const timeStr = `${selectedTime}:00`;

			const response = await consultationAPI.createConsultation({
				date: dateStr,
				time: timeStr,
			});

			if (response.success) {
				console.log("상담 예약 성공:", response.data);
				setIsModalOpen(true);
			} else {
				console.error("상담 예약 실패:", response.message);
				alert(`상담 예약에 실패했습니다: ${response.message}`);
			}
		} catch (error) {
			console.error("상담 예약 중 오류:", error);
			alert("상담 예약 중 오류가 발생했습니다. 다시 시도해주세요.");
		}
	};

	const formatDate = (date: Date) => {
		return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
	};

	return (
		<div className="flex flex-col max-w-2xl mx-auto p-4 sm:p-6 gap-10 sm:gap-20">
			{/* 상단 타이틀 */}
			<div className="flex flex-col w-full gap-5 relative">
				<div className="flex gap-3 w-full items-center justify-center">
					<Image
						src="/images/logo_main.png"
						alt="logo"
						width={30}
						height={30}
						className="object-contain"
					/>
					<h3 className="text-xl sm:text-2xl font-bold text-gray-900">
						상담 예약
					</h3>

					{/* 닫기 버튼 */}
					<button
						onClick={onClose}
						className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 cursor-pointer"
					>
						✕
					</button>
				</div>
				<CustomDivider />

				{/* 날짜 선택 */}
				<h4 className="text-lg sm:text-2xl mt-6 sm:mt-10 mb-2 font-semibold text-gray-900">
					1. 상담 날짜를 선택해주세요.
				</h4>
				<div className="flex flex-col items-start gap-6 mb-6">
					<div className="w-full">
						<Calendar
							onChange={(date) => {
								setSelectedDate(date as Date);
								setSelectedTime(null); // 날짜 바꾸면 시간 초기화
							}}
							value={selectedDate}
							minDate={new Date()}
							className="rounded-md w-full"
						/>
					</div>
					<div>
						<p className="text-sm text-gray-800 md:text-gray-600 font-medium md:font-normal">
							선택하신 날짜:
						</p>
						<p className="text-base sm:text-lg text-gray-900 md:text-gray-700 font-semibold md:font-normal">
							{selectedDate ? formatDate(selectedDate) : "날짜를 선택해주세요."}
						</p>
					</div>
				</div>
			</div>

			{/* 시간 선택 */}
			<div className="flex flex-col w-full gap-3">
				<h2 className="text-lg sm:text-2xl mb-2 font-semibold text-gray-900">
					2. 상담 시간을 선택해주세요.
				</h2>
				<p className="text-sm text-gray-800 md:text-gray-500 font-medium md:font-normal mb-4">
					상담은 유선으로 진행되며, 약 1시간 소요됩니다.
				</p>

				<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
					{isLoadingSlots ? (
						<div className="col-span-2 sm:col-span-3 text-center py-8 text-gray-500">
							상담 가능 시간대를 불러오는 중...
						</div>
					) : timeSlots.length === 0 ? (
						<div className="col-span-2 sm:col-span-3 text-center py-8 text-gray-500">
							날짜를 선택하면 상담 가능 시간대가 표시됩니다.
						</div>
					) : (
						timeSlots.map(({ time, available }) => (
							<button
								key={time}
								disabled={!available}
								onClick={() => setSelectedTime(time)}
								className={`rounded-md border px-4 py-2 text-sm font-medium transition-all
                ${!available
										? "text-gray-400 bg-gray-300 cursor-not-allowed"
										: selectedTime === time
											? "bg-indigo-100 border-indigo-400 text-indigo-600 cursor-pointer"
											: "border-gray-300 text-gray-800 hover:bg-gray-100"
									}`}
							>
								{time < "12:00" ? `오전 ${time}` : `오후 ${time}`}
							</button>
						))
					)}
				</div>
			</div>

			{/* 선택한 일시 안내 */}
			{selectedDate && selectedTime && (
				<div className="border-t pt-4 mb-6">
					<p className="mb-2 text-gray-900 md:text-gray-700 font-medium md:font-normal">
						선택하신 상담 일시는{" "}
						<span className="font-semibold">
							{formatDate(selectedDate)}{" "}
							{selectedTime < "12:00" ? "오전" : "오후"} {selectedTime}
						</span>{" "}
						입니다.
					</p>
					<p className="text-sm text-gray-800 md:text-gray-500 font-medium md:font-normal">
						트레이너가 상담 일시에 맞추어 전화를 드릴 예정입니다.
					</p>
				</div>
			)}

			{/* 상담 신청 버튼 */}
			<button
				onClick={handleReserve}
				disabled={!selectedDate || !selectedTime}
				className={`w-full rounded-md py-3 text-base font-semibold transition-all
          ${selectedDate && selectedTime
						? "bg-indigo-200 text-[#2626C3] hover:bg-indigo-300 cursor-pointer"
						: "bg-gray-200 text-gray-500 cursor-not-allowed"
					}`}
			>
				상담 신청하기
			</button>

			{/* 완료 모달 */}
			<CustomModal variant={1} isOpen={isModalOpen} onClose={closeModal} width="auto">
				<div className="bg-white p-6 w-full text-center">
					<p className="font-semibold text-lg mb-4">전화 상담 신청이 완료되었습니다.</p>
					<p className="text-sm text-gray-700 mb-4">
						선택하신 일시에 고객님의 연락처로 전화를 드릴 예정입니다.
						<br />
						<br />
						일정 변동이 있으신 경우
						<br />
						마이페이지에서 상담 일시를 변경하실 수 있습니다.
					</p>
					<button
						onClick={back}
						className="mt-4 px-4 py-2 rounded-md bg-indigo-200 cursor-pointer hover:bg-indigo-300"
					>
						확인
					</button>
				</div>
			</CustomModal>
		</div>
	);
}
