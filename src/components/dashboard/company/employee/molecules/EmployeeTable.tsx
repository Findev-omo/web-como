"use client";

import { useRouter } from "next/navigation";
import { cn, formatDate, openModal } from "@/lib/utils";
import ApplicationDetailModal from "@/components/dashboard/company/employee/modals/ApplicationDetailModal";
import EditEmployeeInfoModal from "@/components/dashboard/company/employee/modals/EditEmployeeInfoModal";
import DeleteEmployeeModal from "@/components/dashboard/company/employee/modals/DeleteEmployeeModal";
import DeleteReasonModal from "../modals/DeleteReasonModal";
import type { Employee } from "@/api/types/company/employee";

const tableHeadings = [
  "순번",
  "이름",
  "부서",
  "직급",
  "가입일",
  "회원 상태 수정",
];

interface EmployeeTableProps {
  employees: Employee[];
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  const router = useRouter();

  console.log("EmployeeTable received employees:", employees);

  const handleRowClick = (memberId: number) => {
    router.push(`./employee/detail/${memberId}`);
  };

  return (
    <>
      <div className="m-0">
        <ApplicationDetailModal />
        <EditEmployeeInfoModal />
        <DeleteEmployeeModal />
        <DeleteReasonModal />
      </div>
      <ul>
        <li className="flex border-y border-gray-400 bg-gray-200 h-14 items-center">
          {tableHeadings.map((heading, i) => (
            <div
              key={heading}
              className={cn(
                "body-1 font-bold text-gray-900 text-center",
                i === 0 ? "w-[5%] pl-4" : "",
                i === 1 ? "w-[19%]" : "",
                i === 2 ? "w-[19%]" : "",
                i === 3 ? "w-[19%]" : "",
                i === 4 ? "w-[19%]" : "",
                i === 5 ? "w-[19%] pr-4" : ""
              )}
            >
              {heading}
            </div>
          ))}
        </li>
        {employees.length === 0 ? (
          <li className="flex border-b border-gray-400 bg-gray-0 h-14 items-center justify-center">
            <div className="body-1 font-medium text-gray-600">
              회원이 없습니다.
            </div>
          </li>
        ) : (
          employees.map((employee, idx) => (
            <li
              key={employee.id}
              className={cn(
                "flex border-b border-gray-400 bg-gray-0 transition duration-200 h-14 items-center",
                employee.status === "ACTIVE"
                  ? "cursor-pointer group hover:bg-gray-200"
                  : ""
              )}
              onClick={() => {
                if (employee.status === "ACTIVE") {
                  handleRowClick(employee.id);
                }
              }}
            >
              {[
                idx + 1,
                employee.name,
                employee.department,
                employee.position,
                employee.createAt,
                employee.status,
              ].map((data, i) => (
                <div
                  key={i}
                  className={cn(
                    "body-1 font-medium text-gray-800 underline underline-offset-2 decoration-transparent line-clamp-1 transition duration-200 text-center",
                    i === 0 ? "w-[5%] pl-4" : "",
                    i === 1 ? "w-[19%]" : "",
                    i === 2 ? "w-[19%]" : "",
                    i === 3 ? "w-[19%]" : "",
                    i === 4 ? "w-[19%]" : "",
                    i === 5 ? "w-[19%] pr-4" : "",
                    i === 1 ? "group-hover:decoration-gray-800" : "",
                    i === 5 ? "flex items-center justify-center" : ""
                  )}
                >
                  {i === 4 ? (
                    formatDate(new Date(data as string))
                  ) : i === 5 ? (
                    data === "ACTIVE" ? (
                      <div
                        className="flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="py-1 px-4 rounded body-1 font-medium text-gray-50 bg-gray-800"
                          onClick={() =>
                            openModal("employee-edit", {
                              memberId: employee.id,
                            })
                          }
                        >
                          {"수정"}
                        </button>
                        <button
                          className="py-1 px-4 rounded border border-gray-800 body-1 font-medium text-gray-800"
                          onClick={() =>
                            openModal("delete-reason", {
                              memberId: employee.id,
                            })
                          }
                        >
                          {"삭제"}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="decoration-gray-800"
                        onClick={() => openModal("delete-reason")}
                      >
                        {"삭제 완료"}
                      </button>
                    )
                  ) : (
                    data
                  )}
                </div>
              ))}
            </li>
          ))
        )}
      </ul>
    </>
  );
}
