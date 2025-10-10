import { fetcher } from "./base/fetcher";
import {
	WriteComplaintRequest,
	WriteComplaint,
	ComplaintResponse,
	ReadComplaintResponse,
} from "./apiTypes";

export const complaintAPI = {
	/** 민원 작성 */
	writeComplaint(title: string, content: string): Promise<WriteComplaint> {
		return fetcher<WriteComplaintRequest>("/api/v1/complaint", {
			method: "POST",
			body: JSON.stringify({ title, content }),
		});
	},

	/** 민원 목록 조회 */
	readComplaint(): Promise<ReadComplaintResponse> {
		return fetcher<ComplaintResponse[]>("/api/v1/complaint", {
			method: "GET",
		});
	},
};
