"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
// import { useSearchParams } from "next/navigation";

import CustomInputField from "../components/CustomInputField";
import CustomButton from "../components/CustomButton";
import CustomCheckBox from '../components/CustomCheckBox';
import { CustomLink } from '../components/CustomLink';
import CustomModal from "../components/CustomModal";
import VerificationModal from "../components/VerificationModal";
import { authAPI } from "../lib/api/auth";
import { useAuth } from "../hooks/useAuth";
import InvestmentTypeSelector from "./InvestmentTypeSelector";
import UIDguide from "./UIDguide";

// 투자 유형 한글 -> ENUM 매핑
const investmentTypeMap: Record<string, string> = {
	"데이": "DAY",
	"스캘핑": "SCALPING",
	"스윙": "SWING",
};

export default function Signup({ searchParams }: any) {
	const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
	const router = useRouter();
	const { signup } = useAuth();
	const [open, setOpen] = useState(false);

	const UIDopen = () => {
		setOpen(true);
	}

	// 기본 폼 데이터
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [email, setEmail] = useState("");
	const [id, setId] = useState("");
	const [pw, setPw] = useState("");
	const [pw2, setPw2] = useState("");
	const [uidExchangeList, setUidExchangeList] = useState([{ uid: "", exchange: "" }]);
	const [investmentType, setInvestmentType] = useState<"스윙" | "데이" | "스켈핑" | "">("");


	// 약관 동의
	const [serviceOk, setServiceOk] = useState(false);
	const [infoOk, setInfoOk] = useState(false);
	const [adOk, setAdOk] = useState(false);

	// 검증 상태
	const [phoneVerified, setPhoneVerified] = useState(false);
	const [idChecked, setIdChecked] = useState(false);
	const [emailVerified, setEmailVerified] = useState(false);

	// UI 상태
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	// 인증 모달 상태
	const [showPhoneModal, setShowPhoneModal] = useState(false);
	const [showEmailModal, setShowEmailModal] = useState(false);

	// 전화번호 인증 시작
	const handlePhoneVerifyStart = async () => {
		if (!phoneNumber) {
			setError("전화번호를 입력해주세요.");
			setShowErrorModal(true);
			return;
		}

		setLoading(true);
		const response = await authAPI.sendPhoneCode(phoneNumber);
		setLoading(false);

		if (response.success) {
			setShowPhoneModal(true);
		} else {
			setError(response.error || "인증코드 발송에 실패했습니다.");
			setShowErrorModal(true);
		}
	};

	// 전화번호 인증 확인
	const handlePhoneVerify = async (code: string): Promise<boolean> => {
		const response = await authAPI.verifyPhoneCode(phoneNumber, code);

		if (response.success) {
			setPhoneVerified(true);
			return true;
		}
		return false;
	};

	// 이메일 인증 시작
	const handleEmailVerifyStart = async () => {
		if (!email) {
			setError("이메일을 입력해주세요.");
			setShowErrorModal(true);
			return;
		}

		setLoading(true);
		const response = await authAPI.sendEmailCode(email);
		setLoading(false);

		if (response.success) {
			setShowEmailModal(true);
		} else {
			setError(response.error || "인증코드 발송에 실패했습니다.");
			setShowErrorModal(true);
		}
	};

	// 이메일 인증 확인
	const handleEmailVerify = async (code: string): Promise<boolean> => {
		const response = await authAPI.verifyEmailCode(email, code);

		if (response.success) {
			setEmailVerified(true);
			return true;
		}
		return false;
	};

	// 아이디 중복 확인
	const handleIdCheck = async () => {
		if (!id) {
			setError("아이디를 입력해주세요.");
			setShowErrorModal(true);
			return;
		}

		setLoading(true);
		const response = await authAPI.checkUsernameAvailability(id);
		setLoading(false);

		if (response.success) {
			setIdChecked(true);
			// TODO: 성공 메시지 표시
		} else {
			setError(response.error || "아이디 중복 확인에 실패했습니다.");
			setShowErrorModal(true);
		}
	};

	const handleUidExchangeChange = (index: number, field: 'uid' | 'exchange', value: string) => {
		const updatedList = [...uidExchangeList];
		updatedList[index][field] = value;
		setUidExchangeList(updatedList);
	};

	const handleAddUidExchange = () => {
		if (uidExchangeList.length < 5) {
			setUidExchangeList([...uidExchangeList, { uid: "", exchange: "" }]);
		}
	};

	// const searchParams = useSearchParams();
	// const social = searchParams.get("social");
	const social = searchParams?.social;

	useEffect(() => {
		// const urlParams = new URLSearchParams(window.location.search);
		// const oauthResult = urlParams.get("social");
		console.log("social param:", social);

		if (social === "true") {
			console.log("oauth success !!");

			fetch(`${apiBaseUrl}/api/v1/auth/social-info`, {
				method: "GET",
				credentials: "include", // 세션 쿠키 포함
			})
				.then((res) => {
					if (!res.ok) throw new Error("소셜 로그인 정보 불러오기 실패");
					return res.json();
				})
				.then((data) => {
					if (data?.result) {
						console.log('소셜로그인 후 data는:', data);
						const { name, email, passwordHash } = data.result;

						if (name) setName(name);
						if (email) {
							console.log('email은:', email);
							setEmail(email);
						}

						// Hash 값 그대로 비밀번호 input 필드에 세팅
						if (passwordHash) {
							console.log('passwordHash는:', passwordHash);
							setPw(passwordHash);
							setPw2(passwordHash);
						}

						// 소셜 로그인은 이메일 인증 자동 완료
						setEmailVerified(true);
					}
				})
				.catch((err) => {
					console.error("소셜 로그인 처리 실패:", err);
				});
		}
	}, [apiBaseUrl]);


	// 회원가입 처리
	const handleSignup = async () => {
		// 최종 검증
		if (!isFormValid) {
			setError("모든 필수 항목을 완료해주세요.");
			setShowErrorModal(true);
			return;
		}

		if (pw !== pw2) {
			setError("비밀번호가 일치하지 않습니다.");
			setShowErrorModal(true);
			return;
		}

		setLoading(true);

		const signupData = {
			name,
			phone: phoneNumber,
			email,
			username: id,
			password: pw,
			passwordCheck: pw2,
			termsService: serviceOk,
			termsPrivacy: infoOk,
			termsMarketing: adOk,
			// investmentType: investmentType,
			investmentType: investmentTypeMap[investmentType],
			uids: uidExchangeList
				.filter(item => item.uid && item.exchange)
				.map(item => ({
					exchangeName: item.exchange,
					uid: item.uid
				}))
		};


		const result = await signup(signupData);
		setLoading(false);

		if (result.success) {
			setShowSuccessModal(true);
		} else {
			setError(result.error || "회원가입에 실패했습니다.");
			setShowErrorModal(true);
		}
	};

	const handleSuccessModalClose = () => {
		setShowSuccessModal(false);
		router.push("/login");
	};

	const atLeastOneUidExchangeFilled = uidExchangeList.some(item => item.uid && item.exchange);

	const isFormValid = !!(
		name &&
		phoneNumber &&
		email &&
		id &&
		pw &&
		pw2 &&
		pw === pw2 &&
		atLeastOneUidExchangeFilled &&
		phoneVerified &&
		idChecked &&
		emailVerified &&
		serviceOk &&
		infoOk
	) && !loading;

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const oauthResult = urlParams.get("oauth");

		if (oauthResult === "success") {
			// 카카오 로그인 성공 -> 백엔드 세션 기반으로 내 정보 가져오기
			fetch(`${apiBaseUrl}/api/user/me`, {
				method: "GET",
				credentials: "include", // 세션 쿠키 포함
			})
				.then(res => {
					if (!res.ok) throw new Error("인증 실패");
					return res.json();
				})
				.then(data => {
					console.log("카카오 유저 정보:", data);
					// 이름, 이메일 value set 해주기 
					if (data.id) setId(data.id);
					if (data.email) setEmail(data.email);
				})
				.catch(err => {
					console.error("카카오 로그인 처리 실패:", err);
				});
		}
	}, []);

	return (
		<div className="w-full min-h-screen bg-gray-100">
			<div className="pt-16 w-full flex align-top gap-2 p-1">
				<div className="w-full h-screen flex flex-1 flex-col justify-start items-center p-1 pb-5 hidden md:flex">
					<Image
						src="/images/logo_main.png"
						alt="logo"
						width={200}
						height={200}
						priority
					/>
				</div>
				<div className="w-full h-screen flex flex-2 flex-col justify-between p-1 pb-5">
					{/* 입력 필드 영역 */}
					<div className="w-full flex flex-col align-top gap-2">
						<CustomInputField
							placeholder="이름"
							value={name}
							onChange={setName}
							variant={2}
							autoComplete="off"
						/>
						<CustomInputField
							placeholder="전화번호"
							value={phoneNumber}
							onChange={setPhoneNumber}
							variant={3}
							buttonLabel={phoneVerified ? "인증완료" : "인증하기"}
							onButtonClick={handlePhoneVerifyStart}
							disabled={phoneVerified || loading}
							autoComplete="off"
						/>
						<CustomInputField
							placeholder="아이디"
							value={id}
							onChange={setId}
							variant={3}
							buttonLabel={idChecked ? "확인완료" : "중복검사"}
							onButtonClick={handleIdCheck}
							disabled={idChecked || loading}
							autoComplete="off"
						/>
						<CustomInputField
							placeholder="비밀번호 입력"
							value={pw}
							onChange={setPw}
							variant={2}
							type="password"
							autoComplete="new-password" // 테스트 !!
						/>
						<CustomInputField
							placeholder="비밀번호 재입력"
							value={pw2}
							onChange={setPw2}
							variant={2}
							type="password"
							autoComplete="off"
						/>
						<CustomInputField
							placeholder="이메일"
							value={email}
							onChange={setEmail}
							variant={3}
							buttonLabel={emailVerified ? "인증완료" : "인증하기"}
							onButtonClick={handleEmailVerifyStart}
							disabled={emailVerified || loading}
							autoComplete="off"
						/>
					</div>

					{/* UID 입력 영역 */}
					<div className="w-full flex flex-col items-end gap-2">
						<div className='w-full flex justify-start items-center gap-2'>
							<p>UID 입력</p>
							<CustomButton
								variant='normalClean'
								padding='p-1'
								textSize='text-xs'
								textColor='text-gray-500'
								border='border-gray-300'
								onClick={UIDopen}
							>
								UID가 궁금해요
							</CustomButton>
						</div>
						<UIDguide isOpen={open} onClose={() => setOpen(false)} />
						{uidExchangeList.map((item, index) => (
							<div key={index} className="w-full flex gap-2">
								<CustomInputField
									placeholder="UID"
									value={item.uid}
									onChange={(value) => handleUidExchangeChange(index, 'uid', value)}
									variant={2}
									autoComplete="off"
								/>
								<CustomInputField
									placeholder="거래소명"
									value={item.exchange}
									onChange={(value) => handleUidExchangeChange(index, 'exchange', value)}
									variant={2}
									autoComplete="off"
								/>
							</div>
						))}
						{/* <CustomButton
							variant='normalClean'
							width='w-auto'
							onClick={handleAddUidExchange}
							disabled={uidExchangeList.length >= 5}
							padding='p-1'
							textSize='text-xs'
						// textColor='text-gray-500'

						>
							+ UID 추가 입력 (최대 5개)
						</CustomButton> */}
					</div>

					<div className="w-full my-2">
						<InvestmentTypeSelector
							value={investmentType}
							onChange={setInvestmentType}
						/>
					</div>

					{/* 약관 체크박스 영역 */}
					<div className="w-full flex flex-col align-top gap-2">
						<div className='w-full flex justify-start items-center gap-2'>
							<CustomCheckBox
								checked={serviceOk}
								onChange={setServiceOk}
								size="sm"
							/>
							<CustomLink href="/signup/servicerule" variant="primary" fontSize='text-sm'>
								서비스 이용 약관
							</CustomLink>
							<p className='text-sm'>에 동의합니다. (필수)</p>
						</div>
						<div className='w-full flex justify-start items-center gap-2'>
							<CustomCheckBox
								checked={infoOk}
								onChange={setInfoOk}
								size="sm"
							/>
							<CustomLink href="/signup/myinforule" variant="primary" fontSize='text-sm'>
								개인정보 이용 약관
							</CustomLink>
							<p className='text-sm'>에 동의합니다. (필수)</p>
						</div>
						<div className='w-full flex justify-start items-center gap-2'>
							<CustomCheckBox
								checked={adOk}
								onChange={setAdOk}
								size="sm"
							/>
							<p className='text-sm'>마케팅 정보 수신에 동의합니다. (선택)</p>
						</div>
					</div>

					{/* 회원가입 버튼 */}
					<CustomButton
						variant='prettyFull'
						disabled={!isFormValid}
						onClick={handleSignup}
					>
						{loading ? "회원가입 중..." : "회원가입 하기"}
					</CustomButton>

					{/* 로그인 페이지로 이동 */}
					<div className="text-center">
						<span className="text-sm text-gray-600">이미 계정이 있으신가요? </span>
						<CustomButton
							variant="onlyText"
							onClick={() => router.push("/login")}
							disabled={loading}
						>
							로그인
						</CustomButton>
					</div>

					{/* 인증 모달들 */}
					<VerificationModal
						isOpen={showPhoneModal}
						onClose={() => setShowPhoneModal(false)}
						onVerify={handlePhoneVerify}
						title="전화번호 인증"
						description="전송된 인증코드를 입력해주세요."
						type="phone"
						target={phoneNumber}
					/>

					<VerificationModal
						isOpen={showEmailModal}
						onClose={() => setShowEmailModal(false)}
						onVerify={handleEmailVerify}
						title="이메일 인증"
						description="전송된 인증코드를 입력해주세요."
						type="email"
						target={email}
					/>

					{/* 에러 모달 */}
					{showErrorModal && (
						<CustomModal
							isOpen={showErrorModal}
							onClose={() => setShowErrorModal(false)}
							variant={1}
							width="max-w-lg"
						>
							<div className="p-4 text-center">
								<h3 className="text-lg font-semibold mb-2">알림</h3>
								<p className="text-gray-700 mb-4">{error}</p>
								<CustomButton
									variant="normalFull"
									onClick={() => setShowErrorModal(false)}
								>
									확인
								</CustomButton>
							</div>
						</CustomModal>
					)}

					{/* 성공 모달 */}
					{showSuccessModal && (
						<CustomModal
							isOpen={showSuccessModal}
							onClose={handleSuccessModalClose}
							variant={1}
							width="w-auto"
						>
							<div className="p-6 text-center">
								<h3 className="text-xl font-semibold mb-2">회원가입 완료!</h3>
								<p className="text-gray-700 mb-4">
									회원가입이 성공적으로 완료되었습니다.<br />
									로그인 페이지로 이동합니다.
								</p>
								<CustomButton
									variant="normalFull"
									onClick={handleSuccessModalClose}
								>
									로그인하러 가기
								</CustomButton>
							</div>
						</CustomModal>
					)}
				</div>
			</div>
		</div>
	);
}
