import { companyService } from "@/api/services/company";

export const getReports = async (
  page: number,
  startDate: string,
  endDate: string
) => {
  console.log("getReports 호출:", { page, startDate, endDate });

  try {
    const result = await companyService.reports.getList(
      page,
      startDate,
      endDate
    );
    console.log("getReports 결과:", result);
    console.log("getReports 원본 응답:", JSON.stringify(result, null, 2));

    return {
      list: result.list || [],
      maxPage: result.totalPages || 1,
      currentPage: result.currentPage || 1,
    };
  } catch (error) {
    console.error("getReports 에러:", error);
    throw error;
  }
};
