"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn, formatDate, openModal } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getData } from "@/api/action";
import { getAccessToken } from "@/lib/cookies";
import ApprovalButton from "@/components/dashboard/shared/molecules/ApprovalButton";
import toast from "react-hot-toast";
import type { ClubApplication } from "@/api/types/company/club";

type ApplicationStatus = "new" | "active" | "reject" | "revert" | "leave";

const tableHeadings = [
  "순번",
  "신청자",
  "부서",
  "동호회명",
  "동호회 한줄소개",
  "신청일",
  "상태",
];

interface ApplicationTableProps {
  applications: ClubApplication[];
}

export default function ApplicationTable({
  applications,
}: ApplicationTableProps) {
  const pathname = usePathname();
  const { push } = useRouter();
  // const { showToast } = useToast(); // Removed as per edit hint

  console.log("applications", applications);

  const getStatus = (status: string): ApplicationStatus => {
    switch (status) {
      case "PENDING":
        return "new";
      case "APPROVED":
        return "active";
      case "REJECTED":
        return "reject";
      default:
        return "new";
    }
  };

  const formatAppliedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDate(date);
    } catch (error) {
      console.error("Invalid date string:", dateString);
      return "";
    }
  };

  const handleApprove = async (clubId: number, applicantId: number) => {
    const token = await getAccessToken();
    try {
      const response = await fetch(`/api/server/v1/executive/club/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          executiveId: applicantId, // 사용자 ID
          clubId: clubId, // 클럽 ID
        }),
      });

      if (!response.ok) {
        throw new Error("승인 처리 실패");
      }

      const data = await response.json();
      if (data.resultCode === "OK") {
        // alert("신청이 성공적으로 승인되었습니다."); // 알림 추가
        toast.success("신청이 성공적으로 승인되었습니다.");
        window.location.reload(); // 페이지 새로고침
      }
    } catch (error) {
      console.error("동호회 승인 처리 오류:", error);
    }
  };

  const handleRevert = () => {
    // TODO: api 연동
    toast.success("반려 철회되었습니다.");
    // showToast("반려 철회되었습니다.", "success");
  };

  return (
    <ul className="flex flex-col gap-1">
      <li className="flex border-y border-gray-400 bg-gray-200">
        {tableHeadings.map((heading, i) => (
          <div
            key={heading}
            className={cn(
              "my-3 mx-6 body-1 font-bold text-gray-900",
              i === 0 ? "w-8" : "flex-1",
              [1, 5].includes(i)
                ? "max-w-24"
                : i === 2
                  ? "max-w-40"
                  : i === 3
                    ? "max-w-60"
                    : "",
              [3, 4].includes(i) ? "" : "text-center",
              i === 6 ? "flex items-center justify-center max-w-48 m-0" : ""
            )}
          >
            {heading}
          </div>
        ))}
      </li>
      {applications &&
        applications.length > 0 &&
        applications.map((application, idx) => (
          <li
            key={application.clubId}
            className="flex border-b border-gray-400 bg-gray-0"
          >
            {[
              application.clubId,
              application.applicantName,
              application.department,
              application.clubName,
              application.clubSummary,
              formatAppliedDate(application.appliedDate),
              getStatus(application.status),
            ].map((data, i) => (
              <div
                key={data}
                className={cn(
                  "my-3 mx-6 body-1 font-medium underline-offset-2 underline decoration-transparent line-clamp-1 transition duration-300",
                  i === 0 ? "w-8" : "flex-1",
                  [1, 5].includes(i)
                    ? "max-w-24"
                    : i === 2
                      ? "max-w-40"
                      : i === 3
                        ? "max-w-60"
                        : "",
                  [1, 3, 4].includes(i)
                    ? "hover:decoration-gray-800 cursor-pointer"
                    : "",
                  [3, 4].includes(i) ? "" : "text-center",
                  i === 6
                    ? "flex items-center justify-center gap-2 max-w-48 m-0"
                    : "",
                  data === "leave"
                    ? "text-gray-500"
                    : data === "revert"
                      ? "text-point-red"
                      : data === "active"
                        ? "text-point-blue"
                        : "text-gray-800"
                )}
                onClick={() => {
                  if (i === 1) {
                    openModal("applicant-profile", {
                      applicantId: application.applicantId,
                    });
                  } else if ([3, 4].includes(i)) {
                    push(
                      `${pathname}/${application.clubId}?status=${getStatus(application.status)}`
                    );
                  }
                }}
              >
                {i === 0 ? (
                  idx + 1
                ) : i === 5 ? (
                  data
                ) : i !== 6 ? (
                  data
                ) : data === "leave" ? (
                  "탈퇴"
                ) : data === "revert" ? (
                  "반려 취소"
                ) : data === "active" ? (
                  "활동중"
                ) : data === "reject" ? (
                  // <button
                  //   className="py-1 px-4 rounded border border-point-red body-1 font-medium text-point-red bg-gray-0"
                  //   onClick={() => openModal("revert-rejection")}
                  // >
                  //   {"반려 취소"}
                  // </button>
                  <span className="text-point-red body-1 font-medium">
                    {"반려됨"}
                  </span>
                ) : data === "new" ? (
                  <>
                    <ApprovalButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(
                          application.clubId,
                          application.applicantId
                        );
                      }}
                      content={"승인"}
                    />
                    <ApprovalButton
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("reject-application", {
                          clubId: application.clubId,
                          clubName: application.clubName,
                        });
                        // handleReject(application.clubId);
                      }}
                      content={"반려"}
                    />
                  </>
                ) : (
                  ""
                )}
              </div>
            ))}
          </li>
        ))}
    </ul>
  );
}
