import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  companyService,
  type CompanyExpense,
  type CompanyReport,
} from "@/api/services/company";
import type { DateRange } from "@/components/dashboard/common/DateFilter";
import { formatDate } from "@/lib/format";

// Query Keys
export const companyKeys = {
  all: ["company"] as const,
  expenses: () => [...companyKeys.all, "expenses"] as const,
  expensesList: (page: number, dateRange: DateRange) =>
    [...companyKeys.expenses(), "list", page, dateRange] as const,
  expenseDetail: (id: number) =>
    [...companyKeys.expenses(), "detail", id] as const,
  expensesSummary: (dateRange: DateRange) =>
    [...companyKeys.expenses(), "summary", dateRange] as const,

  reports: () => [...companyKeys.all, "reports"] as const,
  reportsList: (page: number, dateRange: DateRange) =>
    [...companyKeys.reports(), "list", page, dateRange] as const,
  reportDetail: (id: number) =>
    [...companyKeys.reports(), "detail", id] as const,
  reportsSummary: (dateRange: DateRange) =>
    [...companyKeys.reports(), "summary", dateRange] as const,
};

// Expenses Hooks
export const useCompanyExpenses = (
  currentPage: number,
  currentDateRange: DateRange,
  initialData?: { list: CompanyExpense[]; maxPage: number }
) => {
  const startDate = currentDateRange.startDate
    ? formatDate(currentDateRange.startDate)
    : "";
  const endDate = currentDateRange.endDate
    ? formatDate(currentDateRange.endDate)
    : "";

  return useQuery({
    queryKey: companyKeys.expensesList(currentPage, currentDateRange),
    queryFn: () =>
      companyService.expenses.getList(currentPage, startDate, endDate),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    ...(initialData && { initialData }),
  });
};

export const useCompanyExpenseDetail = (expenseId: number) => {
  return useQuery({
    queryKey: companyKeys.expenseDetail(expenseId),
    queryFn: () => companyService.expenses.getDetail(expenseId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCompanyExpensesSummary = (currentDateRange: DateRange) => {
  const startDate = currentDateRange.startDate
    ? formatDate(currentDateRange.startDate)
    : "";
  const endDate = currentDateRange.endDate
    ? formatDate(currentDateRange.endDate)
    : "";

  return useQuery({
    queryKey: companyKeys.expensesSummary(currentDateRange),
    queryFn: () => companyService.expenses.getSummary(startDate, endDate),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Expense Mutations
export const useApproveExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyService.expenses.approve,
    onSuccess: (_, expenseId) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.expenses() });
      queryClient.invalidateQueries({
        queryKey: companyKeys.expenseDetail(expenseId),
      });
    },
  });
};

export const useRejectExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expenseId,
      reason,
    }: {
      expenseId: number;
      reason: string;
    }) => companyService.expenses.reject(expenseId, reason),
    onSuccess: (_, { expenseId }) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.expenses() });
      queryClient.invalidateQueries({
        queryKey: companyKeys.expenseDetail(expenseId),
      });
    },
  });
};

// Reports Hooks
export const useCompanyReports = (
  currentPage: number,
  currentDateRange: DateRange,
  initialData?: { list: CompanyReport[]; maxPage: number }
) => {
  const startDate = currentDateRange.startDate
    ? formatDate(currentDateRange.startDate)
    : "";
  const endDate = currentDateRange.endDate
    ? formatDate(currentDateRange.endDate)
    : "";

  return useQuery({
    queryKey: companyKeys.reportsList(currentPage, currentDateRange),
    queryFn: () =>
      companyService.reports.getList(currentPage, startDate, endDate),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    ...(initialData && { initialData }),
  });
};

export const useCompanyReportDetail = (reportId: number) => {
  return useQuery({
    queryKey: companyKeys.reportDetail(reportId),
    queryFn: () => companyService.reports.getDetail(reportId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCompanyReportsSummary = (currentDateRange: DateRange) => {
  const startDate = currentDateRange.startDate
    ? formatDate(currentDateRange.startDate)
    : "";
  const endDate = currentDateRange.endDate
    ? formatDate(currentDateRange.endDate)
    : "";

  return useQuery({
    queryKey: companyKeys.reportsSummary(currentDateRange),
    queryFn: () => companyService.reports.getSummary(startDate, endDate),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Report Mutations
export const useApproveReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyService.reports.approve,
    onSuccess: (_, reportId) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.reports() });
      queryClient.invalidateQueries({
        queryKey: companyKeys.reportDetail(reportId),
      });
    },
  });
};

export const useRejectReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, reason }: { reportId: number; reason: string }) =>
      companyService.reports.reject(reportId, reason),
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.reports() });
      queryClient.invalidateQueries({
        queryKey: companyKeys.reportDetail(reportId),
      });
    },
  });
};
