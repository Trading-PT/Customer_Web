import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SubscribeModal from "./subscribeModal";
import { consultationAPI } from "../lib/api";
import type { ConsultationResponse } from "../lib/api/apiTypes";
import { useNicepayPayment } from "./useNicePayments";

export default function InvitationCard() {
	const router = useRouter();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const { openPayment } = useNicepayPayment();

  return (
    <div>
      <h1 className="text-3xl font-serif text-[#B9AB70] mb-6">Invitation Card</h1>

      {/* ✅ 결제 버튼 */}
      <button
        className="w-full bg-gradient-to-r from-[#D2C693] to-[#928346] text-white rounded-md p-6 mb-6 cursor-pointer"
        onClick={() => setIsSubModalOpen(true)}
      >
        <h2 className="text-xl font-semibold mb-2">정기 결제 구독하기</h2>
        <p className="text-sm text-white/90 mb-4">
          TPT가 엄선한 트레이딩 전문가에게
          <br />
          나의 트레이딩을 피드백 받아 보세요.
          <br />
          트레이딩 성과를 체계적으로 개선할 수 있습니다.
        </p>
        <p className="text-2xl font-bold">260,000원/월 갱신</p>
      </button>

	  <SubscribeModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onConfirmPayment={() => {
          setIsSubModalOpen(false);
          openPayment(); // 모달 닫고 결제 모듈 실행
        }}
      />

      <button
        onClick={() => router.push("/reservation")}
        className="w-full py-3 bg-[#F5F5F5] text-[#0f172a] rounded-md cursor-pointer"
      >
        고민된다면, 무료 전화 상담 신청하기
      </button>
    </div>
  );
}