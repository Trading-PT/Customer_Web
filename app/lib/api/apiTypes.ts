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


/* ------------------ 월간/주간 매매일지 관련 ------------------ */

/** 피드백 상태 */
export type FeedbackStatus = "FR" | "FN" | "N"; // FR: 답변 읽음, FN: 답변 안 읽음, N: 답변 없음

/** 투자 타입 */
export type InvestmentType = "SWING" | "DAY" | "SCALPING";

/** 코스 상태 */
export type CourseStatus = "BEFORE_COMPLETION" | "PENDING_COMPLETION" | "AFTER_COMPLETION";

/** 월별 피드백 요약 */
export interface MonthlyFeedbackSummary {
	month: number;
	totalCount: number;
	status: FeedbackStatus;
}

/** 연도별 월 목록 응답 */
export interface YearlySummaryResponse {
	feedbackYear: number;
	months: MonthlyFeedbackSummary[];
}

/** 주차별 통계 */
export interface MonthlyWeekFeedbackSummary {
	week: number;
	tradingCount: number;
	weeklyPnl: number;
	status: FeedbackStatus;
}

/** 월별 피드백 통계 */
export interface MonthlyFeedbackSummaryResponse {
	monthlyWeekFeedbackSummaryResponseDTOS: MonthlyWeekFeedbackSummary[];
	winningRate: number;
	monthlyAverageRnr: number;
	monthlyPnl: number;
}

/** 월간 스냅샷 */
export interface MonthSnapshot {
	month: number;
	finalWinRate: number;
	averageRnr: number;
	finalPnL: number;
}

/** 월간 성과 비교 */
export interface PerformanceComparisonMonthSnapshot {
	before: MonthSnapshot;
	current: MonthSnapshot;
}

/** 월간 매매일지 기본 응답 */
export interface MonthlySummaryResponse {
	courseStatus: CourseStatus;
	investmentType: InvestmentType;
	year: number;
	month: number;
}

/** 완강 전 월간 매매일지 */
export interface BeforeCompletedCourseMonthlySummary extends MonthlySummaryResponse {
	monthlyFeedbackSummaryResponseDTO: MonthlyFeedbackSummaryResponse;
	performanceComparison: PerformanceComparisonMonthSnapshot;
}

/** 일별 통계 */
export interface WeeklyWeekFeedbackSummary {
	date: string;
	tradingCount: number;
	winCount: number;
	lossCount: number;
	dailyPnl: number;
	status: FeedbackStatus;
}

/** 주별 피드백 통계 */
export interface WeeklyFeedbackSummaryResponse {
	weeklyWeekFeedbackSummaryResponseDTOS: WeeklyWeekFeedbackSummary[];
	winningRate: number;
	weeklyAverageRnr: number;
	weeklyPnl: number;
}

/** 주간 스냅샷 */
export interface WeekSnapshot {
	week: number;
	winRate: number;
	rnr: number;
	pnl: number;
}

/** 주간 성과 비교 */
export interface PerformanceComparisonWeekSnapshot {
	before: WeekSnapshot;
	current: WeekSnapshot;
}

/** 주간 매매일지 기본 응답 */
export interface WeeklySummaryResponse {
	courseStatus: CourseStatus;
	investmentType: InvestmentType;
	year: number;
	month: number;
	week: number;
}

/** 완강 전 주간 매매일지 */
export interface BeforeCompletedCourseWeeklySummary extends WeeklySummaryResponse {
	weeklyFeedbackSummaryResponseDTO: WeeklyFeedbackSummaryResponse;
	performanceComparison: PerformanceComparisonWeekSnapshot;
	memo?: string;
}


/* ------------------ 피드백 요청 조회 관련 ------------------ */

/** 포지션 타입 */
export type Position = "LONG" | "SHORT";

/** 진입 타점 */
export type EntryPoint = "REVERSE" | "PULL_BACK" | "BREAK_OUT";

/** 등급 */
export type Grade = "S_PLUS" | "S" | "A" | "B" | "NONE";

/** 슬라이스 정보 (무한 스크롤용) */
export interface SliceInfo {
	currentPage: number;
	pageSize: number;
	hasNext: boolean;
	isFirst: boolean;
	isLast: boolean;
}

