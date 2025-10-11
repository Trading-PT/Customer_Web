"use client";
import { Lock, CreditCard, IdCard, Replace } from "lucide-react";

interface Props {
	onPasswordChange: () => void;
	onUidClick: () => void;
	onTypeChange: () => void;
}

export default function MenuSection({ onPasswordChange, onUidClick, onTypeChange }: Props) {
	return (
		<nav className="flex flex-col gap-2 md:gap-3 w-full md:w-52 text-xs md:text-sm">
			<button onClick={onPasswordChange} className="flex items-center gap-2 cursor-pointer">
				<Lock size={16} /> 비밀번호 변경
			</button>
			<button onClick={() => location.assign("/mypayment")} className="flex items-center gap-2 cursor-pointer">
				<CreditCard size={16} /> 결제수단 관리
			</button>
			<button onClick={onUidClick} className="flex items-center gap-2 cursor-pointer">
				<IdCard size={16} /> UID 관리
			</button>
			<button onClick={onTypeChange} className="flex items-center gap-2 cursor-pointer">
				<Replace size={16} /> 투자유형 변경
			</button>
		</nav>
	);
}
