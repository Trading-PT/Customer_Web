"use client";
import { useState, useEffect, useCallback } from "react";

// 프론트엔드 로직 단위 — React 컴포넌트가 이 Hook을 어떻게 사용할지를 명세함
// React 컴포넌트가 useAuth()로 접근할 때 받을 기능 목록과 데이터 구조

// 분리된 API import
import { authAPI, complaintAPI, feedbackAPI } from "../lib/api";
import { ApiResponse } from "../lib/api/apiTypes";

// -------------------- 타입 정의 --------------------

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  investmentType?: string;
  isSub?: boolean;
}

export interface SignupData {
  name: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  passwordCheck: string; // 비밀번호 확인
  termsService: boolean;
  termsPrivacy: boolean;
  termsMarketing?: boolean; // 선택
  investmentType?: string;
  uids: {
    exchangeName: string;
    uid: string;
  }[]; // 거래소 UID 리스트
}

interface LoginData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (userData: LoginData) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  deleteUser: () => void;

  resetPasswordUnauthenticated: (
    email: string,
    code: string,
    newPassword: string,
    newPasswordCheck: string
  ) => Promise<ApiResponse>;

  resetPasswordAuthenticated: (
    currentPassword: string,
    newPassword: string
  ) => Promise<ApiResponse>;

  myInfo: () => Promise<any>;

  requestSwingFeedback: (data: any) => Promise<ApiResponse>;
  requestDayFeedback: (data: any) => Promise<ApiResponse>;
  requestScalpingFeedback: (data: any) => Promise<ApiResponse>;

  writeComplaint: (title: string, content: string) => Promise<ApiResponse>;
  readComplaint: () => Promise<ApiResponse>;
}

// -------------------- useAuth 구현 --------------------

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 로그인 상태 확인
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("auth_user");
      const storedToken = localStorage.getItem("auth_token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error checking existing auth:", error);
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ 로그인
  const login = async (userData: LoginData) => {
    setIsLoading(true);
    try {
      const result = await authAPI.login(userData);
      if (result.success && (result as any).user) {
        setUser((result as any).user);
      }
      return result;
    } catch {
      return { success: false, error: "로그인 중 오류가 발생했습니다." };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 회원가입
  const signup = async (userData: SignupData) => {
    setIsLoading(true);
    try {
      return await authAPI.signup(userData);
    } catch {
      return { success: false, error: "회원가입 중 오류가 발생했습니다." };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 로그아웃
  const logout = async () => {
    setIsLoading(true);
    try {
      const result = await authAPI.logout();
      setUser(null);
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
      return result;
    } catch {
      return { success: false, error: "로그아웃 중 오류가 발생했습니다." };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 비로그인 상태 비밀번호 재설정
  const resetPasswordUnauthenticated = async (
    email: string,
    code: string,
    newPassword: string,
    newPasswordCheck: string
  ) => {
    setIsLoading(true);
    try {
      return await authAPI.resetPasswordUnauthenticated(email, code, newPassword, newPasswordCheck);
    } catch (error) {
      console.error("비밀번호 재설정 중 오류:", error);
      return { success: false, error: "비밀번호 재설정 중 오류가 발생했습니다." };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 로그인 상태 비밀번호 재설정
  const resetPasswordAuthenticated = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setIsLoading(true);
    try {
      return await authAPI.resetPasswordAuthenticated(currentPassword, newPassword);
    } catch (error) {
      console.error("비밀번호 재설정 중 오류:", error);
      return { success: false, error: "비밀번호 재설정 중 오류가 발생했습니다." };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 회원 탈퇴
  const deleteUser = async () => {
    setIsLoading(true);
    try {
      const result = await authAPI.deleteUser();
      setUser(null);
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
      return result;
    } catch {
      return { success: false, error: "회원탈퇴 중 오류가 발생했습니다." };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 내 정보 조회
  const myInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authAPI.getUserProfile();
      console.log("내 정보 조회 성공:", res);
      return res;
    } catch (error) {
      console.error("내 정보 조회 실패:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ 피드백 요청 (feedbackAPI)
  const requestSwingFeedback = async (data: any) => {
    setIsLoading(true);
    try {
      return await feedbackAPI.requestSwingFeedback(data);
    } catch (error) {
      console.error("스윙 피드백 요청 실패:", error);
      return { success: false, error: "스윙 피드백 요청 중 오류 발생" };
    } finally {
      setIsLoading(false);
    }
  };

  const requestDayFeedback = async (data: any) => {
    setIsLoading(true);
    try {
      return await feedbackAPI.requestDayFeedback(data);
    } catch (error) {
      console.error("데이 피드백 요청 실패:", error);
      return { success: false, error: "데이 피드백 요청 중 오류 발생" };
    } finally {
      setIsLoading(false);
    }
  };

  const requestScalpingFeedback = async (data: any) => {
    setIsLoading(true);
    try {
      return await feedbackAPI.requestScalpingFeedback(data);
    } catch (error) {
      console.error("스켈핑 피드백 요청 실패:", error);
      return { success: false, error: "스켈핑 피드백 요청 중 오류 발생" };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 민원 작성/조회 (complaintAPI)
  const writeComplaint = async (title: string, content: string) => {
    setIsLoading(true);
    try {
      return await complaintAPI.writeComplaint(title, content);
    } catch (error) {
      console.error("민원 작성 요청 실패:", error);
      return { success: false, error: "민원 작성 요청 중 오류 발생" };
    } finally {
      setIsLoading(false);
    }
  };

  const readComplaint = async () => {
    setIsLoading(true);
    try {
      return await complaintAPI.readComplaint();
    } catch (error) {
      console.error("민원 조회 요청 실패:", error);
      return { success: false, error: "민원 조회 요청 중 오류 발생" };
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------- 반환 --------------------
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    resetPasswordUnauthenticated,
    resetPasswordAuthenticated,
    deleteUser,
    myInfo,
    requestSwingFeedback,
    requestDayFeedback,
    requestScalpingFeedback,
    writeComplaint,
    readComplaint,
  };
};
