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
  resultCode: string;
  resultMessage?: string;
}

export interface ClubStatusCountResponse {
  data: {
    approvedCount: number;
    pendingCount: number;
    rejectedCount: number;
    newClubCount: number;
  };
  resultCode: string;
  resultMessage?: string;
}

export interface ClubBasicInfoResponse {
  clubImage: string;
  companyName: string;
  clubName: string;
  category: string;
  goal: string;
  intro: string;
  detail: string;
  activityPlan: string;
  location: string;
}

export interface ClubRegistrationResponse {
  id: number;
  name: string;
  intro: string;
  createdAt: string;
  longitude: string;
  latitude: string;
  location: string;
  activityPlan: string;
  goal: string;
  headId: number;
  headName: string;
  headDepartment: string;
  subHeadId: number;
  subHeadName: string;
  subHeadDepartment: string;
  affairsId: number;
  affairsName: string;
  affairsDepartment: string;
  clubCategory: string;
  maxMemberCount: number;
  minMemberCount: number;
  duesPerYear: number;
  detail: string;
  clubImage: string;
  bankbookImage: string;
  isJoined: boolean;
  currentMember: number;
  companyName?: string; // optional로 변경
}

export interface ClubMember {
  id: number;
  name: string;
  department: string;
  position: string;
  profileMessage: string;
  requestDate: string;
  status: string;
  createdDate: number[];
}

export interface ClubMemberListResponse {
  totalPages: number;
  currentPage: number;
  list: ClubMember[];
}
