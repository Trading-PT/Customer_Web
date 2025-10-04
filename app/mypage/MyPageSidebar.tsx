"use client";

import { useRouter } from "next/navigation";
import {
	Mail,
	Phone,
	Lock,
	CreditCard,
	IdCard,
	LogOut,
	Headphones,
	Trash2,
	Replace,
} from "lucide-react";
import ProfileImageUploader from "./profileImageUploader";
import { useState } from "react";
import CustomModal from "../components/CustomModal"; // variant={1}
import { useAuthStore } from "../stores/authStore";
import { useAuth } from "../hooks/useAuth";
import ResetPasswordAuthModal from "./ResetPasswordAuthModal";

type Props = {
	name: string;
	email: string;
	phone: string;
};

export default function MyPageSidebar({ name, email, phone }: Props) {
	const router = useRouter();
	const [profileImage, setProfileImage] = useState<string | null>(null);

	// Modal 상태 관리
	const [openModal, setOpenModal] = useState<null | "password" | "uid" | "type" | "withdraw">(null);
	const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);

	// authStore
	const { logout } = useAuthStore();
	const { deleteUser } = useAuth();

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	const handleDeleteUser = async () => {
		const confirmed = window.confirm(
			"정말로 탈퇴하시겠습니까?\n탈퇴하시면 보유 데이터가 전부 삭제됩니다."
		);

		if (!confirmed) return;

		await deleteUser();
	};


	const handleProfileImageChange = (file: File) => {
		const imageUrl = URL.createObjectURL(file);
		setProfileImage(imageUrl);
	};

	return (
		<aside
			className="
		w-full md:w-64 
		bg-[#0f172a] text-white 
		flex flex-col md:flex-col 
		py-6 md:py-10
		relative md:sticky md:top-0
	"
		>
			{/* 모바일에서는 row, 데스크탑에서는 column */}
			<div className="flex flex-col md:flex-col md:items-center md:flex-1 gap-6 md:gap-3 md:mb-8 p-3">
				{/* 프로필 */}
				<div className="flex flex-col items-center gap-2">
					<ProfileImageUploader profileImage={profileImage} onChange={handleProfileImageChange} />
					<span className="font-semibold text-base md:text-lg">{name} 님</span>
				</div>

				{/* 계정 정보 */}
				<div
					className="
				bg-white/10 rounded-lg 
				px-4 py-3 
				w-full md:w-52 
				text-xs md:text-sm
			"
				>
					<p className="flex items-center gap-2">
						<Mail size={16} /> {email}
					</p>
					<p className="flex items-center gap-2 mt-1">
						<Phone size={16} /> {phone}
					</p>
				</div>

				{/* 메뉴 */}
				<nav className="flex flex-col gap-2 md:gap-3 w-full md:w-52 text-xs md:text-sm">
					<button onClick={() => setResetPasswordModalOpen(true)} className="flex items-center gap-2 cursor-pointer">
						<Lock size={16} /> 비밀번호 변경
					</button>
					<button onClick={() => router.push("/mypayment")} className="flex items-center gap-2 cursor-pointer">
						<CreditCard size={16} /> 결제수단 관리
					</button>
					<button onClick={() => setOpenModal("uid")} className="flex items-center gap-2 cursor-pointer">
						<IdCard size={16} /> UID 관리
					</button>
					<button onClick={() => setOpenModal("type")} className="flex items-center gap-2 cursor-pointer">
						<Replace size={16} /> 투자유형 변경
					</button>
				</nav>
			</div>

			{/* 로그아웃 및 기타 */}
			<div
				className="
			flex flex-row md:flex-col 
			justify-around md:justify-start 
			items-center gap-4 md:gap-3 
			w-full md:w-52 mt-6 md:mt-auto
		"
			>
				<button onClick={handleLogout} className="flex items-center gap-2 text-xs md:text-sm cursor-pointer">
					<LogOut size={16} /> LOG OUT
				</button>
				<button
					onClick={() => router.push('/customercenter')}
					className="flex items-center gap-2 text-xs md:text-sm cursor-pointer"
				>
					<Headphones size={16} /> 고객센터
				</button>
				<button
					onClick={handleDeleteUser}
					className="flex items-center gap-2 text-xs md:text-sm text-red-400 cursor-pointer"
				>
					<Trash2 size={16} /> 회원 탈퇴
				</button>
			</div>

			{/* 모달 관리 */}
			<CustomModal variant={1} isOpen={openModal === "password"} onClose={() => setOpenModal(null)} width="max-w-xl">
				<h2 className="text-lg mb-4">비밀번호 변경</h2>
				<p>비밀번호 변경 기능 구현</p>
			</CustomModal>

			{resetPasswordModalOpen && (
				<ResetPasswordAuthModal
					isOpen={resetPasswordModalOpen}
					onClose={() => setResetPasswordModalOpen(false)}
				/>
			)}

			<CustomModal variant={1} isOpen={openModal === "uid"} onClose={() => setOpenModal(null)} width="max-w-xl">
				<h2 className="text-lg mb-4">UID 관리</h2>
				<p>UID 관리 기능 구현</p>
			</CustomModal>

			<CustomModal variant={1} isOpen={openModal === "type"} onClose={() => setOpenModal(null)} width="max-w-xl">
				<h2 className="text-lg mb-4">투자유형 변경</h2>
				<p>투자유형 변경 기능 구현</p>
			</CustomModal>

			<CustomModal variant={1} isOpen={openModal === "withdraw"} onClose={() => setOpenModal(null)} width="max-w-xl">
				<p className="text-center">정말로 회원 탈퇴하시겠습니까?</p>
			</CustomModal>
		</aside>
	);
}
