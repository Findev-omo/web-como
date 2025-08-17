import { companyService } from "@/api/services/company";

export const getSummary = async (startDate: string, endDate: string) => {
  console.log("getSummary 호출:", { startDate, endDate });
  const result = await companyService.reports.getSummary(startDate, endDate);
  console.log("getSummary 결과:", result);
  return result;
};
