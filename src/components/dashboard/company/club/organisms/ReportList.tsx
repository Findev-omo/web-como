"use client";

import DateFilter, {
  type DateRange,
} from "@/components/dashboard/common/DateFilter";
import Pagination from "@/components/dashboard/common/Pagination";
import ReportTable from "@/components/dashboard/company/club/molecules/ReportTable";
import { Activity } from "@/api/types/company/report";

interface ReportListProps {
  activities: Activity[];
  currentPage: number;
  maxPage: number;
  currentDateRange: DateRange;
  handleDateRangeChange: (dateRange: DateRange) => void;
  handlePageChange: (page: number) => void;
}

export default function ReportList({
  activities,
  currentPage,
  maxPage,
  currentDateRange,
  handleDateRangeChange,
  handlePageChange,
}: ReportListProps) {
  return (
    <div className="space-y-4 p-8 rounded-2xl bg-gray-0">
      <DateFilter
        currentDateRange={currentDateRange}
        handleDateRangeChange={handleDateRangeChange}
      />
      <div className="space-y-10">
        <ReportTable activities={activities} />
        <Pagination
          currentPage={currentPage}
          maxPage={maxPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
