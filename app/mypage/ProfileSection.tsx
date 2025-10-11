"use client";
import ProfileImageUploader from "./profileImageUploader";

interface Props {
	name: string;
	profileImage: string;
	onChange: (file: File) => void;
	uploading: boolean;
}

export default function ProfileSection({ name, profileImage, onChange, uploading }: Props) {
	return (
		<div className="flex flex-col items-center gap-2">
			<ProfileImageUploader profileImage={profileImage} onChange={onChange} />
			<span className="font-semibold text-base md:text-lg">{name} 님</span>
			{uploading && <p className="text-xs text-gray-400">이미지 업로드 중...</p>}
		</div>
	);
}
