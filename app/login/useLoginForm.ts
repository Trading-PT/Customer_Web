// hooks/useLoginForm.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";

export const useLoginForm = () => {
	const router = useRouter();
	const { login, isLoading } = useAuth();

	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");
	const [checked, setChecked] = useState(false);
	const [error, setError] = useState("");
	const [showErrorModal, setShowErrorModal] = useState(false);

	const handleLogin = async () => {
		if (!userId || !password) {
			setError("아이디와 비밀번호를 입력해주세요.");
			setShowErrorModal(true);
			return;
		}

		const result = await login({
			username: userId,
			password,
			rememberMe: checked,
		});

		if (result.success) {
			// 로그인 성공 후 사용자 정보 가져오기
			await useAuthStore.getState().checkAuth();
			router.push("/");
		} else {
			setError(result.error || "로그인에 실패했습니다.");
			setShowErrorModal(true);
		}
	};

	return {
		userId,
		setUserId,
		password,
		setPassword,
		checked,
		setChecked,
		error,
		showErrorModal,
		setShowErrorModal,
		isLoading,
		handleLogin,
	};
};
