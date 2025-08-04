"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn, formatDate, formatDateArray } from "@/lib/utils";
import { PrintButton } from "@/components/dashboard/common/DocUtil";
import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { getReportDetail } from "@/api/actions/company/report/getReportDetail";
import ReportDetailPrint from "../organisms/ReportDetailPrint";
import { CompanyReport } from "@/api/services/company";

interface Props {
  reports: CompanyReport[];
}

export default function ReportTable({ reports }: Props) {
  const pathname = usePathname();
  const { push } = useRouter();
  const [selectedReport, setSelectedReport] = useState<CompanyReport | null>(
    null
  );
  const [activityDetail, setActivityDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    contentRef: contentRef,
    documentTitle: selectedReport?.title || "활동보고서",
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  } as any);

  useEffect(() => {
    if (activityDetail && selectedReport) {
      handlePrint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityDetail, selectedReport]);

  const handlePrintClick = async (report: CompanyReport) => {
    setSelectedReport(report);
    setIsLoading(true);
    try {
      const detail = await getReportDetail(report.id);
      setActivityDetail(detail);
    } catch (error) {
      console.error("상세 데이터 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!reports) return <div>loading...</div>;
  return (
    <>
      <ul className="flex flex-col gap-1 w-full">
        <li className="flex border-y border-gray-400 bg-gray-200 w-full">
          <div className="my-3 mx-6 body-1 font-bold text-gray-900 flex-[0.5] min-w-[48px] text-center">
            순번
          </div>
          <div className="my-3 mx-6 body-1 font-bold text-gray-900 flex-1 min-w-[100px] text-center">
            작성 일자
          </div>
          <div className="my-3 mx-6 body-1 font-bold text-gray-900 flex-[2] min-w-[180px] text-center">
            동호회명
          </div>
          <div className="my-3 mx-6 body-1 font-bold text-gray-900 flex-[2] min-w-[250px] text-left">
            활동명
          </div>
          <div className="my-3 mx-6 body-1 font-bold text-gray-900 flex-1 min-w-[100px] text-center">
            활동일
          </div>
          <div className="my-3 mx-6 body-1 font-bold text-gray-900 flex-1 min-w-[80px] text-center">
            확인 상태
          </div>
          <div className="my-3 mx-6 body-1 font-bold text-gray-900 flex-[0.7] min-w-[60px] flex items-center justify-center m-0">
            인쇄
          </div>
        </li>
        {reports.map((report: CompanyReport, idx: number) => (
          <li
            key={report.id}
            className="flex border-b border-gray-400 bg-gray-0 w-full"
          >
            {/* 순번 */}
            <div className="flex-[0.5] min-w-[48px] my-3 mx-6 body-1 font-medium text-center text-gray-800">
              {idx + 1}
            </div>
            {/* 작성 일자 */}
            <div className="flex-1 min-w-[100px] my-3 mx-6 body-1 font-medium text-center text-gray-800">
              {formatDate(new Date(report.submitDate))}
            </div>
            {/* 동호회명 */}
            <div className="flex-[2] min-w-[180px] my-3 mx-6 body-1 font-medium text-center text-gray-800">
              {report.clubName}
            </div>
            {/* 활동명 */}
            <div
              className="flex-[2] min-w-[250px] my-3 mx-6 body-1 font-medium text-left hover:decoration-gray-800 cursor-pointer underline-offset-2 underline decoration-transparent line-clamp-1 transition duration-300 text-gray-800"
              onClick={() =>
                push(`${pathname}/${report.id}?status=${report.status}`)
              }
            >
              {report.title}
            </div>
            {/* 활동일 */}
            <div className="flex-1 min-w-[100px] my-3 mx-6 body-1 font-medium text-center text-gray-800">
              {/* This needs to be implemented */}
            </div>
            {/* 확인 상태 */}
            <div
              className={cn(
                "flex-1 min-w-[80px] my-3 mx-6 body-1 font-medium text-center",
                report.status === "PENDING"
                  ? "text-gray-500"
                  : report.status === "REJECTED"
                    ? "text-point-red"
                    : "text-point-blue"
              )}
            >
              {report.status === "PENDING"
                ? "미확인"
                : report.status === "REJECTED"
                  ? "반려"
                  : report.status === "APPROVED"
                    ? "승인"
                    : "-"}
            </div>
            {/* 인쇄 */}
            <div className="flex-[0.7] min-w-[60px] flex items-center justify-center gap-2 m-0 my-3 mx-6">
              {report.status === "PENDING" ? (
                "-"
              ) : (
                <PrintButton
                  onClick={() => handlePrintClick(report)}
                  disabled={isLoading}
                  className="disabled:opacity-50"
                />
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* 인쇄용 숨겨진 영역 */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={contentRef}>
          {activityDetail && <ReportDetailPrint data={activityDetail} />}
        </div>
      </div>
    </>
  );
}
