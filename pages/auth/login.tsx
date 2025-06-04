import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AuthLayout from "@/components/Layout/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // TODO: API 연동
      console.log("로그인 시도:", formData);
      // 성공 시 메인 페이지로 이동
      router.push("/");
    } catch (err) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AuthLayout title="로그인 | Modive 관리자">
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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                로그인
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
