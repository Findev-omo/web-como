import { notFound } from "next/navigation";
import ScheduleDetailCard from "@/components/dashboard/club/schedule/molecues/ScheduleDetail/ScheduleDetailCard";
import ScheduleMemberListCard from "@/components/dashboard/club/schedule/molecues/ScheduleMemberListCard";
import { getData } from "@/api/action";

// Constants
const PAGE_TYPES = {
  REGISTER: "REGISTER",
  DETAIL: "DETAIL",
  EDIT: "EDIT",
  MEMBERS: "MEMBERS",
} as const;

const API_ENDPOINTS = {
  DETAIL: "v1/executive/club/{clubId}/activity",
  MEMBERS: "v1/executive/club/{clubId}/schedule/{id}/members",
} as const;

// Types
export type PageType = (typeof PAGE_TYPES)[keyof typeof PAGE_TYPES];

interface PageProps {
  params: {
    id: string;
    type?: PageType;
    page?: string;
  };
  searchParams: { page?: string };
}

// Utility functions
const getPageType = (id: string): PageType => {
  if (id === "register") return PAGE_TYPES.REGISTER;
  if (id.includes("/edit")) {
    return PAGE_TYPES.EDIT;
  }
  return PAGE_TYPES.DETAIL;
};

export const fetchScheduleData = async (id: string, page: string) => {
  const detailResponse = await getData(
    `${API_ENDPOINTS.DETAIL}/${id}`,
    true,
    undefined,
    { noCache: true }
  );
  const memberListResponse = await getData(
    `${API_ENDPOINTS.MEMBERS.replace("{id}", id)}?page=${page}`,
    true,
    undefined,
    { noCache: true }
  );

  const raw = detailResponse?.data ?? {};

  const toIsoDate = (value: any): string => {
    if (!value) return new Date().toISOString();
    if (Array.isArray(value) && value.length >= 3) {
      const [y, m, d] = value;
      const dt = new Date(Number(y), Number(m) - 1, Number(d));
      return isNaN(dt.getTime()) ? new Date().toISOString() : dt.toISOString();
    }
    if (typeof value === "string") {
      const base = value.includes("T") ? value.split("T")[0] : value;
      const [y, m, d] = base.split("-");
      const dt = new Date(Number(y), Number(m) - 1, Number(d));
      return isNaN(dt.getTime()) ? new Date().toISOString() : dt.toISOString();
    }
    return new Date().toISOString();
  };

  const initialData = {
    title: raw?.title ?? raw?.name ?? "",
    description:
      raw?.detail ??
      raw?.description ??
      raw?.details ??
      raw?.content ??
      raw?.activityContent ??
      raw?.activityDetail ??
      raw?.activityDescription ??
      "",
    date: (() => {
      const v = raw?.date ?? raw?.activityDate ?? raw?.createdDate;
      if (!v) return new Date().toISOString();
      if (Array.isArray(v)) {
        const [y, m, d] = v;
        return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      }
      if (typeof v === "string") return v;
      return new Date().toISOString();
    })(),
    time: raw?.time ?? raw?.activityTime ?? "",
    location:
      raw?.roadAddress ?? raw?.location ?? raw?.address ?? raw?.place ?? "",
    addressDetail: raw?.placeName ?? raw?.addressDetail ?? "",
    recruitStartDate: toIsoDate(raw?.recruitStartDate),
    recruitEndDate: toIsoDate(raw?.recruitEndDate),
  };

  return {
    initialData,
    memberList: memberListResponse.data,
  };
};

// Components
const ScheduleContent = ({
  type,
  initialData,
  memberList,
  scheduleId,
}: {
  type: PageType;
  initialData?: any;
  memberList?: any;
  scheduleId?: number;
}) => (
  <div className="flex flex-col gap-3">
    <ScheduleDetailCard
      scheduleId={scheduleId}
      type={type}
      initialData={initialData}
    />
    <ScheduleMemberListCard type={type} memberList={memberList} />
  </div>
);

// Main Component
export const dynamic = "force-dynamic";

export default async function ScheduleDetailPage({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  try {
    const pageType = getPageType(id);
    let scheduleId = id;
    const page = searchParams.page || "1";

    if (pageType === PAGE_TYPES.DETAIL || pageType === PAGE_TYPES.EDIT) {
      const { initialData, memberList } = await fetchScheduleData(
        scheduleId,
        page
      );

      return (
        <ScheduleContent
          type={pageType}
          scheduleId={Number(scheduleId)}
          initialData={initialData}
          memberList={memberList}
        />
      );
    }

    return <ScheduleContent type={pageType} />;
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
    notFound();
  }
}
