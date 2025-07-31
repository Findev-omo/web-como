"use client";

import { useEffect, useState } from "react";
import { ko } from "date-fns/locale";
import { cn, formatDate } from "@/lib/utils";
import Button from "@/components/common/Button";
import {
  subMonths,
  subWeeks,
  subYears,
  startOfToday,
  startOfYesterday,
  addDays,
  addMonths,
  addYears,
  isSameDay,
} from "date-fns";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/Skeleton";

const DatePicker = dynamic(() => import("@/components/common/DatePicker"), {
  ssr: false,
  loading: () => <Skeleton className="h-[38px]" />,
});

export interface DateRange {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface Props {
  currentDateRange: DateRange;
  handleDateRangeChange: (dateRange: DateRange) => void;
  noButtons?: boolean;
}

export default function DateFilter({
  currentDateRange,
  handleDateRangeChange,
  noButtons,
}: Props) {
  const filterButtons: { name: string; dateRange: DateRange }[] = [
    {
      name: "오늘",
      dateRange: { startDate: startOfToday(), endDate: startOfToday() },
    },
    {
      name: "어제",
      dateRange: { startDate: startOfYesterday(), endDate: startOfYesterday() },
    },
    {
      name: "1주",
      dateRange: {
        startDate: addDays(startOfToday(), -7),
        endDate: startOfToday(),
      },
    },
    {
      name: "1달",
      dateRange: {
        startDate: addMonths(startOfToday(), -1),
        endDate: startOfToday(),
      },
    },
    {
      name: "3달",
      dateRange: {
        startDate: addMonths(startOfToday(), -3),
        endDate: startOfToday(),
      },
    },
    {
      name: "6달",
      dateRange: {
        startDate: addMonths(startOfToday(), -6),
        endDate: startOfToday(),
      },
    },
    {
      name: "1년",
      dateRange: {
        startDate: addYears(startOfToday(), -1),
        endDate: startOfToday(),
      },
    },
  ];

  return (
    <div className="flex-1 flex gap-6 h-[38px]">
      {!noButtons && (
        <div className="flex gap-2 h-full">
          {filterButtons.map((filter) => (
            <button
              key={filter.name}
              className={cn(
                "flex items-center justify-center w-[60px] h-full rounded-md body-1 font-semibold transition",
                isSameDay(
                  filter.dateRange.startDate!,
                  currentDateRange.startDate!
                ) &&
                  isSameDay(
                    filter.dateRange.endDate!,
                    currentDateRange.endDate!
                  )
                  ? "text-brand-orange bg-orange-50"
                  : "text-gray-700 bg-gray-200"
              )}
              onClick={() => handleDateRangeChange(filter.dateRange)}
            >
              {filter.name}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 flex items-center space-x-3">
        <span className="h4 font-medium text-gray-600">{"기간"}</span>
        <div className="flex-1 flex gap-2">
          <DatePicker
            id="date-picker-start-date"
            currentDate={currentDateRange?.startDate}
            handleDateChange={(date: Date | undefined) =>
              handleDateRangeChange({
                startDate: date,
                endDate: currentDateRange.endDate,
              })
            }
            disabled={
              currentDateRange.endDate && { after: currentDateRange.endDate }
            }
          />
          <hr className="w-3.5 my-auto border-gray-400" />
          <DatePicker
            id="date-picker-end-date"
            currentDate={currentDateRange?.endDate}
            handleDateChange={(date: Date | undefined) =>
              handleDateRangeChange({
                startDate: currentDateRange.startDate,
                endDate: date,
              })
            }
            disabled={
              currentDateRange.startDate && {
                before: currentDateRange.startDate,
              }
            }
          />
        </div>
      </div>
    </div>
  );
}
