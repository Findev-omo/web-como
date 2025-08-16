"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Pin } from "@/assets/icons/info";
import { Notice } from "@/api/types/notice";
import {
  deleteNotice,
  getNoticeDetail,
  pinNotice,
  unpinNotice,
} from "@/api/actions/club/notice";
import { getNotices } from "@/api/actions/club/notice/getNotices";
import { HiOutlineTrash } from "react-icons/hi2";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { ClubNotice } from "@/api/services/club";
import { ApiError } from "@/api/client";
import { deleteAllCookies } from "@/lib/cookies";

const tableHeadings = [
  "순번",
  "제목",
  "작성자",
  "작성일자",
  "조회수",
  "게시 상태",
];

function AnnouncementTable({ currentPage }: { currentPage: number }) {
  const pathname = usePathname();
  const { push } = useRouter();
  const [notices, setNotices] = useState<ClubNotice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const { showToast } = useToast(); // This line is removed as per the edit hint.

  const itemsPerPage = 10; // 페이지당 항목 수

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const result = await getNotices(currentPage, "");
        setNotices(result?.list || []);
      } catch (error) {
        if (error instanceof ApiError && error.code === "UNAUTHORIZED") {
          toast.error(error.message);
          await deleteAllCookies();
          push("/login");
        } else {
          toast.error("공지사항 목록을 불러오는 데 실패했습니다.");
        }
        setNotices([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotices();
  }, [currentPage, push]);

  // 최대 2개까지 고정 가능하도록 pin/unpin 구현
  const handlePin = (noticeId: number) => {
    const pinnedCount = notices.filter((n) => n.isPinned).length;
    if (pinnedCount >= 2) {
      toast.error("공지사항 상단 고정은 2개까지 가능합니다.");
      return;
    }
    setNotices((prev) =>
      prev.map((n) => (n.id === noticeId ? { ...n, isPinned: true } : n))
    );
    pinNotice(noticeId);
  };
  const handleUnpin = (noticeId: number) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === noticeId ? { ...n, isPinned: false } : n))
    );
    unpinNotice(noticeId);
  };

  const handleTitleClick = async (noticeId: number) => {
    if (!noticeId || noticeId === undefined) {
      toast.error("공지사항 ID가 유효하지 않습니다.");
      return;
    }

    try {
      let detail = await getNoticeDetail(noticeId);
      detail = {
        ...detail,
        isPinned: notices.find((n) => n.id === noticeId)?.isPinned,
      };
      // 상세 페이지에서 활용할 수 있도록 localStorage에 저장 (또는 필요시 state로 전달)
      localStorage.setItem("noticeDetail", JSON.stringify(detail));
      push(`${pathname}/${noticeId}`);
    } catch (error) {
      toast.error("공지사항 상세 정보를 불러오지 못했습니다.");
    }
  };

  const handleDelete = async (noticeId: number) => {
    await deleteNotice(noticeId);
    toast.success("공지사항이 삭제되었습니다.");
    setNotices((prev) => prev.filter((n) => n.id !== noticeId));
  };
  if (isLoading) {
    return "Loading...";
  }

  if (!notices.length) {
    return (
      <div className="flex items-center justify-center border-b border-gray-400 bg-gray-0 h-96">
        <p className="body-1 font-medium text-gray-800">
          등록된 공지사항이 없습니다.
        </p>
      </div>
    );
  }

  const pinnedNotices = notices.filter((n) => n.isPinned);
  const normalNotices = notices.filter((n) => !n.isPinned);

  // pinnedNotices와 normalNotices를 합쳐서 현재 페이지에 맞는 항목만 가져오기
  const allNotices = [...pinnedNotices, ...normalNotices];
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotices = allNotices.slice(startIndex, endIndex); // 현재 페이지에 맞는 항목만 가져오기

  return (
    <ul className="flex flex-col gap-1">
      <li className="flex border-y border-gray-400 bg-gray-200">
        {tableHeadings.map((heading, i) => (
          <div
            key={`heading-${i}`}
            className={cn(
              "my-3 mx-6 body-1 font-bold text-gray-900",
              i === 0 ? "w-8" : "flex-1",
              i === 1 ? "" : "text-center",
              i === 4 ? "max-w-20" : "",
              [2, 3].includes(i) ? "max-w-36" : "",
              i === 5
                ? "flex items-center justify-center min-w-32 max-w-48 m-0"
                : ""
            )}
          >
            {heading}
          </div>
        ))}
      </li>
      {currentNotices?.map((notice, idx) => {
        // 각 공지사항마다 별도의 클릭 핸들러 생성 (클로저 문제 해결)
        const handleCurrentNoticeClick = () => {
          handleTitleClick(notice.id);
        };

        return (
          <li
            key={notice.id || `notice-${idx}`}
            className="flex border-b border-gray-400 bg-gray-0"
          >
            {[
              notice.id,
              notice.title,
              notice.author,
              formatDate(new Date(notice.createdAt)),
              notice.viewCount,
              notice.isPinned,
            ].map((data, i) => (
              <div
                key={`${notice.id || idx}-${i}`}
                className={cn(
                  "my-3 mx-6 body-1 font-medium underline-offset-2 underline decoration-transparent line-clamp-1 transition duration-300",
                  i === 0 ? "w-8" : "flex-1",
                  i === 1
                    ? "flex items-center hover:decoration-gray-800 cursor-pointer hover:underline"
                    : "text-center",
                  i === 4 ? "max-w-20" : "",
                  [2, 3].includes(i) ? "max-w-36" : "",
                  i === 5
                    ? "flex items-center justify-center gap-2 min-w-32 max-w-48 m-0"
                    : "",
                  "text-gray-800"
                )}
                onClick={i === 1 ? handleCurrentNoticeClick : undefined}
              >
                {i === 0 ? (
                  startIndex + idx + 1 // 현재 페이지의 인덱스 계산
                ) : i === 1 ? (
                  <>
                    {notice.isPinned && (
                      <div className="mr-2 px-1">
                        <Pin />
                      </div>
                    )}
                    <p className="flex-1 line-clamp-1">{data}</p>
                  </>
                ) : i === 5 ? (
                  notice.isPinned ? (
                    <>
                      <button
                        className="py-1 px-4 rounded border border-gray-800 body-1 font-medium text-gray-800 bg-gray-0 mr-2"
                        onClick={() => handleUnpin(notice.id)}
                      >
                        {"고정 해제"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="py-1 px-4 rounded body-1 font-medium text-gray-50 bg-gray-800 mr-2"
                        onClick={() => handlePin(notice.id)}
                      >
                        {"고정"}
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="py-1 px-4 rounded border border-point-red body-1 font-medium text-point-red bg-gray-0"
                      >
                        {"삭제"}
                      </button>
                    </>
                  )
                ) : (
                  data
                )}
              </div>
            ))}
          </li>
        );
      })}
    </ul>
  );
}

export default AnnouncementTable;
