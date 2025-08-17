// @deprecated - useCompanyReportRejectionReason hook을 사용하세요
import { companyService } from "@/api/services/company";

export const getReportRejectionReason = async (reportId: number) => {
  console.log("getReportRejectionReason 호출:", { reportId });

  try {
    const result = await companyService.reports.getRejectionReason(reportId);
    console.log("getReportRejectionReason 결과:", result);
    return result;
  } catch (error) {
    console.error("getReportRejectionReason 에러:", error);
    throw error;
  }
};
