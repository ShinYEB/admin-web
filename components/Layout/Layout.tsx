import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  ChartBarIcon,
  UserGroupIcon,
  ChartPieIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { authService } from '@/services/authService';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Modive 관리자' }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  // 로그아웃 처리
  const handleLogout = () => {
    authService.logout();
    router.push('/auth/login');
  };

  const navigation = [
    {
      name: '대시보드',
      href: '/',
      icon: ChartBarIcon,
      current: router.pathname === '/',
    },
    {
      name: '회원관리',
      href: '/users',
      icon: UserGroupIcon,
      current: router.pathname.startsWith('/users'),
    },
    {
      name: '씨앗 내역 통계',
      href: '/analytics',
      icon: ChartPieIcon,
      current: router.pathname.startsWith('/analytics'),
    },
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Modive 관리자 페이지" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar - 고정 높이로 설정하고 overflow 비활성화 */}
        <aside className={`${collapsed ? 'w-16' : 'w-64'} h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
          {/* 고정 높이의 로고 영역 */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200 flex-shrink-0">
            {collapsed ? (
              <div className="font-bold text-indigo-600 text-2xl">M</div>
            ) : (
              <Image
                src="/assets/modive_logo.svg"
                alt="MODiVE 로고"
                width={89}
                height={19}
                priority
              />
            )}
          </div>

          {/* 내비게이션 - flex-grow 제거, 고정된 공간 배치 */}
          <nav className="py-4 px-2 space-y-2 flex-shrink-0">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    item.current
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={collapsed ? item.name : ''}
                >
                  <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* 빈 공간 자동 확장 */}
          <div className="flex-grow"></div>

          {/* 토글 버튼 - 고정 높이 */}
          <div className={`px-2 py-2 flex ${collapsed ? 'justify-center' : 'justify-end'} flex-shrink-0`}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              title={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
            >
              {collapsed ? (
                <ChevronRightIcon className="w-5 h-5" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* 로그아웃 버튼 - 고정 높이 */}
          <div className={`border-t border-gray-200 p-2 ${collapsed ? 'flex justify-center' : ''} flex-shrink-0 mb-4`}>
            <button
              onClick={handleLogout}
              className={`flex items-center ${
                collapsed ? 'justify-center p-3' : 'w-full px-4 py-3'
              } text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors`}
              title={collapsed ? "로그아웃" : ''}
            >
              <ArrowLeftOnRectangleIcon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && '로그아웃'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto h-screen px-4 py-8">
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
