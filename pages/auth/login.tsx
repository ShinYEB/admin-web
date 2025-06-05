import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AuthLayout from "@/components/Layout/AuthLayout";
import { authService } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // 이미 로그인된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    if (authService.isAuthenticated()) {
      console.log("이미 로그인되어 있습니다. 메인 페이지로 이동합니다.");
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log(`로그인 시도: 아이디=${formData.id}`);
      
      // 로그인 API 호출
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formData.id,
          pw: formData.password,
        }),
      });

      // 응답 상태 로깅
      console.log("응답 상태:", response.status, response.statusText);

      // 응답 본문 확인을 위해 텍스트로 먼저 받기
      const responseText = await response.text();
      console.log("응답 본문:", responseText);

      // 빈 응답인지 확인
      if (!responseText) {
        throw new Error("서버 응답이 비어있습니다");
      }

      // 텍스트를 JSON으로 파싱
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON 파싱 오류:", parseError);
        throw new Error("서버 응답을 처리할 수 없습니다");
      }

      if (!response.ok) {
        throw new Error(data.message || "로그인 실패");
      }

      // 토큰이 응답에 포함되어 있는지 확인
      if (data.data && data.data.accessToken) {
        // authService를 사용하여 토큰 저장
        authService.setToken(data.data.accessToken, data.data.refreshToken);
        console.log("로그인 성공! 토큰 저장 완료");
        
        // 로그인 성공 상태 설정
        setLoginSuccess(true);
        
        // 약간의 지연 후 리다이렉션 (상태 업데이트와 토스트 메시지를 위한 시간)
        setTimeout(() => {
          router.push("/").then(() => {
            console.log("메인 페이지로 이동 완료");
          }).catch(navError => {
            console.error("페이지 이동 중 오류:", navError);
          });
        }, 500);
      } else {
        throw new Error("토큰 정보가 없습니다");
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      setError(err.message || "아이디 또는 비밀번호가 올바르지 않습니다.");
      setLoginSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 성공 메시지 컴포넌트
  const SuccessMessage = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center max-w-sm w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">로그인 성공!</h3>
        <p className="text-gray-600 text-center mb-6">대시보드로 이동합니다...</p>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout title="로그인 | Modive 관리자">
      {loginSuccess && <SuccessMessage />}
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Outside */}
          <div className="text-center mb-8">
            <img
              src="/assets/modive_logo.svg"
              alt="MODIVE"
              className="h-8 w-auto mx-auto"
            />
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    아이디
                  </label>
                  <input
                    id="id"
                    name="id"
                    type="text"
                    required
                    className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                    placeholder="아이디를 입력하세요"
                    value={formData.id}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    비밀번호
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || loginSuccess}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isLoading ? "로그인 중..." : loginSuccess ? "로그인 성공!" : "로그인"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                계정이 없으신가요?{" "}
                <Link
                  href="/auth/register"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  회원가입
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom decoration */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-xs">
              © 2025 MODIVE. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
