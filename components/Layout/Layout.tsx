import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image'; // Image 컴포넌트 import
import {
  ChartBarIcon,
  UserGroupIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Modive 관리자' }) => {
  const router = useRouter();

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
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Logo / Title */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <Image
              src="/assets/modive_logo.svg"
              alt="MODiVE 로고"
              width={89}
              height={19}
              priority
            />
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-2 space-y-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    item.current
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-6 px-8">{children}</main>
      </div>
    </>
  );
};

export default Layout;
