// components/SocialLoginButtons.tsx
import CustomButton from "../components/CustomButton";

interface Props {
	onKakao: () => void;
	onNaver: () => void;
	disabled?: boolean;
}

export default function SocialLoginButtons({ onKakao, onNaver, disabled }: Props) {
	return (
		<div className="flex flex-col gap-2 w-full">
			<CustomButton
				className="bg-yellow-300 text-black px-2 py-2 rounded-lg"
				onClick={onKakao}
				disabled={disabled}
			>
				카카오 로그인
			</CustomButton>
			<CustomButton
				variant="normalFull"
				bgColor="bg-green-500"
				textColor="text-white"
				onClick={onNaver}
				disabled={disabled}
			>
				네이버 로그인
			</CustomButton>
		</div>
	);
}
