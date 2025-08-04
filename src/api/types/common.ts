// 공통 API 응답 타입
export interface PaginatedResponse<T> {
  list: T[];
  maxPage: number;
  totalCount: number;
}

export interface ApiResponse<T = any> {
  resultCode: string;
  resultMessage: string;
  data: T;
}

// 기본 엔티티 타입
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt?: string;
}
