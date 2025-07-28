import EmployeeSearch from "@/components/dashboard/company/employee/molecules/EmployeeSearch";
import EmployeeList from "@/components/dashboard/company/employee/organisms/EmployeeList";

export default function EmployeeView({
  initialEmployees,
}: {
  initialEmployees: any;
}) {
  return (
    <>
      <EmployeeList initialEmployees={initialEmployees} />
    </>
  );
}
