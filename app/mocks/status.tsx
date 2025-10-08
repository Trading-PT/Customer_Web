// 로그인한 계정이 어떤 상태인지 mock data
// 마이페이지에서 렌더링 확인을 위해 사용합니다 

// 유저 상태
export type UserStatus =
	| "UID_REVIEW_PENDING"   // UID 검토 중
	| "UID_APPROVED"         // UID 검토 완료, 승인
	| "UID_REJECTED"         // UID 검토 완료, 거절
	| "PAID_BEFORE_TEST"     // 유료 고객이며 레벨테스트 실시 전
	| "PAID_AFTER_TEST_TRAINER_ASSIGNING"      // 유료 고객이며 레벨테스트 완료해서 트레이너 배정 중
	| "TRAINER_ASSIGNED";    // 트레이너 배정 완료

// 완강 여부 상태 
export type courseStatus =
	| "BEFORE_COMPLETION"  // 완강 전
	| "PENDING_COMPLETION" // 완강했지만 아직 다음 달이 되지 않음 
	| "AFTER_COMPLETION"   // 완강 후