"use client";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";
import CustomLoading from "./components/CustomLoading";
import MainToast from "./mainpage_components/MainToast";

// 가장 먼저 렌더링되는 홈화면 
const Home = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"트레이딩 성공 공식" | "TPT 소개" | "FAQ">("TPT 소개");

  // 탭 버튼 
  const sectionRefs = {
    A: useRef<HTMLDivElement>(null),
    B: useRef<HTMLDivElement>(null),
    C: useRef<HTMLDivElement>(null),
  };

  // 탭 클릭 시 스크롤 이동
  const handleTabClick = (tab: "트레이딩 성공 공식" | "TPT 소개" | "FAQ") => {
    setActiveTab(tab);
    let targetRef = null;

    if (tab === "트레이딩 성공 공식") targetRef = sectionRefs.A.current;
    else if (tab === "TPT 소개") targetRef = sectionRefs.B.current;
    else if (tab === "FAQ") targetRef = sectionRefs.C.current;

    if (targetRef) {
      targetRef.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 렌더링 후 초기 스크롤 위치 B로 이동
  const [bReady, setBReady] = useState(false);

  useEffect(() => {
    if (bReady && sectionRefs.B.current) {
      sectionRefs.B.current.scrollIntoView({ behavior: "auto" });
    }
  }, [bReady]);

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="w-full h-screen">
        <CustomLoading />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">

      {/* 메인 콘텐츠 */}
      <div className="pt-16 flex-1 flex flex-col">
        {/* 탭 네비게이션 */}
        <nav
          className="flex justify-center gap-4 border-b border-gray-300 py-2 sticky top-16 bg-[#272727] z-10"
          role="navigation"
          aria-label="섹션 네비게이션"
        >
          {["트레이딩 성공 공식", "TPT 소개", "FAQ"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab as "트레이딩 성공 공식" | "TPT 소개" | "FAQ")}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${activeTab === tab
                ? "border-b-2 border-[#EF5555] text-white"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700"
                }`}
              aria-pressed={activeTab === tab}
              aria-label={`섹션 ${tab}로 이동`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* 기업 소개. 3개의 컴포넌트 영역 */}
        <main className="flex flex-col w-full items-center">
          {/* <section ref={sectionRefs.A} id="section-first" className="w-full relative">
            <Image
              src="/images/sub_banner.png"
              alt="섹션 A 이미지"
              layout="responsive"
              width={1000}
              height={21000}
            // priority
            />
          </section> */}

          <section ref={sectionRefs.A} id="section-a" className="w-[50%] relative">
            <Image
              src="/images/tab_a_img_2.svg"
              alt="섹션 A 이미지"
              layout="responsive"
              width={1000}
              height={21000}
            // priority
            />
          </section>

          <section ref={sectionRefs.B} id="section-b" className="w-full relative">
            <Image
              src="/images/tab_b_img.svg"
              alt="섹션 B 이미지"
              layout="responsive"
              width={1000}
              height={21400}
              priority
              onLoadingComplete={() => setBReady(true)}
            />
          </section>

          <section ref={sectionRefs.C} id="section-c" className="w-[50%] relative">
            <Image
              src="/images/tab_c_img.svg"
              alt="섹션 C 이미지"
              layout="responsive"
              width={1920}
              height={2740}
            // priority
            />
          </section>

          <MainToast />
        </main>
      </div>
    </div>
  );
};

export default Home;
