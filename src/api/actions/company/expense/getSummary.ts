import { companyService } from "@/api/services/company";

export const getSummary = async () => {
  return companyService.expenses.getSummary();
};
