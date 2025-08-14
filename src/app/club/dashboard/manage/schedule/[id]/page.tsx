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
  MEMBERS: "v1/executive/club/{clubId}/activity/{id}/members",
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
  // 강제 최신화: 상세/명단 모두 캐시 사용 안함
  const detailResponse = await getData(
    `${API_ENDPOINTS.DETAIL}/${id}`,
    true,
    undefined,
    { cache: "no-store", revalidate: 0 }
  );
  const memberListResponse = await getData(
    `${API_ENDPOINTS.MEMBERS.replace("{id}", id)}?page=${page}`,
    true,
    undefined,
    { cache: "no-store", revalidate: 0 }
  );

  // normalize detail payload to ScheduleDetailCardInitialData shape
  const raw = detailResponse?.data as any;

  const toDateString = (val?: any): string => {
    try {
      if (!val) return new Date().toISOString().slice(0, 10);
      if (Array.isArray(val) && val.length >= 3) {
        const [y, m, d] = val;
        const mm = String(Number(m)).padStart(2, "0");
        const dd = String(Number(d)).padStart(2, "0");
        return `${y}-${mm}-${dd}`;
      }
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    } catch {}
    return new Date().toISOString().slice(0, 10);
  };

  const toTimeString = (val?: any): string => {
    try {
      if (!val)
        return new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      if (Array.isArray(val) && val.length >= 2) {
        const [h, m] = val;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      }
      if (typeof val === "string") {
        const m = val.match(/^(\d{1,2}):(\d{2})/);
        if (m) return `${m[1].padStart(2, "0")}:${m[2]}`;
        const d = new Date(`1970-01-01T${val}`);
        if (!isNaN(d.getTime()))
          return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      }
    } catch {}
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const initialData = raw
    ? (() => {
        const locRaw = (
          raw?.location ??
          raw?.address ??
          raw?.roadAddress ??
          ""
        ).toString();
        const detailRaw = (
          raw?.addressDetail ??
          raw?.locationDetail ??
          raw?.placeName ??
          ""
        ).toString();

        // 상세주소가 location 문자열에 합쳐져 내려오는 경우 분리 처리
        const splitLocation = (location: string, detail: string): string => {
          if (!location || !detail) return location?.trim();
          const normalizedLoc = location.replace(/\s+/g, " ").trim();
          const normalizedDet = detail.replace(/\s+/g, " ").trim();
          // 케이스1: 끝에 상세주소가 붙어있는 경우
          if (normalizedLoc.endsWith(normalizedDet)) {
            return normalizedLoc
              .slice(0, normalizedLoc.length - normalizedDet.length)
              .trim();
          }
          // 케이스2: 중간에 한번 포함되어 있는 경우 (첫 발생만 제거)
          const idx = normalizedLoc.indexOf(normalizedDet);
          if (idx > -1) {
            return (
              normalizedLoc.slice(0, idx) +
              normalizedLoc.slice(idx + normalizedDet.length)
            ).trim();
          }
          return location.trim();
        };

        // 서버가 addressDetail을 주지 않는 경우, location 끝의 비주소 토큰을 상세주소로 추정
        const guessDetailFromLocation = (
          location: string
        ): {
          base: string;
          detail: string;
        } => {
          const normalized = location.replace(/\s+/g, " ").trim();
          if (!normalized) return { base: "", detail: "" };
          const parts = normalized.split(" ").filter(Boolean);
          const hasDigits = (s: string) => /\d/.test(s);
          const isAddressSuffix = (s: string) =>
            /(동|읍|면|리|구|군|시|도|로|길|번길|대로|지하|층|호)$/.test(s);
          const isAddressToken = (s: string) =>
            hasDigits(s) || isAddressSuffix(s);

          const detailParts: string[] = [];
          while (parts.length > 0) {
            const last = parts[parts.length - 1];
            if (!isAddressToken(last)) {
              detailParts.unshift(last);
              parts.pop();
              continue;
            }
            break;
          }
          return {
            base: parts.join(" ").trim(),
            detail: detailParts.join(" ").trim(),
          };
        };

        const guessed = !detailRaw
          ? guessDetailFromLocation(locRaw)
          : { base: locRaw, detail: "" };
        const finalDetail = detailRaw || guessed.detail;
        const roadAddressOnly = splitLocation(locRaw, finalDetail);

        return {
          title: raw?.title ?? raw?.name ?? "",
          detail: raw?.Detail ?? raw?.detail ?? raw?.description ?? "",
          date: toDateString(
            raw?.date ?? raw?.activityDate ?? raw?.createdAt ?? raw?.createDate
          ),
          time: toTimeString(raw?.time ?? raw?.activityTime),
          location: roadAddressOnly,
          addressDetail: finalDetail,
          recruitStartDate: toDateString(
            raw?.recruitStartDate ?? raw?.recruitFrom
          ),
          recruitEndDate: toDateString(raw?.recruitEndDate ?? raw?.recruitTo),
        };
      })()
    : undefined;

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
