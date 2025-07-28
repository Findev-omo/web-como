import EmployeeTitle from "@/components/dashboard/company/employee/molecules/EmployeeTitle";
import ClubFigures from "@/components/dashboard/company/main/molecules/ClubFigures";
import EmployeeView from "@/components/dashboard/company/employee/templates/EmployeeView";
import AddNewEmployeeModal from "@/components/dashboard/company/employee/modals/AddNewEmployeeModal";
import ApprovalSuccessModal from "@/components/dashboard/company/employee/modals/ApprovalSuccessModal";
import EditSuccessModal from "@/components/dashboard/company/employee/modals/EditSuccessModal";
import DeleteSuccessModal from "@/components/dashboard/company/employee/modals/DeleteSuccessModal";
import { getData } from "@/api/action";
import { startOfToday, subYears } from "date-fns";

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

  const employeeData = await getData(
    `v1/manager/member/list?page=1&search=&filter=all&startDate=${formatDateToString(
      initialDateRange.startDate
    )}&endDate=${formatDateToString(initialDateRange.endDate)}`,
    true
  );

  const pendingCountData = await getData("v1/manager/club/pending-count");
  const approvedCountData = await getData("v1/manager/club/approved-count");

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
