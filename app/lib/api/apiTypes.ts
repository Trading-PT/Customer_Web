// 백엔드 통신 단위 — 서버와의 요청(request)·응답(response)을 명세함
// 서버랑 주고받는 데이터 형태 정의 

/**
 * 공통 API 응답 구조
 * 모든 API 응답은 이 인터페이스를 기반으로 함
 */
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
	status?: number;
}

/**
 * 서버 원본 응답 구조 (서버 내부 result 구조 포함)
 */
export interface ServerResponse<T> {
	timestamp: string;
	code: string;
	message: string;
	result: T;
}

/* ------------------ Auth 관련 ------------------ */

/** 회원가입 요청 */
export interface SignupRequest {
	name: string;
	phone: string;
	email: string;
	username: string;
	password: string;
	passwordCheck: string;
	termsService: boolean;
	termsPrivacy: boolean;
	termsMarketing?: boolean;
	investmentType?: string;
	uids: {
		exchangeName: string;
		uid: string;
	}[];
}

/** 로그인 요청 */
export interface LoginRequest {
	username: string;
	password: string;
	rememberMe?: boolean;
}

// 로그인 응답에 맞는 타입 지정
export interface LoginResponse {
	name: string;
	username: string;
	email: string;
	investmentType: string;
	isPremium: boolean;
	isCourseCompleted: boolean;
}

/** 아이디 찾기 결과 */
export interface FindIdResult {
	userName: string;
}

/** 아이디 찾기 응답 */
export type FindIdResponse = ApiResponse<FindIdResult>;


/* ------------------ 민원 관련 ------------------ */

/** 민원 작성 요청 DTO */
export interface WriteComplaintRequest {
	title: string;
	content: string;
}

/** 민원 작성 응답 */
export type WriteComplaint = ApiResponse<WriteComplaintRequest>;

/** 단일 민원 조회 결과 */
export interface ComplaintResponse {
	id: number;
	title: string;
	content: string;
	complaintReply: string | null;
	answeredAt: string | null;
	createdAt: string;
}

/** 민원 조회 응답 (배열을 data로 감쌈) */
export type ReadComplaintResponse = ApiResponse<ComplaintResponse[]>;


/* ------------------ 피드백 관련 ------------------ */

/** 스윙 피드백 요청 DTO */
export interface SwingFeedbackRequest {
	positionEndDate: string;
	feedbackYear: number;
	trainerFeedbackRequestContent: string;
	positionStartDate: string;
	positionHoldingTime: string;
	position: string;
	winLossRatio: string;
	subFrame: string;
	courseStatus: string;
	directionFrame: string;
	membershipLevel: string;
	pnl: number;
	screenshotFiles: File | string;
	riskTaking: number;
	entryPoint1: string;
	preCourseFeedbackDetail: string;
	mainFrame: string;
	entryPoint2: string;
	leverage: number;
	entryPoint3: string;
	grade: string;
	feedbackWeek: number;
	trendAnalysis: string;
	tradingReview: string;
	feedbackMonth: number;
	requestDate: string;
	category: string;
}

/** 데이 피드백 요청 DTO */
export interface DayFeedbackRequest {
	trainerFeedbackRequestContent: string;
	positionHoldingTime: string;
	position: string;
	directionFrameExists: boolean;
	winLossRatio: string;
	subFrame: string;
	courseStatus: string;
	directionFrame: string;
	membershipLevel: string;
	pnl: number;
	screenshotFiles: File | string;
	riskTaking: number;
	entryPoint1: string;
	preCourseFeedbackDetail: string;
	mainFrame: string;
	entryPoint2: string;
	leverage: number;
	grade: string;
	trendAnalysis: string;
	tradingReview: string;
	requestDate: string;
	category: string;
}

/** 스켈핑 피드백 요청 DTO */
export interface ScalpingFeedbackRequest {
	trainerFeedbackRequestContent: string;
	dailyTradingCount: number;
	positionHoldingTime: string;
	courseStatus: string;
	membershipLevel: string;
	screenshotFiles: File | string;
	riskTaking: number;
	preCourseFeedbackDetail: string;
	leverage: number;
	totalProfitMarginPerTrades: number;
	trendAnalysis: string;
	requestDate: string;
	category: string;
	totalPositionTakingCount: number;
}
