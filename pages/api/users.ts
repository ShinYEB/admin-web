import type { NextApiRequest, NextApiResponse } from 'next';
import { User, PaginatedResponse, ApiResponse } from '@/types';

// Mock 사용자 데이터
const mockUsers: User[] = [
  {
    id: '1',
    name: '김철수',
    email: 'kim.cs@example.com',
    phone: '010-1234-5678',
    nickname: '안전운전자',
    registrationDate: '2025-05-27T10:00:00Z',
    status: 'active',
    lastLoginDate: '2025-05-28T08:30:00Z',
    drivingScore: {
      total: 85,
      eco: 88,
      safety: 82,
      accident: 90,
      attention: 80,
    },
  },
  {
    id: '2',
    name: '이영희',
    email: 'lee.yh@example.com',
    nickname: '에코드라이버',
    registrationDate: '2025-05-26T15:30:00Z',
    status: 'active',
    lastLoginDate: '2025-05-27T19:45:00Z',
    drivingScore: {
      total: 92,
      eco: 95,
      safety: 89,
      accident: 88,
      attention: 96,
    },
  },
  {
    id: '3',
    name: '박민수',
    email: 'park.ms@example.com',
    nickname: '초보운전',
    registrationDate: '2025-05-25T09:15:00Z',
    status: 'inactive',
    lastLoginDate: '2025-05-25T12:00:00Z',
    drivingScore: {
      total: 65,
      eco: 60,
      safety: 70,
      accident: 65,
      attention: 65,
    },
  },
  {
    id: '4',
    name: '최현준',
    email: 'choi.hj@example.com',
    nickname: '스피드러',
    registrationDate: '2025-05-24T14:20:00Z',
    status: 'suspended',
    lastLoginDate: '2025-05-24T16:30:00Z',
    drivingScore: {
      total: 45,
      eco: 40,
      safety: 35,
      accident: 50,
      attention: 55,
    },
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<User>> | ApiResponse<User>>
) {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      return handleGetUsers(req, res);
    case 'PUT':
      return handleUpdateUser(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({
        success: false,
        error: `Method ${method} Not Allowed`,
      });
  }
}

function handleGetUsers(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<User>>>
) {
  const {
    page = '1',
    limit = '10',
    search = '',
    status = 'all',
    sortBy = 'registrationDate',
    sortOrder = 'desc',
  } = req.query;

  let filteredUsers = [...mockUsers];

  // 검색 필터
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.nickname.toLowerCase().includes(searchTerm)
    );
  }

  // 상태 필터
  if (status !== 'all') {
    filteredUsers = filteredUsers.filter((user) => user.status === status);
  }

  // 정렬
  filteredUsers.sort((a, b) => {
    const aValue = a[sortBy as keyof User] as string;
    const bValue = b[sortBy as keyof User] as string;
    
    if (sortOrder === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // 페이지네이션
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const response: PaginatedResponse<User> = {
    data: paginatedUsers,
    pagination: {
      current: pageNum,
      total: filteredUsers.length,
      pages: Math.ceil(filteredUsers.length / limitNum),
      limit: limitNum,
    },
  };

  return res.status(200).json({
    success: true,
    data: response,
  });
}

function handleUpdateUser(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User>>
) {
  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({
      success: false,
      error: 'ID와 상태는 필수입니다.',
    });
  }

  const userIndex = mockUsers.findIndex((user) => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: '사용자를 찾을 수 없습니다.',
    });
  }

  // 사용자 상태 업데이트
  mockUsers[userIndex].status = status;

  return res.status(200).json({
    success: true,
    data: mockUsers[userIndex],
    message: '사용자 상태가 업데이트되었습니다.',
  });
}
