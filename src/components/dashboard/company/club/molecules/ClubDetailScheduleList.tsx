"use client";

import DateFilter, {
  DateRange,
} from "@/components/dashboard/common/DateFilter";
import Pagination from "@/components/dashboard/common/Pagination";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Data = [
  {
    id: 1,
    organizer: "주최자 A",
    name: "행사명 A",
    date: [2025, 5, 11],
    fixed: true, // 유일한 true
  },
  {
    id: 2,
    organizer: "주최자 B",
    name: "행사명 B",
    date: [2025, 5, 12],
    fixed: false,
  },
  {
    id: 3,
    organizer: "주최자 C",
    name: "행사명 C",
    date: [2025, 5, 13],
    fixed: false,
  },
  {
    id: 4,
    organizer: "주최자 D",
    name: "행사명 D",
    date: [2025, 5, 14],
    fixed: false,
  },
  {
    id: 5,
    organizer: "주최자 E",
    name: "행사명 E",
    date: [2025, 5, 15],
    fixed: false,
  },
  {
    id: 6,
    organizer: "주최자 F",
    name: "행사명 F",
    date: [2025, 5, 16],
    fixed: false,
  },
  {
    id: 7,
    organizer: "주최자 G",
    name: "행사명 G",
    date: [2025, 5, 17],
    fixed: false,
  },
  {
    id: 8,
    organizer: "주최자 H",
    name: "행사명 H",
    date: [2025, 5, 18],
    fixed: false,
  },
  {
    id: 9,
    organizer: "주최자 I",
    name: "행사명 I",
    date: [2025, 5, 19],
    fixed: false,
  },
];

export default function ClubDetailScheduleList() {
  const [currentDateRange, setCurrentDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const router = useRouter();

  const handleDateRangeChange = (dateRange: DateRange) => {
    setCurrentDateRange(dateRange);
  };
  return (
    <div className="flex w-full p-[32px] flex-col  rounded-xl bg-gray-0">
      <DateFilter
        currentDateRange={currentDateRange}
        handleDateRangeChange={handleDateRangeChange}
      />
      <div className="flex items-center mt-[16px] border-t border-b border-gray-400 bg-gray-200 py-[13.45px] font-bold ">
        <span className="max-w-[76px] w-full text-center">순번</span>
        <span className="max-w-[120px] w-full text-center ">주최자</span>
        <span className="flex-1 px-[24px]">행사명</span>
        <span className="max-w-[220px] w-full text-center ">작성일</span>
      </div>
      {Data.map((item) => {
        return (
          <div
            className="flex items-center border-b border-gray-400 py-[13.45px]   w-full "
            key={item.id}
          >
            <span className="max-w-[76px] w-full text-center  ">
              {item.id}{" "}
            </span>
            <span className="max-w-[120px] w-full  text-center  ">
              {item.organizer}{" "}
            </span>
            <span
              className="flex-1  px-[24px] min-w-0  truncate "
              onClick={() => {
                router.push(`/company/dashboard/club/event/${item.id}`);
              }}
            >
              {item.name}
            </span>
            <span className="max-w-[220px] w-full text-center">
              {item.date.map((date, idx) => {
                return <span key={idx}>{date}</span>;
              })}
            </span>
          </div>
        );
      })}
      <div className="mt-[32px]">
        <Pagination currentPage={1} maxPage={1} handlePageChange={() => {}} />
      </div>
    </div>
  );
}
