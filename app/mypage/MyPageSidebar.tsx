"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomModal from "../components/CustomModal";
import ResetPasswordAuthModal from "./ResetPasswordAuthModal";
import InvestmentTypeChangeModal from "./InvestmentTypeChangeModal";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";
import { UserStatus } from "../mocks/status";

import { useProfileImage } from "./useProfileImage";
import ProfileSection from "./ProfileSection";
import AccountInfoSection from "./AccountInfoSection";
import MenuSection from "./MenuSection";
import LogoutSection from "./LogoutSection";

type UserData = {
	name: string;
	username: string;
	email: string;
	phone?: string;
	// profileImage?: string | null;
	myProfileImage?: string | null;
	trainerProfileImage?: string | null;
	investmentType: string;
	userStatus: UserStatus;
	exchangeName: string;
	uid: string;
	trainerId: number | null;
	trainerName: string | null;
	isCourseCompleted: boolean;
	isPremium: boolean;
	paymentMethod: string;
	remainingToken?: number;
};

type Props = { userData: UserData };

export default function MyPageSidebar({ userData }: Props) {
	const router = useRouter();
	const { logout } = useAuthStore();
	const { deleteUser } = useAuth();

	// 프로필 이미지 훅
	const { profileImage, handleProfileImageChange, uploading } = useProfileImage(userData?.myProfileImage);

	// 모달 상태 관리
	const [openModal, setOpenModal] = useState<null | "uid" | "type">(null);
	const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);

	// 로그아웃 / 탈퇴
	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	const handleDeleteUser = async () => {
		if (confirm("정말로 탈퇴하시겠습니까?\n모든 데이터가 삭제됩니다.")) {
			await deleteUser();
		}
	};

	return (
		<aside className="w-full md:w-64 bg-[#0f172a] text-white flex flex-col md:flex-col py-6 md:py-10 relative md:sticky md:top-0">
			<div className="flex flex-col md:items-center gap-6 md:gap-3 md:mb-8 p-3">
				<ProfileSection
					name={userData.name}
					profileImage={profileImage}
					onChange={handleProfileImageChange}
					uploading={uploading}
					remainingToken={userData.remainingToken}
				/>

				<AccountInfoSection email={userData.email} phone={userData.phone} />

				<MenuSection
					onPasswordChange={() => setResetPasswordModalOpen(true)}
					onUidClick={() => setOpenModal("uid")}
					onTypeChange={() => setOpenModal("type")}
				/>
			</div>

			<LogoutSection onLogout={handleLogout} onWithdraw={handleDeleteUser} />

			{resetPasswordModalOpen && (
				<ResetPasswordAuthModal
					isOpen={resetPasswordModalOpen}
					onClose={() => setResetPasswordModalOpen(false)}
				/>
			)}

			{/* UID 관리 */}
			<CustomModal variant={1} isOpen={openModal === "uid"} onClose={() => setOpenModal(null)} width="max-w-xl">
				<h2 className="text-lg mb-4 font-semibold">UID 관리</h2>
				<div className="space-y-2 text-sm text-gray-200">
					<p>거래소명: {userData.exchangeName}</p>
					<p>UID: {userData.uid}</p>
				</div>
			</CustomModal>

			{/* 투자유형 변경 */}
			<InvestmentTypeChangeModal
				isOpen={openModal === "type"}
				onClose={() => setOpenModal(null)}
				currentType={userData.investmentType}
			/>
		</aside>
	);
}
