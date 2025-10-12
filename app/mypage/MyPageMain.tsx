// components/mypage/MyPageMain.tsx
"use client";
import { useState } from "react";
import CustomCalendar from "./calander";
import { CalendarProps } from "react-calendar";
import BottomNotion from "./bottomNotion";
import StatusWrapper from "./StatusWrapper";
import InvitationCard from "./InvitationCard";
import TrainerInfo from "./trainerInfo";
import RequestFeedbackButton from "./RequestFeedbackButton";

import UIDPending from "./status/UIDPending";
import UIDRejected from "./status/UIDRejected";
import UIDApproved from "./status/UIDApproved";
import PaidBeforeTest from "./status/PaidBeforeText";
import PaidAfterTestTrainerAssigning from "./status/PaidAfterTestTrainerAssigning";
import TrainerAssigned from "./status/TrainerAssigned";

import { UserStatus } from "../mocks/status";
import { RENDER_RULES } from "./constants/userStatusRules";
import BasicFeedbackButton from "./BasicFeedbackButton";

type Props = {
	state: UserStatus;
};

type Value = CalendarProps["value"];

export default function MyPageMain({ state }: Props) {
	// basic_available은 무료 고객이 쓸 수 있는 기능의 보여짐 여부를 제어하기 위한 변수
	// premium_available은 유료 고객이 쓸 수 있는 기능의 보여짐 여부를 제어하기 위한 변수 
	// message는 기능이 보여지지 못할 떄 표시할 안내 문구 

	// false일 때 blur, true 일 때 visible 
	const { basic_available, premium_available, message } = RENDER_RULES[state];
	const [date, setDate] = useState<Value>(new Date());

	const renderMainContent = () => {
		switch (state) {
			case "UID_REVIEW_PENDING":
				return <UIDPending />;
			case "UID_REJECTED":
				return <UIDRejected />;
			case "UID_APPROVED":
				return <UIDApproved />;
			case "PAID_BEFORE_TEST":
				return <PaidBeforeTest />;
			case "PAID_AFTER_TEST_TRAINER_ASSIGNING":
				return <PaidAfterTestTrainerAssigning />;
			case "TRAINER_ASSIGNED":
				return <TrainerAssigned />;
			default:
				return <div>알 수 없는 상태입니다.</div>;
		}
	};

	return (
		<main className="flex-1 p-4 sm:p-6 md:p-10 overflow-visible md:overflow-y-auto md:max-h-screen">
			<div className="max-w-2xl mx-auto text-center gap-5">
				{renderMainContent()}

				{/* 레벨테스트가 끝나고 트레이너 배정 대기 중 또는 배정 완료 이후에만 보임  */}
				{(state == "PAID_AFTER_TEST_TRAINER_ASSIGNING" || state == "TRAINER_ASSIGNED") && (
					<div className="flex flex-col w-full gap-10 mt-10 items-start">
						<TrainerInfo state={state} />
						<StatusWrapper type="premium" basic_available={basic_available} premium_available={premium_available} message={message}>
							<RequestFeedbackButton />
						</StatusWrapper>
					</div>
				)}

				{/* (blur 상태로) 레벨테스트 실시 전에만 보임 */}
				{state == "PAID_BEFORE_TEST" && (
					<StatusWrapper type="premium" basic_available={basic_available} premium_available={premium_available} message={message}>
						<div className="flex flex-col w-full gap-10 mt-10">
							<TrainerInfo state={state} />
							<RequestFeedbackButton />
						</div>
					</StatusWrapper>
				)}

				{/* UID 승인 이후에만 보임*/}
				<StatusWrapper type="basic" basic_available={basic_available} premium_available={premium_available} message={message}>
					{/* (blur 아래에서) UID 승인 대기, UID 거절 시에만 보임 */}
					{(state == "UID_REVIEW_PENDING" || state == "UID_REJECTED") && (
						<InvitationCard />
					)}
					<div className="w-full flex items-center justify-center p-3 mt-10 mb-10">
						<CustomCalendar value={date} onChange={setDate} />
					</div>
					<BottomNotion />
				</StatusWrapper>

				{state == "UID_APPROVED" && (<BasicFeedbackButton />)}
				{/* <BasicFeedbackButton /> */}
			</div>
		</main>
	);
}
