import { companyService } from "@/api/services/company";
import { ActivityReportDetail } from "@/api/types/company/report";

export const getReportDetail = async (reportId: number) => {
  console.log("getReportDetail 호출:", { reportId });

  try {
    const result = await companyService.reports.getDetail(reportId);
    console.log("getReportDetail 결과:", result);

    // CompanyReportDetail을 ActivityReportDetail로 변환
    const transformedResult: ActivityReportDetail = {
      clubImage: "", // 기본값 설정
      clubName: "", // 기본값 설정
      writerName: "", // 기본값 설정
      writerRole: "", // 기본값 설정
      writerDepartment: "", // 기본값 설정
      eventName: result.eventName || "",
      activityDate: [], // 기본값 설정
      activityTime: [], // 기본값 설정
      location: result.location || "",
      locationDetail: result.locationDetail || "",
      participantCount: 0, // 기본값 설정
      activityContent: result.activityContent || "",
      note: result.note || "",
      photos: result.photos || [],
      expenses: (result.expenses || []).map((expense) => ({
        ...expense,
        usageDetail: "", // 기본값 설정
        submittedBy: "", // 기본값 설정
        issuedDate: [], // 기본값 설정
        vendor: "", // 기본값 설정
        amount: expense.usedAmount, // usedAmount를 amount로 매핑
        description: "", // 기본값 설정
        file: "", // 기본값 설정
      })),
    };

    return transformedResult;
  } catch (error) {
    console.error("getReportDetail 에러:", error);
    throw error;
  }
};
