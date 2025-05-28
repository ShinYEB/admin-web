import type { NextApiRequest, NextApiResponse } from 'next';
import { DashboardStats, ApiResponse } from '@/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DashboardStats>>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`,
    });
  }

  // Mock 대시보드 데이터
  const mockStats: DashboardStats = {
    totalUsers: 1234,
    activeUsers: 987,
    totalDrives: 5678,
    avgDrivingScore: 82.5,
    recentUsers: [
      {
        id: '1',
        name: '김철수',
        email: 'kim@example.com',
        nickname: '안전운전자',
        registrationDate: '2025-05-27T10:00:00Z',
        status: 'active',
      },
      {
        id: '2',
        name: '이영희',
        email: 'lee@example.com',
        nickname: '에코드라이버',
        registrationDate: '2025-05-26T15:30:00Z',
        status: 'active',
      },
      {
        id: '3',
        name: '박민수',
        email: 'park@example.com',
        nickname: '초보운전',
        registrationDate: '2025-05-25T09:15:00Z',
        status: 'inactive',
      },
      {
        id: '4',
        name: '최현준',
        email: 'choi@example.com',
        nickname: '스피드러',
        registrationDate: '2025-05-24T14:20:00Z',
        status: 'suspended',
      },
      {
        id: '5',
        name: '정미래',
        email: 'jung@example.com',
        nickname: '신중운전',
        registrationDate: '2025-05-23T11:45:00Z',
        status: 'active',
      },
    ],
    dailyStats: [
      { date: '2025-05-21', userCount: 12, driveCount: 45 },
      { date: '2025-05-22', userCount: 15, driveCount: 52 },
      { date: '2025-05-23', userCount: 18, driveCount: 61 },
      { date: '2025-05-24', userCount: 22, driveCount: 78 },
      { date: '2025-05-25', userCount: 19, driveCount: 65 },
      { date: '2025-05-26', userCount: 25, driveCount: 89 },
      { date: '2025-05-27', userCount: 31, driveCount: 102 },
    ],
  };

  return res.status(200).json({
    success: true,
    data: mockStats,
  });
}
