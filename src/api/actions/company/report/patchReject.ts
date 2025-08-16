import { companyService } from "@/api/services/company";

export const patchReject = async (reportId: number, reason: string) => {
  console.log("patchReject 호출:", { reportId, reason });

  try {
    const result = await companyService.reports.reject(reportId, reason);
    console.log("patchReject 결과:", result);
    return result;
  } catch (error) {
    console.error("patchReject 에러:", error);
    throw error;
  }
};
