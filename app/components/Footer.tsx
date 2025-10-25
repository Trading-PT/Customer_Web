"use client";
import React from "react";
import { usePathname } from "next/navigation";

const footerData = {
	companyName: "로얄 트레이딩 아카데미",
	ceo: "김동욱",
	businessNumber: "570-03-03924",
	mailOrderNumber: "02 887 4810",
	address: "서울특별시 금천구 가산디지털2로 46, 305호",
	postalCode: "08725",
	email: " rlaehddnr4810@naver.com",
	phone: "010-7319-4069",
	hosting: "AWS",
	copyright: "© 2025 TPT Inc. All Rights Reserved.",
};

const visiblePaths = ["/"];

export default function Footer() {
	const pathname = usePathname();

	// 특정 페이지에서만 Footer 보이도록
	if (!visiblePaths.includes(pathname)) {
		return null;
	}

	return (
		<footer className="bg-gray-100 text-gray-700 text-sm mt-10 pb-30 border-t">
			<div className="max-w-6xl mx-auto px-4 py-6 space-y-2">
				<p>
					<span className="font-semibold">{footerData.companyName}</span> | 대표자{" "}
					{footerData.ceo}
				</p>
				<p>
					사업자 등록번호 {footerData.businessNumber}
				</p>
				<p>
					주소 {footerData.address} ({footerData.postalCode})
				</p>
				<p>
					이메일 {footerData.email} | 전화 {footerData.phone}
				</p>
				<p>호스팅 서비스: {footerData.hosting}</p>
				<p className="text-gray-500 mt-2">{footerData.copyright}</p>
			</div>
		</footer>
	);
}

