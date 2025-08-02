import { companyService } from "@/api/services/company";

export const getExpense = async (
  page: number,
  startDate: string,
  endDate: string
) => {
  return companyService.expenses.getList(page, startDate, endDate);
};
