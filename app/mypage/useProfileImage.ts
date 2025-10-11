"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";

export function useProfileImage(initialUrl?: string | null) {
	const [profileImage, setProfileImage] = useState<string>(
		initialUrl || "/images/defaultImg.png"
	);
	const [uploading, setUploading] = useState(false);
	const { updateProfileImage } = useAuth();

	const handleProfileImageChange = async (file: File) => {
		const previewUrl = URL.createObjectURL(file);
		setProfileImage(previewUrl);
		setUploading(true);

		try {
			const res = await updateProfileImage(file);
			if (!res.success) {
				alert("이미지 업로드 실패: " + (res.error || ""));
			}
		} catch (e) {
			console.error("이미지 업로드 중 오류:", e);
		} finally {
			setUploading(false);
		}
	};

	return { profileImage, handleProfileImageChange, uploading };
}
