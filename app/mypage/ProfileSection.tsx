"use client";
import ProfileImageUploader from "./profileImageUploader";
import { Coins } from "lucide-react";

interface Props {
	name: string;
	profileImage: string;
	onChange: (file: File) => void;
	uploading: boolean;
	remainingToken?: number;
}

export default function ProfileSection({ name, profileImage, onChange, uploading, remainingToken }: Props) {
	return (
		<div className="flex flex-col items-center gap-2">
			<ProfileImageUploader profileImage={profileImage} onChange={onChange} />
			<span className="font-semibold text-base md:text-lg">{name} 님</span>
			{uploading && <p className="text-xs text-gray-400">이미지 업로드 중...</p>}

			{/* 토큰 개수 표시 */}
			{remainingToken !== undefined && (
				<div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#D2C693] to-[#928346] rounded-full">
					<Coins size={16} className="text-white" />
					<span className="text-sm font-semibold text-white">
						{remainingToken}개
					</span>
				</div>
			)}
		</div>
	);
}
