import { fetcher } from "./base/fetcher";
import {
	ApiResponse,
	YearlySummaryResponse,
	BeforeCompletedCourseMonthlySummary,
	BeforeCompletedCourseWeeklySummary,
} from "./apiTypes";

export const tradingAPI = {
	/**
	 * 연도별 월 목록 조회
	 * @param year - 조회할 연도
	 * @returns 해당 연도에 피드백이 존재하는 월 목록
	 */
	getYearlyMonths(year: number): Promise<ApiResponse<YearlySummaryResponse>> {
		return fetcher(`/api/v1/monthly-trading-summaries/customers/me/years/${year}`, {
			method: "GET",
		});
	},

	/**
	 * 월간 매매일지 통계 조회
	 * @param year - 연도
	 * @param month - 월
	 * @returns 해당 연/월에 대한 매매 일지 통계
	 */
	getMonthlySummary(
		year: number,
		month: number
	): Promise<ApiResponse<BeforeCompletedCourseMonthlySummary>> {
		return fetcher(
			`/api/v1/monthly-trading-summaries/customers/me/years/${year}/months/${month}`,
			{
				method: "GET",
			}
		);
	},

	/**
	 * 주간 매매일지 통계 조회
	 * @param year - 연도
	 * @param month - 월
	 * @param week - 주차 (1~5)
	 * @returns 해당 연/월/주에 대한 매매 일지 통계
	 */
	getWeeklySummary(
		year: number,
		month: number,
		week: number
	): Promise<ApiResponse<BeforeCompletedCourseWeeklySummary>> {
		return fetcher(
			`/api/v1/weekly-trading-summary/customers/me/years/${year}/months/${month}/weeks/${week}`,
			{
				method: "GET",
			}
		);
	},
};
