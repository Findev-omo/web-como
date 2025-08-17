"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const tableHeadings = ["순번", "활동명", "활동일", "작성 상태", "반려 사유"];

interface Props {
  data?: {
    data: {
      currentPage: number;
      list: {
        id: number;
        eventName: string;
        activityDate: number[];
        status: string;
        rejectReason?: string;
      }[];
      maxPage: number;
    };
    resultCode: string;
    resultMessage: string;
  }[];
  clubId: string | undefined;
  currentPage: number;
}

export default function ReportListTable({ data, clubId, currentPage }: Props) {
  const pathname = usePathname();
  const { push } = useRouter();

  // 디버깅을 위한 로그
  console.log("ReportTable data:", data);
  console.log("ReportTable currentPage:", currentPage);

  // 데이터가 없거나 빈 배열인 경우 처리
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex border-y border-gray-400 bg-gray-200">
          {tableHeadings.map((heading, i) => (
            <div
              key={heading}
              className={cn(
                "my-3 mx-6 body-1 font-bold text-gray-900",
                i === 0 ? "w-[76px] text-center" : "flex-1",
                i === 1 ? "text-left max-w-[892px]" : "",
                i === 2 ? "max-w-[220px] text-center" : "",
                i === 3 ? "max-w-[180px] text-center" : "",
                i === 4 ? "max-w-[180px] text-center" : ""
              )}
            >
              {heading}
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center py-8 text-gray-500">
          데이터가 없습니다.
        </div>
      </div>
    );
  }

  // 현재 페이지의 데이터를 사용
  const currentPageData = data[0]?.data?.list || [];

  console.log("currentPageData:", currentPageData);

  // 각 항목의 데이터 구조 확인
  currentPageData.forEach((report, index) => {
    console.log(`Report ${index}:`, {
      id: report.id,
      eventName: report.eventName,
      activityDate: report.activityDate,
      activityDateType: typeof report.activityDate,
      isArray: Array.isArray(report.activityDate),
      status: report.status,
      rejectReason: report.rejectReason,
    });
  });

  return (
    <ul className="flex flex-col gap-1">
      <li className="flex border-y border-gray-400 bg-gray-200">
        {tableHeadings.map((heading, i) => (
          <div
            key={heading}
            className={cn(
              "my-3 mx-6 body-1 font-bold text-gray-900",
              i === 0 ? "w-[76px] text-center" : "flex-1",
              i === 1 ? "text-left max-w-[892px]" : "",
              i === 2 ? "max-w-[220px] text-center" : "",
              i === 3 ? "max-w-[180px] text-center" : "",
              i === 4 ? "max-w-[180px] text-center" : ""
            )}
          >
            {heading}
          </div>
        ))}
      </li>
      {currentPageData.length === 0 ? (
        <div className="flex justify-center items-center py-8 text-gray-500">
          해당 기간에 작성된 보고서가 없습니다.
        </div>
      ) : (
        currentPageData.map((report, i) => (
          <li
            key={report.id}
            className="flex border-b border-gray-400 bg-gray-0 flex-1"
          >
            {/* 순번 */}
            <div
              className={cn(
                "my-3 mx-6 body-1 font-medium text-gray-800 text-center w-[76px]"
              )}
            >
              {i + 1}
            </div>

            {/* 활동명 */}
            <div
              className={cn(
                "my-3 mx-6 body-1 font-medium text-left max-w-[892px] flex-1 cursor-pointer"
              )}
              onClick={() => {
                push(
                  `${pathname}/${report.id}?status=${report.status}&clubId=${clubId}`
                );
              }}
            >
              {report.eventName}
            </div>

            {/* 활동일 */}
            <div
              className={cn(
                "my-3 mx-6 body-1 font-medium text-center max-w-[220px] flex-1"
              )}
            >
              {Array.isArray(report.activityDate)
                ? report.activityDate.join("-")
                : report.activityDate || "-"}
            </div>

            {/* 작성 상태 */}
            <div
              className={cn(
                "my-3 mx-6 body-1 font-medium text-center max-w-[180px] flex-1",
                report.status === "APPROVED" ? " text-point-blue" : "",
                report.status === "REJECTED" ? " text-point-red" : ""
              )}
            >
              {report.status === "PENDING" && "대기"}
              {report.status === "APPROVED" && "승인"}
              {report.status === "REJECTED" && "반려"}
            </div>

            {/* 반려 사유 */}
            <div
              className={cn(
                "my-3 mx-6 body-1 font-medium text-center max-w-[180px] flex-1"
              )}
            >
              {report.status === "REJECTED" && report.rejectReason
                ? report.rejectReason
                : "-"}
            </div>
          </li>
        ))
      )}
    </ul>
  );
}
