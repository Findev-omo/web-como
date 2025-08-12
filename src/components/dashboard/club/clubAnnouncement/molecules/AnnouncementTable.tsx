"use client";

import { useMemo } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  // const { showToast } = useToast(); // This line is removed as per the edit hint.

  const itemsPerPage = 10; // 페이지당 항목 수

  const noticesQueryKey = useMemo(
    () => ["club", "notices", "list", currentPage, ""],
    [currentPage]
  );

  const { data, isLoading } = useQuery({
    queryKey: noticesQueryKey,
    queryFn: async () => {
      try {
        const result = await getNotices(currentPage, "");
        // 상세에서 삭제 직후 돌아온 경우, sessionStorage에 기록된 삭제 ID를 제외
        let list = result?.list || [];
        try {
          const deleted = JSON.parse(
            sessionStorage.getItem("deletedNoticeIds") || "[]"
          );
          if (Array.isArray(deleted) && deleted.length) {
            list = list.filter((n) => !deleted.includes(n.id));
          }
        } catch {}
        return list as ClubNotice[];
      } catch (error) {
        if (error instanceof ApiError && error.code === "UNAUTHORIZED") {
          toast.error(error.message);
          await deleteAllCookies();
          push("/login");
        } else {
          toast.error("공지사항 목록을 불러오는 데 실패했습니다.");
        }
        return [] as ClubNotice[];
      }
    },
    staleTime: 60_000,
    gcTime: 300_000,
  });

  const notices = data ?? [];

  // 최대 2개까지 고정 가능하도록 pin/unpin 구현 (React Query 기반)
  const { mutate: mutatePin } = useMutation({
    mutationFn: pinNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club", "notices"] });
    },
    onError: () => toast.error("공지사항 고정에 실패했습니다."),
  });
  const { mutate: mutateUnpin } = useMutation({
    mutationFn: unpinNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club", "notices"] });
    },
    onError: () => toast.error("공지사항 고정 해제에 실패했습니다."),
  });

  const handlePin = (noticeId: number) => {
    const pinnedCount = notices.filter((n) => n.isPinned).length;
    if (pinnedCount >= 2) {
      toast.error("공지사항 상단 고정은 2개까지 가능합니다.");
      return;
    }
    mutatePin(noticeId);
  };
  const handleUnpin = (noticeId: number) => {
    mutateUnpin(noticeId);
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
      } as any;
      localStorage.setItem("noticeDetail", JSON.stringify(detail));
      push(`${pathname}/${noticeId}`);
    } catch (error) {
      // 삭제되었거나 접근 불가 시 상세 진입 차단
      toast.error(
        "공지사항을 불러올 수 없습니다. 삭제되었거나 존재하지 않습니다."
      );
      // 목록이 서버와 불일치할 수 있으므로 즉시 목록 캐시 무효화 → 재조회
      // 현재 세션에서 해당 항목을 즉시 숨김 처리
      try {
        const key = "invalidNoticeIds";
        const prev = JSON.parse(sessionStorage.getItem(key) || "[]");
        const next = Array.isArray(prev)
          ? Array.from(new Set([...prev, noticeId]))
          : [noticeId];
        sessionStorage.setItem(key, JSON.stringify(next));
      } catch {}
      // 현재 캐시된 모든 목록에서 해당 항목 제거 (낙관적 동기화)
      const allLists = queryClient.getQueriesData<ClubNotice[]>({
        queryKey: ["club", "notices", "list"],
      });
      allLists.forEach(([key, data]) => {
        if (Array.isArray(data)) {
          queryClient.setQueryData(
            key,
            data.filter((n) => n.id !== noticeId)
          );
        }
      });
      await queryClient.invalidateQueries({ queryKey: ["club", "notices"] });
    }
  };

  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteNotice,
    onSuccess: async (_res, noticeId) => {
      toast.success("공지사항이 삭제되었습니다.");
      try {
        localStorage.removeItem("noticeDetail");
      } catch {}
      // 동일 세션에서 즉시 숨김(서버가 느리게 반영되어도 리스트엔 안 보이도록)
      try {
        const key = "deletedNoticeIds";
        const prev = JSON.parse(sessionStorage.getItem(key) || "[]");
        const next = Array.isArray(prev)
          ? Array.from(new Set([...prev, noticeId]))
          : [noticeId];
        sessionStorage.setItem(key, JSON.stringify(next));
      } catch {}
      // 모든 페이지 캐시에서 해당 항목 제거 (낙관적 반영)
      const allLists = queryClient.getQueriesData<ClubNotice[]>({
        queryKey: ["club", "notices", "list"],
      });
      allLists.forEach(([key, data]) => {
        if (Array.isArray(data)) {
          queryClient.setQueryData(
            key,
            data.filter((n) => n.id !== noticeId)
          );
        }
      });
      // 서버 재검증으로 최종 동기화
      await queryClient.invalidateQueries({ queryKey: ["club", "notices"] });
    },
    onError: () => {
      toast.error("공지사항 삭제에 실패했습니다.");
    },
  });

  const handleDelete = async (noticeId: number) => {
    mutateDelete(noticeId);
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
      {currentNotices.map((notice, idx) => {
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
