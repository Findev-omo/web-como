import { companyService } from "@/api/services/company";

export const getExpenseDetail = async (expenseId: number) => {
  return companyService.expenses.getDetail(expenseId);
};
