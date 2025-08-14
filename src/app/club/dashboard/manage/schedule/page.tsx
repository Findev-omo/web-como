import { getData } from "@/api/action";
import ScheduleList from "@/components/dashboard/club/schedule/molecues/ScheduleList";
import ScheduleTitle from "@/components/dashboard/club/schedule/molecues/ScheduleTitle";

export default async function ManageSchedulePage({
  searchParams: { page = "1" },
}: {
  searchParams: { page?: string };
}) {
  const safePage =
    Number.isFinite(Number(page)) && Number(page) > 0 ? page : "1";
  const serverPage = Math.max(0, Number(safePage) - 1); // 서버 0-base 가정
  // 활동(일정) 리스트는 activity로 변경된 사양에 맞춰 호출
  const response = await getData(
    `v1/executive/club/{clubId}/activity?page=${serverPage}`,
    true
  );
  console.log("[ActivityList] raw response", response);
  const data = response.data;
  console.log("[ActivityList] parsed data", data, { safePage, serverPage });

  const toDateArray = (val?: any): number[] => {
    if (!val) return [] as unknown as number[];
    try {
      // 지원 포맷: 'YYYY-MM-DD', ISO string, number[], etc.
      if (Array.isArray(val) && val.length >= 3) return val as number[];
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
      }
      if (typeof val === "string") {
        const m = val.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
        if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
      }
    } catch {}
    return [] as unknown as number[];
  };

  const extractItems = (payload: any): any[] => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.List)) return payload.List;
    if (Array.isArray(payload.list)) return payload.list;
    if (Array.isArray(payload.activities)) return payload.activities;
    if (Array.isArray(payload.activityList)) return payload.activityList;
    if (Array.isArray(payload.content)) return payload.content;
    if (payload.data && Array.isArray(payload.data)) return payload.data;
    if (payload.data && Array.isArray(payload.data.List))
      return payload.data.List;
    if (payload.data && Array.isArray(payload.data.list))
      return payload.data.list;
    return [];
  };

  let items = extractItems(data);
  let mapped = items.map((item: any) => ({
    id:
      item?.id ??
      item?.activityId ??
      item?.activityID ??
      item?.activity_id ??
      0,
    title: item?.title ?? item?.name ?? item?.content ?? "(제목 없음)",
    createdDate: toDateArray(
      item?.createdAt ?? item?.createDate ?? item?.date ?? item?.activityDate
    ),
  }));

  let normalized = {
    List: mapped,
    currentPage:
      (typeof data?.currentPage === "number"
        ? Number(data.currentPage)
        : typeof data?.page === "number"
          ? Number(data.page)
          : serverPage) + 1, // UI는 1-base
    maxPage: data?.maxPage ?? data?.totalPages ?? 1,
  };
  console.log("[ActivityList] normalized", normalized);

  // Fallback: 요청한 페이지가 총 페이지 수를 초과하여 비어있는 경우 마지막 페이지로 재조회
  if (
    normalized.List.length === 0 &&
    Number(normalized.currentPage) > Number(normalized.maxPage) &&
    Number(normalized.maxPage) >= 1
  ) {
    const fallbackPage = String(normalized.maxPage);
    console.log("[ActivityList] fallback fetching page=", fallbackPage);
    const fallbackServerPage = Math.max(0, Number(fallbackPage) - 1);
    const fallbackRes = await getData(
      `v1/executive/club/{clubId}/activity?page=${fallbackServerPage}`,
      true
    );
    const fData = fallbackRes.data;
    console.log("[ActivityList] fallback parsed data", fData);
    items = extractItems(fData);
    mapped = items.map((item: any) => ({
      id:
        item?.id ??
        item?.activityId ??
        item?.activityID ??
        item?.activity_id ??
        0,
      title: item?.title ?? item?.name ?? item?.content ?? "(제목 없음)",
      createdDate: toDateArray(
        item?.createdAt ?? item?.createDate ?? item?.date ?? item?.activityDate
      ),
    }));
    normalized = {
      List: mapped,
      currentPage:
        (typeof fData?.currentPage === "number"
          ? Number(fData.currentPage)
          : typeof fData?.page === "number"
            ? Number(fData.page)
            : fallbackServerPage) + 1,
      maxPage: fData?.maxPage ?? fData?.totalPages ?? 1,
    };
    console.log("[ActivityList] fallback normalized", normalized);
  }
  // 페이지 범위를 벗어나도 서버 리다이렉트하지 않고 그대로 렌더합니다.
  // 클라이언트 페이지네이션에서 보정하도록 처리합니다.

  // const isExist = await getData(
  //   `v1/executive/club/{clubId}/schedule/existence`,
  //   true
  // );

  return (
    <>
      <ScheduleTitle />
      {normalized.List.length === 0 && (
        <div className="p-4 mb-4 rounded bg-gray-50 border border-gray-200">
          <div className="mb-2 body-1 font-semibold text-gray-900">
            디버그: 원본 응답 데이터
          </div>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
      <ScheduleList
        schedules={normalized.List}
        currentPage={normalized.currentPage}
        maxPage={normalized.maxPage}
        // isExist={isExist.data}
      />
    </>
  );
}
