"use client";
import BackButton from "@/components/dashboard/common/BackButton";
import { useSearchParams } from "next/navigation";
import ReportDetail from "@/components/dashboard/company/club/organisms/ReportDetail";
import { useEffect, useState } from "react";
import { getReportDetail } from "@/api/actions/company/report/getReportDetail";
import { ActivityReportDetail } from "@/api/types/company/report";
import Image from "next/image";
import ReportConfirmModal from "@/components/dashboard/company/club/modals/ReportConfirmModal";
import { patchApprove } from "@/api/actions/company/report/patchApprove";
import RejectReasonInputModal from "@/components/dashboard/company/club/modals/RejectReasonInputModal";
import AlertModal from "@/components/dashboard/company/club/modals/AlertModal";
import {
  useRejectReport,
  useCompanyReportRejectionReason,
} from "@/hooks/queries/company";

export default function Page({ params }: { params: { id: string } }) {
  const initialStatus = useSearchParams().get("status");
  const [reportDetail, setReportDetail] = useState<ActivityReportDetail | null>(
    null
  );
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState(false);

  const rejectReportMutation = useRejectReport();
  const {
    data: rejectionReasonData,
    isLoading: isLoadingRejectionReason,
    error: rejectionReasonError,
  } = useCompanyReportRejectionReason(Number(params.id));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReportDetail(Number(params.id));
        setReportDetail(data);
      } catch (error) {
        console.error("보고서 상세 정보 가져오기 실패:", error);
        // API 실패 시 기본 데이터로 표시
        const fallbackData: ActivityReportDetail = {
          clubImage: "",
          clubName: "동호회명",
          writerName: "작성자",
          writerRole: "",
          writerDepartment: "",
          eventName: "활동명",
          activityDate: [],
          activityTime: [],
          location: "",
          locationDetail: "",
          participantCount: 0,
          activityContent:
            "API 호출에 실패했습니다. 잠시 후 다시 시도해주세요.",
          note: "",
          photos: [],
          expenses: [],
        };
        setReportDetail(fallbackData);
      }
    };
    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (rejectionReasonData) {
      console.log("반려 사유 데이터:", rejectionReasonData);
      setRejectReason(rejectionReasonData.reason || "");
    }
  }, [rejectionReasonData]);

  // 반려 사유가 로딩 중일 때 표시할 내용
  const shouldShowLoading = isLoadingRejectionReason && status === "REJECTED";
  if (!reportDetail) return <div>loading...</div>;
  return (
    <>
      <div className="no-print">
        <BackButton />
        {status !== "REJECTED" && (
          <div className="p-8 rounded-xl bg-gray-0 flex justify-between items-center mt-4">
            <div
              className={`flex items-center gap-[12px] ${
                status === "APPROVED" || status === "REJECTED"
                  ? "justify-between w-full"
                  : ""
              }`}
            >
              <h2 className="font-bold text-gray-900 text-[20px]">
                {"활동 보고서"}
              </h2>
              <button className="" onClick={() => window.print()}>
                <Image
                  src={"/document.png"}
                  alt="report"
                  width={32}
                  height={32}
                />
              </button>
            </div>
            <div
              className={`flex space-x-3 ${
                status === "APPROVED" || status === "REJECTED" ? "hidden" : ""
              }`}
            >
              <button
                className="bg-gray-800 text-gray-0 rounded-md font-[500] font-suit px-[16px] py-[4px]"
                onClick={() => {
                  setApproveOpen(true);
                }}
              >
                승인
              </button>
              <button
                className="border border-point-red text-point-red rounded-md font-[500] font-suit px-[16px] py-[4px]"
                onClick={() => {
                  setRejectOpen(true);
                }}
              >
                반려
              </button>
            </div>
          </div>
        )}
        {status === "REJECTED" && (
          <div className="flex items-start gap-3 bg-gray-0 rounded-xl px-6 py-5 my-4 shadow w-full min-h-[100px]">
            {/* 아이콘 */}
            <div className="w-8 h-8 rounded-full bg-[#FD7E2D] text-white flex items-center justify-center font-bold text-lg mr-2 shrink-0">
              !
            </div>
            {/* 내용 */}
            <div className="flex-1">
              <div className="text-[#FD7E2D] font-bold text-base mb-1">
                반려 사유
              </div>
              <div className="text-gray-500 text-sm mb-2">
                당사의 활동지원비 규정을 검토한 결과 지원 신청이 반려되었습니다.
                재작성 부탁드립니다.
              </div>
              <div className="text-gray-900 font-medium text-base text-left">
                {shouldShowLoading ? (
                  <div className="text-gray-400">
                    반려 사유를 불러오는 중...
                  </div>
                ) : rejectionReasonError ? (
                  <div className="text-red-500">
                    반려 사유를 불러오는데 실패했습니다.
                  </div>
                ) : (
                  rejectReason || "반려 사유가 없습니다."
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <ReportDetail data={reportDetail} />
      </div>
      <ReportConfirmModal
        open={approveOpen}
        type="approve"
        clubName={reportDetail.clubName}
        onClose={() => {
          setApproveOpen(false);
        }}
        onConfirm={async () => {
          await patchApprove(Number(params.id));
          setApproveOpen(false);
          setStatus("APPROVED");
          setAlertOpen(true);
        }}
      />
      <AlertModal
        open={alertOpen}
        type={status || ""}
        contentType="보고서"
        onClose={() => setAlertOpen(false)}
      />
      <RejectReasonInputModal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onReject={async () => {
          console.log("반려 처리 시작:", {
            reportId: Number(params.id),
            reason: rejectReason,
          });
          try {
            await rejectReportMutation.mutateAsync({
              reportId: Number(params.id),
              reason: rejectReason,
            });
            console.log("반려 처리 성공");
            setRejectOpen(false);
            setStatus("REJECTED");
            setAlertOpen(true);
          } catch (error) {
            console.error("반려 처리 실패:", error);
          }
        }}
      />
    </>
  );
}
