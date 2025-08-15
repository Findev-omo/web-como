import { api } from "../client";
import type { PaginatedResponse } from "../types/common";
import type {
  ClubBasicInfoResponse,
  ClubRegistrationResponse,
} from "../types/company/club";

// 타입 정의
export interface CompanyExpenseEntry {
  id: number;
  clubName: string;
  writerName: string;
  department: string;
  eventName: string;
  createdDate: string; // ISO 8601 형식의 문자열 (예: '2025-06-18T16:42:05')
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface CompanyExpense {
  id: number;
  eventName: string;
  amount: number;
  status: string;
  clubName: string;
  createdAt: number[];
}

export interface CompanyExpenseDetail extends CompanyExpense {
  description: string;
  receipts: string[];
  note: string;
  location: string;
  participantCount: number;
  details: string;
  file: string | null;
  clubId: number;
  clubImage: string;
  leadersSummary: string;
  activityPlan: string;
  memberCount: number;
}

export interface CompanyReport {
  id: number;
  title: string;
  clubName: string;
  submitDate: string;
  status: string;
  // ... 필요한 필드들 추가
}

export interface CompanyReportDetail extends CompanyReport {
  content: string;
  attachments: string[];
  // ... 상세 정보 필드들
}

// 직원 관련 타입
export interface Employee {
  id: number;
  memberId: string;
  name: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
  status: "ACTIVE" | "INACTIVE";
  role: "MEMBER" | "EXECUTIVE" | "MANAGER" | "ADMIN";
}

export interface UpdateEmployeeData {
  name: string;
  department: string;
  position: string;
  email: string;
  role: "MEMBER" | "EXECUTIVE" | "MANAGER" | "ADMIN";
}

// Company API 서비스
export const companyService = {
  // 동호회 관리
  clubs: {
    getBasicInfo: (clubId: number) =>
      api.get<ClubBasicInfoResponse>(`/v1/manager/club/${clubId}`),

    getRegistration: (clubId: number) =>
      api.get<ClubRegistrationResponse>(
        `/v1/manager/club/${clubId}/registration`
      ),
  },

  // 지출 관리
  expenses: {
    getList: (page: number, startDate: string, endDate: string) =>
      api
        .get<
          PaginatedResponse<CompanyExpenseEntry>
        >(`/v1/manager/activity-expenses?page=${page}&startDate=${startDate}&endDate=${endDate}`)
        .then((response) => ({
          ...response,
          maxPage: response.totalPages, // 하위 호환성을 위해 maxPage 추가
        })),

    getDetail: (expenseId: number) =>
      api.get<CompanyExpenseDetail>(
        `/v1/manager/activity-expenses/${expenseId}`
      ),

    approve: (expenseId: number) =>
      api.patch<void>(`/v1/manager/activity-expenses/${expenseId}/approve`),

    reject: (expenseId: number, reason: string) =>
      api.patch<void>(`/v1/manager/activity-expenses/${expenseId}/reject`, {
        reason,
      }),

    getRejectionReason: (expenseId: number) =>
      api.get<{ reason: string }>(
        `/v1/manager/activity-expenses/${expenseId}/rejection-reason`
      ),

    getSummary: () =>
      api.get<{
        totalCount: number;
        approvedCount: number;
        pendingCount: number;
        rejectedCount: number;
      }>(`/v1/manager/activity-expense/summary`),
  },

  // 보고서 관리
  reports: {
    getList: (page: number, startDate: string, endDate: string) =>
      api.get<PaginatedResponse<CompanyReport>>(
        `/v1/manager/reports?page=${page}&startDate=${startDate}&endDate=${endDate}`
      ),

    getDetail: (reportId: number) =>
      api.get<CompanyReportDetail>(`/v1/manager/reports/${reportId}`),

    approve: (reportId: number) =>
      api.patch<void>(`/v1/manager/reports/${reportId}/approve`),

    reject: (reportId: number, reason: string) =>
      api.patch<void>(`/v1/manager/reports/${reportId}/reject`, { reason }),

    getRejectionReason: (reportId: number) =>
      api.get<{ reason: string }>(
        `/v1/manager/reports/${reportId}/rejection-reason`
      ),

    getSummary: (startDate: string, endDate: string) =>
      api.get<{
        totalCount: number;
        approvedCount: number;
        pendingCount: number;
        rejectedCount: number;
      }>(
        `/v1/manager/reports/summary?startDate=${startDate}&endDate=${endDate}`
      ),
  },

  // 직원 관리
  employees: {
    getList: (page: number) =>
      api.get<PaginatedResponse<Employee>>(`/v1/manager/member?page=${page}`),

    getDetail: (memberId: string) =>
      api.get<Employee>(`/v1/manager/member/${memberId}`),

    update: (memberId: string, data: UpdateEmployeeData) =>
      api.patch<Employee>(`/v1/manager/member/${memberId}`, data),

    delete: (memberId: string) =>
      api.delete<void>(`/v1/manager/member/${memberId}`),
  },
};
