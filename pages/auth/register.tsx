import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AuthLayout from "@/components/Layout/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("회원가입 시도:", formData);

      // 회원가입 API 호출
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formData.id,
          pw: formData.password,
          nickname: formData.nickname,
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
        throw new Error(data.message || "회원가입 실패");
      }

      // 회원가입 성공!
      console.log("회원가입 성공!", data);
      setRegisterSuccess(true);

      // 약간의 지연 후 로그인 페이지로 리다이렉션
      setTimeout(() => {
        router
          .push("/auth/login")
          .then(() => {
            console.log("로그인 페이지로 이동 완료");
          })
          .catch((navError) => {
            console.error("페이지 이동 중 오류:", navError);
          });
      }, 1000);
    } catch (err) {
      console.error("회원가입 오류:", err);
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
      setRegisterSuccess(false);
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
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">회원가입 성공!</h3>
        <p className="text-gray-600 text-center mb-6">
          로그인 페이지로 이동합니다...
        </p>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout title="회원가입 | Modive 관리자">
      {registerSuccess && <SuccessMessage />}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        {/* 기존 UI 코드는 유지하되 submit 버튼만 수정 */}
        <div className="w-full max-w-md">
          {/* Register Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            {/* 기존 헤더 코드 유지 */}
            <div className="text-center mb-8">
              <img
                src="/assets/modive_logo.svg"
                alt="MODIVE"
                className="h-8 w-auto mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 기존 입력 필드 코드 유지 */}
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
                    닉네임
                  </label>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    required
                    className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                    placeholder="닉네임을 입력하세요"
                    value={formData.nickname}
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    비밀번호 확인
                  </label>
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    required
                    className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.passwordConfirm}
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
                disabled={isLoading || registerSuccess}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isLoading
                  ? "처리 중..."
                  : registerSuccess
                  ? "가입 성공!"
                  : "계정 등록"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                이미 계정이 있으신가요?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  로그인
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
