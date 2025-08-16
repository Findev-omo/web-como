"use client";

import { useRouter } from "next/navigation";
import { cn, formatDate, openModal } from "@/lib/utils";

const tableHeadings = [
  "순번",
  "작성자",
  "제목",
  "동호회명",
  "작성일",
  "조회수",
  "고정",
];

export interface ClubNotice {
  id: number;
  writerId: string;
  writerName: string;
  title: string;
  clubName: string;
  createdDate: number[];
  content: string;
  isPinned: boolean;
  viewCount?: number;
}

// 매니저용 전체 동호회 공지사항 타입
export interface ManagerClubNotice {
  id: number;
  createdDate: string;
  title: string;
  writerName: string;
  viewCount: number;
  isPinned: string; // "PINNED" | "UNPINNED"
  clubName?: string; // 동호회명이 API에서 제공되지 않을 수 있음
}

interface ClubNoticeTableProps {
  notices: (ClubNotice | ManagerClubNotice)[];
  isManagerView?: boolean; // 매니저 뷰인지 구분
}

export default function ClubNoticeTable({
  notices,
  isManagerView = false,
}: ClubNoticeTableProps) {
  const router = useRouter();

  const getStatusComponent = (isPinned: boolean | string) => {
    const pinned =
      typeof isPinned === "string" ? isPinned === "PINNED" : isPinned;
    return pinned ? "고정" : "일반";
  };

  const getStatusColor = (isPinned: boolean | string) => {
    const pinned =
      typeof isPinned === "string" ? isPinned === "PINNED" : isPinned;
    return pinned ? "text-brand-orange" : "text-gray-600";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-y border-gray-400 bg-gray-200 h-14">
            {tableHeadings.map((heading, i) => (
              <th
                key={heading}
                className={cn(
                  "body-1 font-bold text-gray-900 text-center",
                  i === 0 ? "w-[5%]" : "",
                  i === 1 ? "w-[10%]" : "",
                  i === 2 ? "w-[40%] !text-start pl-10" : "",
                  i === 3 ? "w-[15%]" : "",
                  i === 4 ? "w-[10%]" : "",
                  i === 5 ? "w-[8%]" : "",
                  i === 6 ? "w-[8%]" : ""
                )}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(notices) ? (
            notices.map((notice, idx) => {
              // 매니저 뷰와 일반 뷰의 데이터 구조가 다름
              const isManagerNotice = isManagerView && "viewCount" in notice;

              if (isManagerNotice) {
                const managerNotice = notice as ManagerClubNotice;
                return (
                  <tr
                    key={managerNotice.id}
                    className={cn(
                      "border-b border-gray-400 bg-gray-0 transition duration-200 h-14",
                      managerNotice.isPinned === "PINNED"
                        ? "cursor-pointer group hover:bg-gray-200"
                        : ""
                    )}
                    onClick={() => {}}
                  >
                    <td className="body-1 font-medium text-gray-800 text-center">
                      {idx + 1}
                    </td>
                    <td className="body-1 font-medium text-gray-800 underline underline-offset-2 decoration-transparent transition duration-200 text-center group-hover:decoration-gray-800">
                      {managerNotice.writerName}
                    </td>
                    <td className="body-1 font-medium text-gray-800 text-start pl-10">
                      {managerNotice.title}
                    </td>
                    <td className="body-1 font-medium text-gray-800 text-center">
                      {managerNotice.clubName || "-"}
                    </td>
                    <td className="body-1 font-medium text-gray-800 text-center">
                      {formatDate(new Date(managerNotice.createdDate))}
                    </td>
                    <td className="body-1 font-medium text-gray-800 text-center">
                      {managerNotice.viewCount}
                    </td>
                    <td
                      className={cn(
                        "body-1 font-medium text-center",
                        getStatusColor(managerNotice.isPinned)
                      )}
                    >
                      {getStatusComponent(managerNotice.isPinned)}
                    </td>
                  </tr>
                );
              } else {
                const clubNotice = notice as ClubNotice;
                return (
                  <tr
                    key={clubNotice.writerId}
                    className={cn(
                      "border-b border-gray-400 bg-gray-0 transition duration-200 h-14",
                      clubNotice.isPinned
                        ? "cursor-pointer group hover:bg-gray-200"
                        : ""
                    )}
                    onClick={() => {}}
                  >
                    <td className="body-1 font-medium text-gray-800 text-center">
                      {idx + 1}
                    </td>
                    <td className="body-1 font-medium text-gray-800 underline underline-offset-2 decoration-transparent transition duration-200 text-center group-hover:decoration-gray-800">
                      {clubNotice.writerName}
                    </td>
                    <td className="body-1 font-medium text-gray-800 text-start pl-10">
                      {clubNotice.title}
                    </td>
                    <td className="body-1 font-medium text-gray-800 text-center">
                      {clubNotice.clubName}
                    </td>
                    <td className="body-1 font-medium text-gray-800 text-center">
                      {Array.isArray(clubNotice.createdDate)
                        ? formatDate(
                            new Date(
                              clubNotice.createdDate[0],
                              clubNotice.createdDate[1] - 1,
                              clubNotice.createdDate[2]
                            )
                          )
                        : formatDate(new Date(clubNotice.createdDate))}
                    </td>
                    <td className="body-1 font-medium text-gray-800 text-center">
                      {clubNotice.viewCount || 0}
                    </td>
                    <td
                      className={cn(
                        "body-1 font-medium text-center",
                        getStatusColor(clubNotice.isPinned)
                      )}
                    >
                      {getStatusComponent(clubNotice.isPinned)}
                    </td>
                  </tr>
                );
              }
            })
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                데이터를 불러오는 중...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
