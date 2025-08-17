import { companyService } from "@/api/services/company";
import { ActivityReportDetail } from "@/api/types/company/report";

export const getReportDetail = async (reportId: number) => {
  console.log("getReportDetail 호출:", { reportId });

  try {
    const result = await companyService.reports.getDetail(reportId);
    console.log("getReportDetail 결과:", result);

    // CompanyReportDetail을 ActivityReportDetail로 변환
    const transformedResult: ActivityReportDetail = {
      ...result,
      expenses: result.expenses || [], // expenses가 undefined인 경우 빈 배열로 설정
    };

    return transformedResult;
  } catch (error) {
    console.error("getReportDetail 에러:", error);
    throw error;
  }
};
