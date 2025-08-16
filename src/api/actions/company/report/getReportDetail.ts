import { companyService } from "@/api/services/company";

export const getReportDetail = async (reportId: number) => {
  console.log("getReportDetail 호출:", { reportId });

  try {
    const result = await companyService.reports.getDetail(reportId);
    console.log("getReportDetail 결과:", result);
    return result;
  } catch (error) {
    console.error("getReportDetail 에러:", error);
    throw error;
  }
};
