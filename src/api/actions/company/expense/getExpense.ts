import { companyService } from "@/api/services/company";

export const getExpense = async (
  page: number,
  startDate: string,
  endDate: string
) => {
  try {
    console.log("getExpense 호출:", { page, startDate, endDate });
    const result = await companyService.expenses.getList(
      page,
      startDate,
      endDate
    );
    console.log("getExpense 결과:", result);
    return result;
  } catch (error) {
    console.error("getExpense 에러:", error);
    // 에러 발생 시 빈 데이터 반환
    return {
      list: [],
      totalPages: 1,
      currentPage: 1,
      maxPage: 1,
    };
  }
};
