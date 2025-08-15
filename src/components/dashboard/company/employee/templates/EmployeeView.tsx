import EmployeeList from "@/components/dashboard/company/employee/organisms/EmployeeList";
import type { Employee } from "@/api/types/company/employee";

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
