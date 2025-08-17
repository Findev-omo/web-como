export type EmployeeStatus = "ACTIVE" | "INACTIVE";

export interface Employee {
  id: number;
  name: string;
  nickname: string;
  companyName: string | null;
  profileMessage: string | null;
  profileImage: string | null;
  department: string;
  position: string;
  status: EmployeeStatus;
  createAt: string;
  email: string | null;
  role: string | null;
  joinedClub: string | null;
}
