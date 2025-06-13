import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  ChartBarIcon,
  UserGroupIcon,
  ChartPieIcon,
  ChatBubbleBottomCenterIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { authService } from '@/services/authService';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Modive 관리자' }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 로그아웃 버튼 클릭 핸들러 - 모달 표시
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };
  
  // 로그아웃 확인 시 실행
  const confirmLogout = () => {
    authService.logout();
    setShowLogoutModal(false);
    router.push('/auth/login');
  };
  
  // 로그아웃 취소
  const cancelLogout = () => {
    setShowLogoutModal(false);
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
    {
      name: "챗봇",
      href: "/custom",
      icon: ChatBubbleBottomCenterIcon,
      current: router.pathname.startsWith("/custom"),
    }
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
          
          {/* 빈 공간 상단 부분 */}
          <div className="flex-grow flex-1"></div>
          
          {/* 토글 버튼 - 오른쪽 배치 */}
          <div className={`flex ${collapsed ? 'justify-center' : 'justify-end pr-2'} my-4 flex-shrink-0`}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"
              title={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
            >
              {collapsed ? (
                <ChevronRightIcon className="w-5 h-5" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* 빈 공간 하단 부분 */}
          <div className="flex-grow flex-1"></div>

          {/* 로그아웃 버튼 - 고정 높이 */}
          <div className={`border-t border-gray-200 p-2 ${collapsed ? 'flex justify-center' : ''} flex-shrink-0 mb-4`}>
            <button
              onClick={handleLogoutClick} // 로그아웃 직접 실행이 아닌 모달 표시
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
      
      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">로그아웃</h3>
              <button 
                onClick={cancelLogout}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">정말 로그아웃하시겠습니까?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
