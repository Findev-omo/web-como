import { companyService } from "@/api/services/company";

export const getSummary = async () => {
  console.log("getSummary 함수 호출됨");
  const result = await companyService.expenses.getSummary();
  console.log("getSummary 결과:", result);
  return result;
};
