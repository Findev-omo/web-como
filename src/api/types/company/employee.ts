export type EmployeeStatus = "Y" | "N";

export interface Employee {
  memberId: number;
  memberName: string;
  department: string;
  position: string;
  clubName: string;
  joinDate: string;
  memberStatus: EmployeeStatus;
}
