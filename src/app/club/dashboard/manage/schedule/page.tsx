import { getData } from "@/api/action";
import ScheduleList from "@/components/dashboard/club/schedule/molecues/ScheduleList";
import ScheduleTitle from "@/components/dashboard/club/schedule/molecues/ScheduleTitle";

export default async function ManageSchedulePage({
  searchParams: { page = "1" },
}: {
  searchParams: { page: string };
}) {
  // 새 스펙: GET /v1/executive/club/{clubId}/activity
  const response = await getData(`v1/executive/club/{clubId}/activity`, true);
  const raw = response?.data;

  // 안전한 배열 변환
  const allItems: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.list)
      ? raw.list
      : [];

  const itemsPerPage = 10;
  const totalItems = allItems.length;
  const maxPageNum = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const requestedPage = Number(page);
  const currentPageNum = Number.isFinite(requestedPage)
    ? Math.min(Math.max(1, requestedPage), maxPageNum)
    : 1;

  const startIdx = (currentPageNum - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pageItems = allItems.slice(startIdx, endIdx);

  // UI가 기대하는 형태로 매핑
  const schedules = pageItems.map((item: any, idx: number) => {
    const title = item?.title ?? item?.name ?? "";
    const created = item?.createdDate ?? item?.date ?? "";
    let createdDate: number[] = [];
    if (Array.isArray(created) && created.length >= 3) {
      createdDate = [
        Number(created[0]),
        Number(created[1]),
        Number(created[2]),
      ];
    } else if (typeof created === "string" && created) {
      const [y, m, d] = created.split("T")[0].split("-");
      createdDate = [Number(y), Number(m), Number(d)];
    }
    return {
      id: item?.id ?? startIdx + idx + 1,
      title,
      createdDate,
    };
  });

  // const isExist = await getData(
  //   `v1/executive/club/{clubId}/schedule/existence`,
  //   true
  // );

  return (
    <>
      <ScheduleTitle />
      <ScheduleList
        schedules={schedules}
        currentPage={currentPageNum}
        maxPage={maxPageNum}
        // isExist={isExist.data}
      />
    </>
  );
}
