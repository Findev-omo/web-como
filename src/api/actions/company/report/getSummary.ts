import { companyService } from "@/api/services/company";

export const getSummary = async (startDate: string, endDate: string) => {
  return companyService.reports.getSummary(startDate, endDate);
};
