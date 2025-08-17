"use client";

import EmployeeTitle from "@/components/dashboard/company/employee/molecules/EmployeeTitle";
import ClubFigures from "@/components/dashboard/company/main/molecules/ClubFigures";
import { startOfToday, subMonths } from "date-fns";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/Skeleton";
import { useCompanyEmployees } from "@/hooks/queries/company";
import useQueryHook from "@/hooks/useQuery";
import type { Employee } from "@/api/services/company";
import type { ClubStatusCountResponse } from "@/api/types/company/club";

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
  const today = startOfToday();
  const oneMonthAgo = subMonths(today, 1);

  const initialDateRange = {
    startDate: oneMonthAgo,
    endDate: today,
  };

  // react-query를 사용하여 직원 목록 가져오기
  const { data: employeeData, isLoading } = useCompanyEmployees(
    1,
    "",
    "all",
    initialDateRange
  );

  console.log("Employee data:", employeeData);

  const { data: statusCountData } = useQueryHook<ClubStatusCountResponse>(
    ["clubStatusCount"],
    "v1/manager/club/status-counts"
  );

  if (isLoading) {
    return (
      <>
        <EmployeeTitle />
        <div className="flex gap-3">
          <ClubFigures
            pendingCount={statusCountData?.data?.pendingCount ?? 0}
            approvedCount={statusCountData?.data?.approvedCount ?? 0}
          />
        </div>
        <Skeleton className="w-full h-[700px]" />
      </>
    );
  }

  return (
    <>
      <EmployeeTitle />
      <div className="flex gap-3">
        <ClubFigures
          pendingCount={statusCountData?.data?.pendingCount ?? 0}
          approvedCount={statusCountData?.data?.approvedCount ?? 0}
        />
      </div>
      <EmployeeView initialEmployees={employeeData?.list || []} />
      <div className="m-0">
        <AddNewEmployeeModal />
        <ApprovalSuccessModal />
        <EditSuccessModal />
        <DeleteSuccessModal />
      </div>
    </>
  );
}
