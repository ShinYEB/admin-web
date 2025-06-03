import React from "react";
import Head from "next/head";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = "Modive 관리자",
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        {/* 배경 애니메이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-500/30 animate-gradient" />
        <div className="absolute inset-0 backdrop-blur-[120px]" />
        {/* 실제 콘텐츠 */}
        <div className="relative z-10">{children}</div>
      </main>
    </>
  );
};

export default AuthLayout;
