"use client";

interface Props {
	onKakao: () => void;
	onNaver: () => void;
	disabled?: boolean;
}

export default function SocialLoginButtons({ onKakao, onNaver, disabled }: Props) {
	return (
		<div className="flex gap-1 w-full">

			<button
				onClick={onKakao}
				disabled={disabled}
				className={`
		  flex-1 h-10 md:h-11 rounded-lg 
          bg-[url('/images/login_kakao.svg')] bg-contain bg-no-repeat bg-center
		  cursor-pointer
        `}
			/>

			<button
				onClick={onNaver}
				disabled={disabled}
				className={`
          flex-1 h-10 md:h-11 rounded-lg 
          bg-[url('/images/login_naver.svg')] bg-contain bg-no-repeat bg-center
          cursor-pointer
        `}
			/>
		</div>
	);
}
