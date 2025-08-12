// 클럽 임원 활동 보고서 목록 조회 (클라이언트에서 사용)
// GET /v1/executive/club/{clubId}/reports?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&page=0

export interface ClubReportListResponse<T = any> {
  totalPages: number;
  currentPage: number; // 1-based
  list: T[];
}

export const getClubReports = async (
  clubId: string | undefined,
  page: number,
  startDate: string,
  endDate: string
): Promise<ClubReportListResponse> => {
  if (!clubId) throw new Error("클럽 정보가 없습니다.");

  const serverPage = Math.max(0, Number(page) - 1); // 0-based
  const url = `/api/server/v1/executive/club/${clubId}/reports?startDate=${encodeURIComponent(
    startDate
  )}&endDate=${encodeURIComponent(endDate)}&page=${serverPage}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const body = await res.json();
  const data = body?.data ?? body;
  return {
    totalPages: data?.totalPages ?? data?.maxPage ?? 1,
    currentPage: data?.currentPage ?? 1,
    list: Array.isArray(data?.list) ? data.list : [],
  };
};
