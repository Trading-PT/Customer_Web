// components/FindIdModal.tsx
import { useState } from "react";
import CustomInputField from "../components/CustomInputField";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import { authAPI } from "../lib/api/auth";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export default function FindIdModal({ isOpen, onClose }: Props) {
	const [email, setEmail] = useState("");
	const [foundId, setFoundId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleFindId = async () => {
		if (!email) return;
		try {
			setLoading(true);
			const res = await authAPI.findIdByEmail(email);
			setFoundId(
				res.success && res.data?.userName
					? `당신의 아이디는: ${res.data.userName}`
					: "해당 이메일로 등록된 아이디가 없습니다."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<CustomModal isOpen={isOpen} onClose={onClose} variant={1} width="w-2xl">
			<div className="p-6 flex flex-col gap-4">
				<CustomInputField
					variant={0}
					id="findIdEmail"
					label="이메일"
					placeholder="가입 시 등록한 이메일을 입력하세요"
					value={email}
					onChange={setEmail}
					type="email"
					required
				/>
				<CustomButton
					variant="prettyFull"
					onClick={handleFindId}
					disabled={loading}
					width="w-full"
				>
					{loading ? "조회 중..." : "아이디 찾기"}
				</CustomButton>
				{foundId && <p className="text-center text-gray-700 mt-2">{foundId}</p>}
			</div>
		</CustomModal>
	);
}
