import { useEffect } from "react";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { authService } from "@/services/authService";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // 인증 상태 확인 및 인증이 필요한 페이지 보호
    const isAuthPage = router.pathname.startsWith("/auth/");
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated && !isAuthPage && router.pathname !== "/") {
      // 인증되지 않은 사용자가 인증이 필요한 페이지 접근 시 로그인 페이지로 이동
      router.push("/auth/login");
    } else if (isAuthenticated && isAuthPage) {
      // 이미 인증된 사용자가 로그인/회원가입 페이지 접근 시 메인 페이지로 이동
      router.push("/");
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}

export default MyApp;
