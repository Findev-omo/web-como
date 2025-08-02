import { api } from "../client";
import type { PaginatedResponse, BaseEntity } from "../types/common";

// 타입 정의
export interface CompanyExpense extends BaseEntity {
  title: string;
  amount: number;
  status: string;
  clubName: string;
  requestDate: string;
  // ... 필요한 필드들 추가
}

export interface CompanyExpenseDetail extends CompanyExpense {
  description: string;
  receipts: string[];
  // ... 상세 정보 필드들
}

export interface CompanyReport extends BaseEntity {
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

// Company API 서비스
export const companyService = {
  // 지출 관리
  expenses: {
    getList: (page: number, startDate: string, endDate: string) =>
      api.get<PaginatedResponse<CompanyExpense>>(
        `/v1/manager/activity-expenses?page=${page}&startDate=${startDate}&endDate=${endDate}`
      ),

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

    getSummary: (startDate: string, endDate: string) =>
      api.get<{
        totalAmount: number;
        approvedAmount: number;
        pendingAmount: number;
        rejectedAmount: number;
      }>(
        `/v1/manager/activity-expenses/summary?startDate=${startDate}&endDate=${endDate}`
      ),
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
};
