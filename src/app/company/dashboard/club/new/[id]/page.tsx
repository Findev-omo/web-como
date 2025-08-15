"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { openModal } from "@/lib/utils";
import BackButton from "@/components/dashboard/common/BackButton";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/Skeleton";
import RejectApplicationModal from "@/components/dashboard/company/club/modals/RejectApplicationModal";
import RevertRejectionModal from "@/components/dashboard/company/club/modals/RevertRejectionModal";
import { companyService } from "@/api/services/company";
import Image from "next/image";
import type {
  ClubRegistrationResponse,
  ClubBasicInfoResponse,
} from "@/api/types/company/club";

const PDFViewer = dynamic(
  () => import("@/components/dashboard/club/common/PDFViewer"),
  { ssr: false, loading: () => <Skeleton className="w-full h-[1080px]" /> }
);

export default function ApplicationDetailPage() {
  const params = useParams();
  const clubId = params.id as string;
  const [registrationData, setRegistrationData] =
    useState<ClubRegistrationResponse | null>(null);
  const [basicInfoData, setBasicInfoData] =
    useState<ClubBasicInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const status = useSearchParams().get("status");

  const fetchData = useCallback(async () => {
    try {
      console.log("현재 clubId:", clubId);
      console.log("clubId 타입:", typeof clubId);
      console.log("parseInt(clubId):", parseInt(clubId));
      console.log("서버 URL:", process.env.NEXT_PUBLIC_SERVER_URL);
      console.log("현재 URL:", window.location.href);

      // API 호출을 개별적으로 처리하여 에러 추적
      try {
        console.log("기본 정보 API 호출 시작...");
        console.log("API 엔드포인트:", `/v1/manager/club/${parseInt(clubId)}`);
        const basicInfoResponse = await companyService.clubs.getBasicInfo(
          parseInt(clubId)
        );
        console.log("기본 정보 API 응답:", basicInfoResponse);
        setBasicInfoData(basicInfoResponse);
      } catch (basicInfoError) {
        console.error("기본 정보 API 오류:", basicInfoError);
        setError(
          `기본 정보 조회 실패: ${basicInfoError instanceof Error ? basicInfoError.message : "알 수 없는 오류"}`
        );
      }

      try {
        console.log("신청서 API 호출 시작...");
        console.log(
          "API 엔드포인트:",
          `/v1/manager/club/${parseInt(clubId)}/registration`
        );
        const registrationResponse = await companyService.clubs.getRegistration(
          parseInt(clubId)
        );
        console.log("신청서 API 응답:", registrationResponse);
        setRegistrationData(registrationResponse);
      } catch (registrationError) {
        console.error("신청서 API 오류:", registrationError);
        // 신청서 API 오류는 전체 페이지를 막지 않고 경고만 표시
        console.warn(
          "신청서 정보를 불러올 수 없습니다. 기본 정보만 표시됩니다."
        );
        // 에러 상태를 설정하지 않고 기본 정보만 표시하도록 함

        // 백엔드 개발자를 위한 상세 에러 정보
        if (registrationError instanceof Error) {
          console.error("신청서 API 상세 에러:", {
            message: registrationError.message,
            code: (registrationError as any).code,
            originalError: (registrationError as any).originalError,
          });
        }
      }
    } catch (err) {
      console.error("동호회 정보 로딩 오류:", err);
      if (err instanceof Error) {
        console.error("에러 메시지:", err.message);
        console.error("에러 코드:", (err as any).code);
        console.error("원본 에러:", (err as any).originalError);
      }
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  const categoryMapping = {
    ART_CULTURE: "문화/예술",
    ACTIVITY: "액티비티",
    CREATIVE: "크리에이티브",
    FOODBEVERAGE: "F&B",
    NETWORKING: "네트워킹",
    STUDY: "스터디",
    ETC: "기타",
  };

  const keyMapping = {
    name: "동호회명",
    clubName: "동호회명",
    intro: "동호회 한줄 소개",
    location: "활동 지역",
    activityPlan: "활동 일정",
    goal: "개설 목적",
    operationPlan: "운영 방침",
    duePerMonth: "월회비",
    headName: "운영장 이름",
    headPosition: "운영장 직책",
    headDepartment: "운영장 부서",
    subHeadName: "부운영장 이름",
    subHeadPosition: "부운영장 직책",
    subHeadDepartment: "부운영장 부서",
    affairsName: "총무 이름",
    affairsPosition: "총무 직책",
    affairsDepartment: "총무 부서",
    clubCategory: "카테고리",
    category: "카테고리",
    maxMemberCount: "최대 인원",
    minMemberCount: "최소 인원",
    duesPerYear: "연회비",
    detail: "주요 운영 계획",
    calculationBasis: "산출 기초",
    businessItem: "사업 항목 및 내용",
    bank: "동호회 회칙",
    signature: "서명 이미지",
    createdAt: "신청일",
    currentMember: "현재 인원",
    companyName: "회사명",
  };

  useEffect(() => {
    if (clubId) {
      fetchData();
    }
  }, [clubId, fetchData]);

  // 로딩 중일 때 처리
  if (loading) {
    return (
      <div className="space-y-3 p-8 rounded-xl bg-gray-0">
        <BackButton />
        <div className="text-lg" suppressHydrationWarning>
          로딩 중...
        </div>
      </div>
    );
  }

  // 에러가 있을 때 처리
  if (error) {
    return (
      <div className="space-y-3 p-8 rounded-xl bg-gray-0">
        <BackButton />
        <div className="text-lg text-red-600" suppressHydrationWarning>
          {error}
        </div>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchData();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 데이터가 없을 때 처리
  if (!basicInfoData && !registrationData) {
    return (
      <div className="space-y-3 p-8 rounded-xl bg-gray-0">
        <BackButton />
        <div className="text-lg" suppressHydrationWarning>
          동호회 정보를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <>
      <BackButton />
      <div className="space-y-3 p-8 rounded-xl bg-gray-0">
        <div className="flex items-center justify-between">
          <h2 className="h3 font-semibold text-gray-900">{"동호회 정보"}</h2>
        </div>

        {/* 기본 정보 섹션 */}
        {basicInfoData && (
          <div className="mb-8">
            <h3 className="h4 font-semibold text-gray-900 mb-4">기본 정보</h3>
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {Object.entries(basicInfoData)
                  .filter(([key]) => !["id"].includes(key))
                  .map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <strong style={{ fontSize: "18px" }}>
                        {keyMapping[key as keyof typeof keyMapping] || key} :
                      </strong>

                      {value === null ||
                      value === undefined ||
                      value === "" ? null : typeof value === "string" &&
                        (value.startsWith("http") ||
                          value.startsWith("https")) ? (
                        <Image
                          src={value}
                          alt={key}
                          width={500}
                          height={500}
                          unoptimized
                          style={{
                            maxWidth: "50%",
                            height: "auto",
                            marginTop: "5px",
                          }}
                        />
                      ) : (
                        <span
                          style={{ fontSize: "16px" }}
                          suppressHydrationWarning
                        >
                          {key === "category" &&
                          typeof value === "string" &&
                          value in categoryMapping
                            ? categoryMapping[
                                value as keyof typeof categoryMapping
                              ]
                            : String(value)}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* 신청서 정보 섹션 */}
        {registrationData && (
          <div>
            <h3 className="h4 font-semibold text-gray-900 mb-4">신청서 정보</h3>
            <PDFViewer file="../../../../../sample.pdf" />

            <div style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {Object.entries(registrationData)
                  .filter(
                    ([key]) =>
                      ![
                        "id",
                        "longitude",
                        "latitude",
                        "headId",
                        "subHeadId",
                        "affairsId",
                        "rule",
                        "thumbnail",
                        "isJoined",
                      ].includes(key)
                  )
                  .map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <strong style={{ fontSize: "18px" }}>
                        {keyMapping[key as keyof typeof keyMapping] || key} :
                      </strong>

                      {value === null ||
                      value === undefined ||
                      value === "" ? null : typeof value === "string" &&
                        (value.startsWith("http") ||
                          value.startsWith("https")) ? (
                        <Image
                          src={value}
                          alt={key}
                          width={500}
                          height={500}
                          unoptimized
                          style={{
                            maxWidth: "50%",
                            height: "auto",
                            marginTop: "5px",
                          }}
                        />
                      ) : (
                        <span
                          style={{ fontSize: "16px" }}
                          suppressHydrationWarning
                        >
                          {key === "clubCategory" &&
                          typeof value === "string" &&
                          value in categoryMapping
                            ? categoryMapping[
                                value as keyof typeof categoryMapping
                              ]
                            : String(value)}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-0">
        <RejectApplicationModal />
        <RevertRejectionModal />
      </div>
    </>
  );
}
