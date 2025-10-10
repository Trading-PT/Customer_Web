"use client";
import React, { useState, useEffect } from "react";
import { Send, Edit3, Trash2, ImagePlus } from "lucide-react";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../hooks/useAuth";
import CustomModal from "../components/CustomModal";

type Complaint = {
	id: number;
	title: string;
	content: string;
	createdAt: string;
	image?: string;
	status: "pending" | "answered";
	answer?: string;
};


export default function CustomerCenter() {
	const [tab, setTab] = useState<"write" | "list">("write");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [image, setImage] = useState<string | undefined>(undefined);
	const [complaints, setComplaints] = useState<Complaint[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// API hook 연결
	const { writeComplaint, readComplaint } = useAuth();

	// 이미지 업로드
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onloadend = () => setImage(reader.result as string);
		reader.readAsDataURL(file);
	};

	// 민원 작성
	const handleSubmit = async () => {
		if (!title || !content) return alert("제목과 내용을 모두 입력해주세요.");

		try {
			setIsLoading(true);
			const res = await writeComplaint(title, content);

			// 서버 응답이 실패했거나 success가 false인 경우
			if (!res || !res.success) {
				console.error("민원 작성 실패:", res?.error || res?.message);
				alert("민원 접수에 실패했습니다. 다시 시도해주세요.");
				return;
			}

			// 성공 시
			setTitle("");
			setContent("");
			setImage(undefined);
			setIsModalOpen(true);
			setTab("list"); // 작성 완료 후 자동으로 목록 탭 이동

		} catch (error) {
			console.error("민원 작성 요청 중 오류:", error);
			alert("민원 요청 중 오류가 발생했습니다.");
		} finally {
			setIsLoading(false);
		}
	};


	// 탭이 'list'로 변경될 때 서버에서 민원 목록 조회
	useEffect(() => {
		if (tab === "list") {
			const fetchComplaints = async () => {
				setIsLoading(true);
				try {
					const res = await readComplaint();
					console.log("res:", res);

					if (res.success) {
						const rawData = res.data as any[];
						console.log("rawData:", rawData);

						const mapped: Complaint[] = rawData.map((c) => ({
							id: c.id,
							title: c.title,
							content: c.content,
							createdAt: c.createdAt,
							image: c.image ?? undefined,
							status: c.answeredAt ? "answered" : "pending",
							answer: c.complaintReply ?? undefined,
						}));

						setComplaints(mapped);
					} else {
						console.error("민원 목록 조회 실패:", res.error || res.message);
					}
				} catch (error) {
					console.error("민원 조회 중 오류:", error);
				} finally {
					setIsLoading(false);
				}
			};

			fetchComplaints();
		}
	}, [tab]);

	return (
		<div className="max-w-3xl mx-auto p-6 mt-20">
			<h1 className="text-2xl font-semibold mb-2">
				TPT 서비스의 불편함 또는 문의사항을 알려주세요.
			</h1>
			<p className="text-gray-600 mt-6 mb-6">
				항상 고객의 목소리에 귀 기울이는 TPT가 되겠습니다.
			</p>

			{/* 탭 */}
			<div className="flex border-b mb-6">
				<button
					onClick={() => setTab("write")}
					className={`px-4 py-2 font-medium cursor-pointer ${tab === "write"
						? "border-b-2 border-black text-black"
						: "text-gray-500"
						}`}
				>
					민원 작성
				</button>
				<button
					onClick={() => setTab("list")}
					className={`px-4 py-2 font-medium cursor-pointer ${tab === "list"
						? "border-b-2 border-black text-black"
						: "text-gray-500"
						}`}
				>
					내 민원 확인
				</button>
			</div>

			{/* 민원 작성 폼 */}
			{tab === "write" && (
				<div className="space-y-4">
					<div>
						<label className="block font-medium mb-1">
							제목 <span className="text-red-500">*</span>
						</label>
						<input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="민원 제목을 입력하세요."
							className="w-full bg-[#F4F4F4] rounded-md px-3 py-2 text-sm"
						/>
					</div>
					<div>
						<div className="flex w-full items-center justify-between">
							<label className="block font-medium mb-1">
								본문 <span className="text-red-500">*</span>
							</label>
							<label className="inline-flex items-center gap-2 cursor-pointer text-sm text-indigo-600">
								<ImagePlus size={16} />
								이미지 추가
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageUpload}
								/>
							</label>
						</div>

						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="민원 내용을 입력하세요."
							className="w-full bg-[#F4F4F4] rounded-md px-3 py-2 text-sm h-40"
						/>
						{image && (
							<div className="mt-2">
								<img
									src={image}
									alt="첨부된 이미지"
									className="w-40 h-40 object-cover border rounded-md"
								/>
							</div>
						)}
					</div>
					<CustomButton
						variant="prettyFull"
						onClick={handleSubmit}
						disabled={isLoading}
					>
						{isLoading ? "전송 중..." : "의견 전달하기"}
					</CustomButton>
				</div>
			)}

			{/* 내 민원 확인 */}
			{tab === "list" && (
				<div className="space-y-4">
					{isLoading && (
						<p className="text-gray-500 text-center">불러오는 중...</p>
					)}
					{!isLoading && complaints.length === 0 && (
						<p className="text-gray-500 text-center">
							등록된 민원이 없습니다.
						</p>
					)}
					{complaints.map((c) => (
						<div
							key={c.id}
							className="rounded-md p-4 bg-[#F4F4F4] text-sm space-y-2"
						>
							<div className="flex justify-between items-center">
								<span className="font-medium">{c.createdAt} 작성</span>
								<div className="flex gap-2">
									<Edit3 size={16} className="cursor-pointer text-gray-500" />
									<Trash2 size={16} className="cursor-pointer text-gray-500" />
								</div>
							</div>
							<p className="font-semibold">{c.title}</p>
							<p className="text-gray-700 whitespace-pre-line">{c.content}</p>
							{c.image && (
								<div className="mt-2">
									<img
										src={c.image}
										alt="고객 첨부 이미지"
										className="w-40 h-40 object-cover border rounded-md"
									/>
								</div>
							)}

							{c.status === "pending" && (
								<p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
									<Send size={14} /> 고객님의 소중한 의견을 관리자가 검토하고
									있습니다. 잠시만 기다려주세요.
								</p>
							)}

							{c.status === "answered" && c.answer && (
								<div className="bg-white border rounded-md p-3 mt-2">
									<p className="text-gray-800 whitespace-pre-line">{c.answer}</p>
									<p className="text-xs text-gray-500 mt-2 text-right">
										2025.8.22. 14:50 답변
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{/* 성공 모달 */}
			{isModalOpen && (
				<CustomModal variant={1} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }} width="max-w-xl">
					<p className="mb-4">
						민원이 성공적으로 접수되었습니다.
						<br />
						관리자가 확인 후 24시간 이내 최대한 빠르게 답변을 드릴 예정입니다.
						<br />
						TPT의 성장을 위한 소중한 의견 감사합니다.
					</p>
				</CustomModal>
			)}
		</div>
	);
}
