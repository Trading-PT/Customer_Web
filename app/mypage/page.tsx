"use client";
import { useEffect, useState } from "react";
import MyPageSidebar from "./MyPageSidebar";
import MyPageMain from "./MyPageMain";
import MyPageSidebarSkeleton from "./MyPageSidebarSkeleton";

import { UserStatus } from "../mocks/status";
import { useAuth } from "../hooks/useAuth";

// "UID_REVIEW_PENDING"
// "UID_REJECTED"
// "UID_APPROVED"
// "PAID_BEFORE_TEST"
// "PAID_AFTER_TEST_TRAINER_ASSIGNING"
// "TRAINER_ASSIGNED"

// mockData
const state: UserStatus = "UID_APPROVED"; // 바꿔가면서 테스트
// 로그인한 계정의 status에 따라 바뀌도록 수정할 것 

// mockData
const mockUser = {
	name: "김개똥",
	email: "apple123@gmail.com",
	phone: "010-1234-5678",
	profileImage: null,
};

export default function MyPage() {

	const { myInfo } = useAuth();
	const [userData, setUserData] = useState<{
		name: string; // 이름 
		username: string, // 닉네임 
		email: string;
		phone?: string;
		myProfileImage?: string | null;
		trainerProfileImage?: string | null;

		investmentType: string, // 투자 유형 
		userStatus: UserStatus, // 사용자 상태
		exchangeName: string, // 거래소 이름 
		uid: string, // UID

		trainerId: number | null, // 구독 X인 경우 트레이너 없음 
		trainerName: string | null,

		isCourseCompleted: boolean, // 완강 여부
		isPremium: boolean, // 구독 고객인지 여부 

		paymentMethod: string // 결제수단 
	} | null>(null);

	useEffect(() => {
		const fetchUserInfo = async () => {
			const res = await myInfo();
			console.log("마이페이지 내 정보:", res);

			if (res && res.data) {
				setUserData({
					name: res.data.name,
					username: res.data.username,
					email: res.data.email,
					phone: res.data.phoneNumber,
					myProfileImage: res.data.myProfileImage ?? null,
					trainerProfileImage: res.data.trainerProfileImage ?? null,

					investmentType: res.data.investmentType,
					userStatus: res.data.userStatus as UserStatus,
					exchangeName: res.data.exchangeName,
					uid: res.data.uid,

					trainerId: res.data.trainerId,
					trainerName: res.data.trainerNAme,

					isCourseCompleted: res.data.isCourseCompleted,
					isPremium: res.data.isPremium,
					paymentMethod: res.data.paymentMethod,
				});
			}
		};

		fetchUserInfo();
	}, []);

	return (
		<div className="flex bg-white flex-col md:flex-row h-auto md:h-screen">
			{/* 테스트용으로, 위의 mockData 바꿔서 볼 수 있는 컴포넌트입니다 */}
			{/* <MyPageSidebar name={mockUser.name} email={mockUser.email} phone={mockUser.phone} /> */}

			{/* 로그인한 계정의 실제 status에 따른 컴포넌트입니다 */}
			{userData ? (
				<MyPageSidebar
					userData={userData}
				/>
			) : (
				<MyPageSidebarSkeleton />
			)}

			{/* 테스트용으로, 위의 mockData 바꿔서 볼 수 있는 컴포넌트입니다 */}
			<MyPageMain state={state} />

			{/* 로그인한 계정의 실제 status에 따른 컴포넌트입니다 */}
			{/* {userData && <MyPageMain state={userData.userStatus} />} */}
			{/* {userData && <MyPageMain state={userData.userStatus} userData={userData} />} <-- 나중에 */}
		</div>
	);
}
