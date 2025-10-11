// 사용자 상태 (마이페이지 조건부 렌더링을 위함)
export type UserStatus =
  | "UID_REVIEW_PENDING"   // UID 검토 중
  | "UID_APPROVED"         // UID 검토 완료, 승인
  | "UID_REJECTED"         // UID 검토 완료, 거절
  | "PAID_BEFORE_TEST"     // 유료 고객이며 레벨테스트 실시 전
  | "PAID_AFTER_TEST_TRAINER_ASSIGNING" // 유료 고객이며 레벨테스트 완료해서 트레이너 배정 중
  | "TRAINER_ASSIGNED";    // 트레이너 배정 완료

// 사용자 지위
export type UserLevel = "BASIC" | "PREMIUM" // 유료 결제한 고객: 프리미엄

// 투자 유형
export type InvestmentType = "SWING" | "DAY" | "SCALPING";

// 완강 여부
export type CompletionStatus =
  | "FREE" // 무료 사용자는 강의를 들을 수 없으므로 FREE 를 부여함 
  | "BEFORE_COMPLETION" // 완강 전 
  | "PENDING_COMPLETION" // 완강했지만 다음 달이 되지 않음 
  | "AFTER_COMPLETION"; // 완강 후 

// 사용자
export type User = {
  // id: number;
  name: string;
  phone: string;
  email: string;
  userLevel: string,
  status: UserStatus;
  investmentType: InvestmentType;
  completion: CompletionStatus;

  // TODO: 결제수단, UID, ... 추가하기 
};