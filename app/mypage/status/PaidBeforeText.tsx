// components/mypage/status/PaidBeforeTest.tsx
"use client";
import { useRouter } from "next/navigation";

export default function PaidBeforeTest() {
	const router = useRouter();

	return (
		<div>
			<div className="flex w-full justify-between">
				<h1 className="text-2xl text-start mb-2 text-[#B9AB70]">TPT를 구독해주신 고객님 환영합니다.</h1>
				<div className="flex w-auto gap-2">
					<button className="border border-[#B9AB70] text-[#B9AB70] text-sm bg-white rounded-xl px-2 py-1">구독 해지</button>
					<button className="text-white text-sm bg-[#B9AB70] rounded-xl px-2 py-1">후기 작성</button>
				</div>
			</div>
			<div className="text-sm text-start mb-4 text-[#B9AB70]">
				TPT의 트레이딩 전문가와 함께 경험을 축적하세요.
			</div>

			<div className="flex bg-[#0F182B] rounded-xl p-4 gap-4 items-center justify-between text-sm text-white font-bold">
				고객님에게 딱 맞는 트레이너 배정을 위해, 먼저 레벨테스트를 응시해주세요.

				<button
					onClick={() => router.push("/leveltest")}
					className="bg-[#EF5555] rounded-lg p-2 items-center justify-center text-white font-bold cursor-pointer hover:bg-[#DC4444] transition-colors"
				>
					레벨테스트 시작
				</button>
			</div>
		</div>
	);
}