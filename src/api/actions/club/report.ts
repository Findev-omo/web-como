import {
  ClubReportCreateRequest,
  ClubReportResponse,
} from "@/lib/types/schema";
import { getAccessToken, getClubId } from "@/lib/cookies";

// 활동 보고서 목록 조회 GET 요청
export interface ClubReportListParams {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  page?: string; // 0부터 시작
}

export const getClubReportList = async (
  params: ClubReportListParams
): Promise<ClubReportResponse[]> => {
  const token = await getAccessToken();
  const clubId = await getClubId();

  const queryParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
    ...(params.page && { page: params.page }),
  });

  const response = await fetch(
    `/api/server/v1/executive/club/${clubId}/reports?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);
    throw new Error("활동 보고서 목록 조회에 실패했습니다.");
  }

  const data = await response.json();
  return data;
};

// 활동 보고서 작성 POST 요청
export const createClubReport = async (
  data: ClubReportCreateRequest,
  images: File[],
  receipts: File[]
): Promise<void> => {
  console.log("API 호출 시작");
  console.log("Request data:", data);
  console.log("Images count:", images.length);
  console.log("Receipts count:", receipts.length);

  const formData = new FormData();

  // JSON 데이터 추가
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], {
      type: "application/json",
    })
  );

  // 이미지 파일들 추가
  images.forEach((image) => {
    formData.append("images", image);
  });

  // 영수증 파일들 추가
  receipts.forEach((receipt) => {
    formData.append("receipts", receipt);
  });

  const token = await getAccessToken();
  const clubId = await getClubId();

  console.log("API URL:", `/api/server/v1/executive/club/${clubId}/reports`);
  console.log("Token:", token ? "존재" : "없음");

  const response = await fetch(
    `/api/server/v1/executive/club/${clubId}/reports`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  console.log("Response status:", response.status);
  console.log("Response ok:", response.ok);
  console.log(
    "Response headers:",
    Object.fromEntries(response.headers.entries())
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);

    // 에러 응답을 파싱해서 더 자세한 정보 출력
    try {
      const errorJson = JSON.parse(errorText);
      console.error("Parsed error:", errorJson);
    } catch (e) {
      console.error("Raw error text:", errorText);
    }

    throw new Error("활동 보고서 작성에 실패했습니다.");
  }

  console.log("API 호출 성공");
};

// 테스트용 간단한 데이터로 API 호출
export const testClubReport = async (): Promise<void> => {
  console.log("테스트 API 호출 시작");

  const testData: ClubReportCreateRequest = {
    eventName: "테스트 행사",
    activityDate: "2025-01-16",
    activityTime: "14:00",
    location: "테스트 장소",
    locationDetail: "테스트 장소 상세",
    participantCount: 10,
    activityContent: "테스트 활동 내용",
    note: "테스트 비고",
    receipts: [
      {
        category: "activity",
        supportAmount: 10000,
        usedAmount: 8000,
        remainingAmount: 2000,
        usageDetail: "테스트 사용내역",
        submittedBy: "테스트 제출자",
        issuedDate: "2025-01-16",
        vendor: "테스트 거래처",
        amount: 8000,
        description: "테스트 설명",
      },
    ],
  };

  const formData = new FormData();

  // JSON 데이터만 추가 (파일 없이)
  formData.append(
    "data",
    new Blob([JSON.stringify(testData)], {
      type: "application/json",
    })
  );

  const token = await getAccessToken();
  const clubId = await getClubId();

  console.log("테스트 데이터:", testData);
  console.log("API URL:", `/api/server/v1/executive/club/${clubId}/reports`);

  const response = await fetch(
    `/api/server/v1/executive/club/${clubId}/reports`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  console.log("테스트 Response status:", response.status);
  console.log("테스트 Response ok:", response.ok);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("테스트 Error response:", errorText);
    throw new Error("테스트 활동 보고서 작성에 실패했습니다.");
  }

  const responseText = await response.text();
  console.log("테스트 성공 응답:", responseText);
  console.log("테스트 API 호출 성공");
};
