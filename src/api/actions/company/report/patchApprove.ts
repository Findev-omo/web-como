import { companyService } from "@/api/services/company";

export const patchApprove = async (reportId: number) => {
  console.log("patchApprove 호출:", { reportId });

  try {
    const result = await companyService.reports.approve(reportId);
    console.log("patchApprove 결과:", result);
    return result;
  } catch (error) {
    console.error("patchApprove 에러:", error);
    throw error;
  }
};
