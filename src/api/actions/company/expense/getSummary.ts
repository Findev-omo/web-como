import { companyService } from "@/api/services/company";

export const getSummary = async () => {
  try {
    console.log("getSummary 함수 호출됨");
    const result = await companyService.expenses.getSummary();
    console.log("getSummary 결과:", result);
    return result;
  } catch (error) {
    console.error("getSummary 에러:", error);
    // 에러 발생 시 기본값 반환
    return {
      totalCount: 0,
      approvedCount: 0,
      pendingCount: 0,
      rejectedCount: 0,
    };
  }
};
