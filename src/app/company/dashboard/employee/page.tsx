"use client";

import EmployeeTitle from "@/components/dashboard/company/employee/molecules/EmployeeTitle";
import ClubFigures from "@/components/dashboard/company/main/molecules/ClubFigures";
import { startOfToday, subMonths } from "date-fns";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/Skeleton";
import useQueryHook from "@/hooks/useQuery";
import type { IResponse } from "@/api/types";
import type { Employee } from "@/api/types/company/employee";

const AddNewEmployeeModal = dynamic(
  () =>
    import("@/components/dashboard/company/employee/modals/AddNewEmployeeModal")
);
const ApprovalSuccessModal = dynamic(
  () =>
    import(
      "@/components/dashboard/company/employee/modals/ApprovalSuccessModal"
    )
);
const EditSuccessModal = dynamic(
  () =>
    import("@/components/dashboard/company/employee/modals/EditSuccessModal")
);
const DeleteSuccessModal = dynamic(
  () =>
    import("@/components/dashboard/company/employee/modals/DeleteSuccessModal")
);

const EmployeeView = dynamic(
  () =>
    import("@/components/dashboard/company/employee/templates/EmployeeView"),
  { loading: () => <Skeleton className="w-full h-[700px]" /> }
);

export default function Page() {
  const formatDateToString = (date: Date | undefined) => {
    if (!date) return "";
    const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return koreaDate.toISOString().split("T")[0];
  };

  const today = startOfToday();
  const oneMonthAgo = subMonths(today, 1);

  const initialDateRange = {
    startDate: oneMonthAgo,
    endDate: today,
  };

  const { data: employeeData } = useQueryHook<
    IResponse<{ employees: Employee[] }>
  >(
    ["employees", initialDateRange.startDate, initialDateRange.endDate],
    `v1/manager/member/list?page=1&search=&filter=all&startDate=${formatDateToString(
      initialDateRange.startDate
    )}&endDate=${formatDateToString(initialDateRange.endDate)}`
  );

  const { data: pendingCountData } = useQueryHook<IResponse<number>>(
    ["pendingCount"],
    "v1/manager/club/pending-count"
  );

  const { data: approvedCountData } = useQueryHook<IResponse<number>>(
    ["approvedCount"],
    "v1/manager/club/approved-count"
  );

  return (
    <>
      <EmployeeTitle />
      <div className="flex gap-3">
        <ClubFigures
          pendingCount={pendingCountData?.data ?? 0}
          approvedCount={approvedCountData?.data ?? 0}
        />
      </div>
      <EmployeeView initialEmployees={employeeData?.data?.employees} />
      <div className="m-0">
        <AddNewEmployeeModal />
        <ApprovalSuccessModal />
        <EditSuccessModal />
        <DeleteSuccessModal />
      </div>
    </>
  );
}
