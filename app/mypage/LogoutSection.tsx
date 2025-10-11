"use client";
import { LogOut, Headphones, Trash2 } from "lucide-react";

interface Props {
	onLogout: () => void;
	onWithdraw: () => void;
}

export default function LogoutSection({ onLogout, onWithdraw }: Props) {
	return (
		<div className="flex flex-row md:flex-col justify-around md:justify-start items-center gap-4 md:gap-3 w-full md:w-52 mt-6 md:mt-auto">
			<button onClick={onLogout} className="flex items-center gap-2 text-xs md:text-sm cursor-pointer">
				<LogOut size={16} /> LOG OUT
			</button>
			<button onClick={() => location.assign("/customercenter")} className="flex items-center gap-2 text-xs md:text-sm cursor-pointer">
				<Headphones size={16} /> 고객센터
			</button>
			<button onClick={onWithdraw} className="flex items-center gap-2 text-xs md:text-sm text-red-400 cursor-pointer">
				<Trash2 size={16} /> 회원 탈퇴
			</button>
		</div>
	);
}
