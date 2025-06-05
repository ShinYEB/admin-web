import { useEffect } from 'react';
import type { AppProps } from 'next/app'
import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 최신 토큰으로 업데이트
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMjYwNWZkZS04OWUyLTQ0M2YtOWUwMC1kZTRmZjcyN2RhM2IiLCJ1c2VySWQiOiIyMjYwNWZkZS04OWUyLTQ0M2YtOWUwMC1kZTRmZjcyN2RhM2IiLCJyb2xlIjoiQURNSU4iLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0IiwiaWF0IjoxNzQ5MDM4Nzc3LCJleHAiOjE3NDkwNDIzNzd9.wjc1IknkW22PuxMolTQsX8gOjiHiEK5fWcGg0zW9cAU';
    
    localStorage.setItem('authToken', token);
    console.log('새 토큰 설정 완료:', token.substring(0, 50) + '...');
  }, []);
  
  return <Component {...pageProps} />;
}

export default MyApp;
