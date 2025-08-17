import EmployeeList from "@/components/dashboard/company/employee/organisms/EmployeeList";
import type { Employee } from "@/api/services/company";

export default function EmployeeView({
  initialEmployees,
}: {
  initialEmployees: Employee[];
}) {
  return (
    <>
      <EmployeeList initialEmployees={initialEmployees} />
    </>
  );
}
