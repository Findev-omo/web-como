"use client";

import { ComponentProps } from "react";

interface ReportStats {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

interface ReportOverviewProps extends ComponentProps<"div"> {
  stats: ReportStats;
}

export default function ReportOverview({
  stats,
  ...props
}: ReportOverviewProps) {
  return (
    <div
      className="flex flex-col gap-6 h-fit p-8 rounded-xl bg-gray-800 select-none"
      {...props}
    >
      <h2 className="h1 font-bold text-gray-0">{"보고서 관리"}</h2>
      <div className="flex gap-8 truncate">
        <div className="flex-1 flex flex-col gap-4 py-3 px-2">
          <h4 className="font-medium text-gray-400">{"승인대기"}</h4>
          <span className="h1 font-extrabold text-brand-orange">
            {`${stats.pendingCount}건`}
          </span>
        </div>
        <span className="h-[104px] border-l border-gray-700" />
        <div className="flex-1 flex flex-col gap-4 py-3 px-2">
          <h4 className="font-medium text-gray-400">{"승인완료"}</h4>
          <span className="h1 font-extrabold text-gray-0">{`${stats.approvedCount}건`}</span>
        </div>
        <span className="h-[104px] border-l border-gray-700" />
        <div className="flex-1 flex flex-col gap-4 py-3 px-2">
          <h4 className="font-medium text-gray-400">{"반려완료"}</h4>
          <span className="h1 font-extrabold text-gray-0">{`${stats.rejectedCount}건`}</span>
        </div>
      </div>
    </div>
  );
}
