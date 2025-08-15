"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { openModal } from "@/lib/utils";
import BackButton from "@/components/dashboard/common/BackButton";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/Skeleton";
import RejectApplicationModal from "@/components/dashboard/company/club/modals/RejectApplicationModal";
import RevertRejectionModal from "@/components/dashboard/company/club/modals/RevertRejectionModal";
import { getData } from "@/api/action";
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
  const [registrationData, setRegistrationData] = useState<
    ClubRegistrationResponse["data"] | null
  >(null);
  const [basicInfoData, setBasicInfoData] = useState<
    ClubBasicInfoResponse["data"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const status = useSearchParams().get("status");

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
    const fetchData = async () => {
      try {
        // 두 API를 병렬로 호출
        const [basicInfoResponse, registrationResponse] = await Promise.all([
          getData(
            `v1/manager/club/${clubId}`
          ) as unknown as ClubBasicInfoResponse,
          getData(
            `v1/manager/club/${clubId}/registration`
          ) as unknown as ClubRegistrationResponse,
        ]);

        console.log("basicInfoResponse", basicInfoResponse);
        console.log("registrationResponse", registrationResponse);

        // 기본 정보 처리
        if (basicInfoResponse.resultCode === 200 && basicInfoResponse.data) {
          setBasicInfoData(basicInfoResponse.data);
        } else {
          console.error(
            "기본 정보 API 응답 오류:",
            basicInfoResponse.resultMessage
          );
        }

        // 신청서 정보 처리
        if (
          registrationResponse.resultCode === 200 &&
          registrationResponse.data
        ) {
          setRegistrationData(registrationResponse.data);
        } else {
          console.error(
            "신청서 API 응답 오류:",
            registrationResponse.resultMessage
          );
        }
      } catch (err) {
        console.error("동호회 정보 로딩 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchData();
    }
  }, [clubId]);

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
