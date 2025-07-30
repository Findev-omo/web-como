import EmployeeTitle from "@/components/dashboard/company/employee/molecules/EmployeeTitle";
import ClubFigures from "@/components/dashboard/company/main/molecules/ClubFigures";
import { getData } from "@/api/action";
import { startOfToday, subYears } from "date-fns";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/Skeleton";

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
  { ssr: false, loading: () => <Skeleton className="w-full h-[700px]" /> }
);

export default async function Page() {
  const formatDateToString = (date: Date | undefined) => {
    if (!date) return "";
    const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return koreaDate.toISOString().split("T")[0];
  };

  const today = startOfToday();
  const oneYearAgo = subYears(today, 1);

  const initialDateRange = {
    startDate: oneYearAgo,
    endDate: today,
  };

  const [employeeData, pendingCountData, approvedCountData] = await Promise.all(
    [
      getData(
        `v1/manager/member/list?page=1&search=&filter=all&startDate=${formatDateToString(
          initialDateRange.startDate
        )}&endDate=${formatDateToString(initialDateRange.endDate)}`,
        true
      ),
      getData("v1/manager/club/pending-count"),
      getData("v1/manager/club/approved-count"),
    ]
  );

  return (
    <>
      <EmployeeTitle />
      <div className="flex gap-3">
        <ClubFigures
          pendingCount={pendingCountData.data}
          approvedCount={approvedCountData.data}
        />
      </div>
      <EmployeeView initialEmployees={employeeData.data} />
      <div className="m-0">
        <AddNewEmployeeModal />
        <ApprovalSuccessModal />
        <EditSuccessModal />
        <DeleteSuccessModal />
      </div>
    </>
  );
}
