// 공통 API 응답 타입
export interface PaginatedResponse<T> {
  list: T[];
  totalPages: number; // OpenAPI 스펙에 맞게 maxPage에서 변경
  currentPage: number; // OpenAPI 스펙에 맞게 추가
  totalCount?: number; // 선택적 필드로 유지
}

// 기존 maxPage를 사용하는 타입 (하위 호환성을 위해 유지)
export interface LegacyPaginatedResponse<T> {
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