/** 피드백 카드 DTO (목록용) */
export interface FeedbackCardDTO {
	feedbackRequestId: number;
	title: string;
	contentPreview: string;
	createdAt: string;
	investmentType: InvestmentType;
	courseStatus: CourseStatus;
	status: FeedbackStatus;
	isBestFeedback: boolean;
	customerName?: string;
}

/** 피드백 요청 목록 응답 */
export interface FeedbackListResponseDTO {
	feedbacks: FeedbackCardDTO[];
	sliceInfo: SliceInfo;
}

/** 트레이너 정보 */
export interface TrainerDTO {
	id: number;
	name: string;
	profileImageUrl?: string;
}

/** 피드백 답변 DTO */
export interface FeedbackResponseDTO {
	id: number;
	title: string;
	submittedAt: string;
	trainer: TrainerDTO;
	content: string;
}

/** 데이 트레이딩 피드백 요청 상세 응답 */
export interface DayFeedbackRequestDetailResponseDTO {
	id: number;
	createdAt: string;
	investmentType: InvestmentType;
	courseStatus: CourseStatus;
	feedbackYear: number;
	feedbackMonth: number;
	feedbackWeek: number;
	feedbackRequestDate: string;
	status: FeedbackStatus;
	isBestFeedback: boolean;
	updatedAt: string;
	category: string;
	positionHoldingTime: string;
	screenshotImageUrls: string[];
	riskTaking: number;
	leverage: number;
	positionStartDate: string;
	positionEndDate: string;
	position: Position;
	positionStartReason: string;
	positionEndReason: string;
	trainerFeedbackRequestContent: string;
	directionFrameExists: boolean;
	directionFrame?: string;
	mainFrame: string;
	subFrame: string;
	trendAnalysis: string;
	pnl: number;
	rnr: number;
	entryPoint1: EntryPoint;
	grade: Grade;
	entryPoint2?: string;
	tradingReview: string;
}

/** 스켈핑 트레이딩 피드백 요청 상세 응답 */
export interface ScalpingFeedbackRequestDetailResponseDTO {
	id: number;
	createdAt: string;
	investmentType: InvestmentType;
	courseStatus: CourseStatus;
	feedbackYear: number;
	feedbackMonth: number;
	feedbackWeek: number;
	feedbackRequestDate: string;
	status: FeedbackStatus;
	isBestFeedback: boolean;
	updatedAt: string;
	category: string;
	positionHoldingTime: string;
	screenshotImageUrls: string[];
	riskTaking: number;
	leverage: number;
	position: Position;
	pnl: number;
	rnr: number;
	operatingFundsRatio: number;
	entryPrice: number;
	exitPrice: number;
	settingStopLoss: number;
	settingTakeProfit: number;
	positionStartReason: string;
	positionEndReason: string;
	tradingReview: string;
}

/** 스윙 트레이딩 피드백 요청 상세 응답 */
export interface SwingFeedbackRequestDetailResponseDTO {
	id: number;
	createdAt: string;
	investmentType: InvestmentType;
	courseStatus: CourseStatus;
	feedbackRequestDate: string;
	status: FeedbackStatus;
	feedbackYear: number;
	feedbackMonth: number;
	feedbackWeek: number;
	isBestFeedback: boolean;
	updatedAt: string;
	category: string;
	positionHoldingTime: string;
	screenshotImageUrls: string[];
	riskTaking: number;
	leverage: number;
	positionStartDate: string;
	positionEndDate: string;
	position: Position;
	positionStartReason: string;
	positionEndReason: string;
	trainerFeedbackRequestContent: string;
	directionFrame: string;
	mainFrame: string;
	subFrame: string;
	trendAnalysis: string;
	pnl: number;
	rnr: number;
	entryPoint1: EntryPoint;
	grade: Grade;
	entryPoint2?: string;
	entryPoint3?: string;
	tradingReview: string;
}

/** 피드백 요청 상세 응답 */
export interface FeedbackRequestDetailResponseDTO {
	id: number;
	investmentType: InvestmentType;
	status: FeedbackStatus;
	dayDetail?: DayFeedbackRequestDetailResponseDTO;
	scalpingDetail?: ScalpingFeedbackRequestDetailResponseDTO;
	swingDetail?: SwingFeedbackRequestDetailResponseDTO;
	feedbackResponse?: FeedbackResponseDTO;
}
