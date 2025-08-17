export type ExpenseApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ExpenseApplicationEntry {
  id: number;
  clubName: string;
  writerName: string;
  department: string;
  eventName: string;
  createdDate: string; // ISO 8601 형식의 문자열 (예: '2025-06-18T16:42:05')
  status: ExpenseApplicationStatus;
}

export type ExpenseFormValues = {
  eventName: string;
  description: string;
  note: string;
  location: string;
  participantCount: number;
  amount: number;
  details: string;
  file: string | null;
};

export type CardInfo = {
  clubId: number;
  clubImage: string;
  leadersSummary: string;
  activityPlan: string;
  memberCount: number;
  status: ExpenseApplicationStatus;
  createdAt: string; // ISO 8601 형식의 문자열
  clubName: string;
};

export type ExpenseDetail = CardInfo & ExpenseFormValues;
