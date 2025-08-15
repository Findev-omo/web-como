export interface ClubApplication {
  clubId: number;
  clubName: string;
  clubSummary: string;
  department: string;
  appliedDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  applicantId: number;
  applicantName: string;
}

export interface ClubApplicationListResponse {
  data: {
    totalPages: number;
    currentPage: number;
    list: ClubApplication[];
  };
  resultCode: number;
  resultMessage?: string;
}
