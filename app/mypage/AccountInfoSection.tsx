"use client";
import { Mail, Phone } from "lucide-react";

interface Props {
	email: string;
	phone?: string;
}

export default function AccountInfoSection({ email, phone }: Props) {
	return (
		<div className="bg-white/10 rounded-lg px-4 py-3 w-full md:w-52 text-xs md:text-sm">
			<p className="flex items-center gap-2">
				<Mail size={16} /> {email}
			</p>
			<p className="flex items-center gap-2 mt-1">
				<Phone size={16} /> {phone || "등록된 전화번호가 없어요."}
			</p>
		</div>
	);
}
