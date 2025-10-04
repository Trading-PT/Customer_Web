"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import SideBar from "../mainpage_components/SideBar";
import CustomButton from "./CustomButton";
import { Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function AuthHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout: logoutStore } = useAuthStore();
  const { logout: logoutAPI } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 로그인/회원가입 페이지에서는 헤더 숨김
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/mypage" ||
    pathname === "/reservation"
  ) {
    return null;
  }

  const handleLogout = async () => {
    await logoutAPI(); // 서버 로그아웃 호출
    logoutStore(); // Zustand 상태 초기화
    router.push("/login");
  };

  const handleLoginNavigation = () => {
    router.push("/login");
  };

  const handleSignupNavigation = () => {
    router.push("/signup");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full bg-white shadow-sm border-b border-gray-200 z-50"
      role="banner"
      aria-label="메인 네비게이션"
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              aria-label="메뉴 열기"
              className="p-2 cursor-pointer"
            >
              <Menu size={24} className="text-gray-700" />
            </button>

            <button
              onClick={() => { router.push("/"); }}
              aria-label="홈으로"
              className="cursor-pointer"
            >
              <h1 className="text-xl font-semibold text-gray-300">TPT</h1>
            </button>
          </div>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <CustomButton
                  variant="prettyFull"
                  onClick={() => router.push("/mypage")}
                  textSize="text-sm"
                >
                  My
                </CustomButton>
                <CustomButton
                  variant="redClean"
                  onClick={handleLogout}
                  textSize="text-sm"
                  textColor="text-red-600"
                >
                  로그아웃
                </CustomButton>
              </>
            ) : (
              <>
                <CustomButton
                  variant="redClean"
                  onClick={handleLoginNavigation}
                  textSize="text-sm"
                  padding="px-4 py-2"
                >
                  로그인
                </CustomButton>

                <CustomButton
                  variant="redFull"
                  onClick={handleSignupNavigation}
                  textSize="text-sm"
                  padding="px-4 py-2"
                >
                  회원가입
                </CustomButton>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 사이드바 */}
      <SideBar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </header>
  );
}
