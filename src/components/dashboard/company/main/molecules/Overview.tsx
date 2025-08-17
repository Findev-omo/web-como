"use client";

import { useEffect, useState } from "react";

export default function DashboardOverview() {
  const [companyName, setCompanyName] = useState<string>("");
  const [employeeCount, setEmployeeCount] = useState<number>(0);

  useEffect(() => {
    const loadCompanyName = async () => {
      try {
        const response = await fetch(`/api/server/member`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const res = await response.json();

        if ((res?.resultCode === 200 || res?.resultCode === "OK") && res.data) {
          setCompanyName(res.data.companyName || "회사");
        } else {
          setCompanyName("회사");
        }
      } catch (error) {
        console.error("회사명 로딩 오류:", error);
        setCompanyName("회사");
      }
    };

    const loadEmployeeCount = async () => {
      try {
        const response = await fetch(
          `/api/server/v1/manager/member/dashboard`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const res = await response.json();

        if ((res?.resultCode === 200 || res?.resultCode === "OK") && res.data) {
          setEmployeeCount(res.data.count || 0);
        } else {
          setEmployeeCount(0);
        }
      } catch (error) {
        console.error("임직원 수 로딩 오류:", error);
        setEmployeeCount(0);
      }
    };

    loadCompanyName();
    loadEmployeeCount();
  }, []);

  return (
    <div className="col-span-4 flex flex-col gap-6 h-fit p-8 rounded-xl bg-gray-800 select-none">
      <h2 className="h1 font-bold text-gray-0">{`${companyName} 주요 알림`}</h2>
      <div className="flex gap-8 truncate">
        <div className="flex-1 flex flex-col gap-4 py-3 px-2">
          <h4 className="font-medium text-gray-400">
            {"이번 주 omo 이용 건수"}
          </h4>
          <span className="h1 font-extrabold text-brand-orange">
            {`${0}건`}
          </span>
        </div>
        <span className="h-[104px] border-l border-gray-700" />
        <div className="flex-1 flex flex-col gap-4 py-3 px-2">
          <h4 className="font-medium text-gray-400">
            {"오늘 퇴근 후 omo 이용 건수"}
          </h4>
          <span className="h1 font-extrabold text-gray-0">{`${0}건`}</span>
        </div>
        <span className="h-[104px] border-l border-gray-700" />
        <div className="flex-1 flex flex-col gap-4 py-3 px-2">
          <h4 className="font-medium text-gray-400">
            {"신규 동호회 신청 건수"}
          </h4>
          <span className="h1 font-extrabold text-gray-0">{`${0}건`}</span>
        </div>
        <span className="h-[104px] border-l border-gray-700" />
        {/* <div className="flex-1 flex flex-col gap-4 py-3 px-2">
          <h4 className="font-medium text-gray-400">{"잔여 복지포인트"}</h4>
          <span className="h1 font-extrabold text-gray-0">{`${0}건`}</span>
        </div> */}
        {/* 임시로 임직원수조회 */}
        <div className="flex-1 flex flex-col gap-4 py-3 px-2">
          <h4 className="font-medium text-gray-400">{"전체 임직원 수 조회"}</h4>
          <span className="h1 font-extrabold text-gray-0">{`${employeeCount}명`}</span>
        </div>
      </div>
    </div>
  );
}
