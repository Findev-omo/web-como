"use client";

import { cn, formatDate } from "@/lib/utils";

type MemberStatus = "active" | "leave" | "";

const tableHeadings = ["순번", "이름", "부서", "한줄 소개", "가입일", "상태"];

const members = [
  {
    id: 1,
    name: "신청자",
    department: "경영팀",
    description: "한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개",
    date: "2024-07-04 12:33:57",
    status: "active",
  },
  {
    id: 2,
    name: "신청자",
    department: "경영팀",
    description: "한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개",
    date: "2024-07-04 12:33:57",
    status: "active",
  },
  {
    id: 3,
    name: "신청자",
    department: "경영팀",
    description: "한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개",
    date: "2024-07-04 12:33:57",
    status: "leave",
  },
  {
    id: 4,
    name: "신청자",
    department: "경영팀",
    description: "한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개",
    date: "2024-07-04 12:33:57",
    status: "active",
  },
  {
    id: 5,
    name: "신청자",
    department: "경영팀",
    description: "한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개",
    date: "2024-07-04 12:33:57",
    status: "active",
  },
  {
    id: 6,
    name: "신청자",
    department: "경영팀",
    description: "한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개",
    date: "2024-07-04 12:33:57",
    status: "leave",
  },
  {
    id: 7,
    name: "신청자",
    department: "경영팀",
    description: "한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개",
    date: "2024-07-04 12:33:57",
    status: "active",
  },
  {
    id: 8,
    name: "신청자",
    department: "경영팀",
    description: "한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개",
    date: "2024-07-04 12:33:57",
    status: "active",
  },
  {
    id: 9,
    name: "신청자",
    department: "경영팀",
    description: "한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개",
    date: "2024-07-04 12:33:57",
    status: "leave",
  },
  {
    id: 10,
    name: "신청자",
    department: "경영팀",
    description: "한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개",
    date: "2024-07-04 12:33:57",
    status: "active",
  },
];

interface ClubMember {
  id: number;
  name: string;
  department: string;
  profileMessage: string;
  createdDate: string;
  status: string;
}

interface ClubMemberTableProps {
  clubMembers: ClubMember[];
}

export default function ClubMemberTable({ clubMembers }: ClubMemberTableProps) {
  console.log("클럽 멤버 정보:", clubMembers);

  const getStatus = (status: string): MemberStatus => {
    switch (status) {
      case "APPROVED":
        return "active";
      case "SIGNOUT":
        return "leave";
      default:
        return "";
    }
  };

  const formatAppliedDate = (dateInput: string | number[]) => {
    if (!dateInput) {
      console.error("Invalid dateInput:", dateInput);
      return "";
    }

    try {
      let date: Date;

      if (Array.isArray(dateInput)) {
        // number[] 형식: [YYYY, MM, DD, HH, mm, ss, ms]
        const [
          year,
          month,
          day,
          hour = 0,
          minute = 0,
          second = 0,
          millisecond = 0,
        ] = dateInput;
        date = new Date(
          year,
          month - 1,
          day,
          hour,
          minute,
          second,
          millisecond
        );
      } else {
        // string 형식
        date = new Date(dateInput);
      }

      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateInput);
        return "";
      }
      return formatDate(date);
    } catch (error) {
      console.error("Date parsing error:", error);
      return "";
    }
  };

  return (
    <ul className="flex flex-col gap-1">
      <li className="flex border-y border-gray-400 bg-gray-200">
        {tableHeadings.map((heading, i) => (
          <div
            key={heading}
            className={cn(
              "my-3 mx-6 body-1 font-bold text-gray-900",
              i === 0 ? "w-8" : "flex-1",
              [1, 4].includes(i)
                ? "max-w-24"
                : i === 2
                  ? "max-w-40"
                  : i === 5
                    ? "max-w-48"
                    : "",
              i === 3 ? "" : "text-center"
            )}
          >
            {heading}
          </div>
        ))}
      </li>
      {clubMembers &&
        clubMembers.length > 0 &&
        clubMembers.map((member, idx) => (
          <li
            key={member.id}
            className="flex border-b border-gray-400 bg-gray-0"
          >
            {[
              member.id,
              member.name,
              member.department,
              member.profileMessage || "-",
              formatAppliedDate(member.createdDate),
              getStatus(member.status),
            ].map((data, i) => (
              <div
                key={i}
                className={cn(
                  "my-3 mx-6 body-1 font-medium underline-offset-2 underline decoration-transparent line-clamp-1 transition duration-300",
                  i === 0 ? "w-8" : "flex-1",
                  [1, 4].includes(i)
                    ? "max-w-24"
                    : i === 2
                      ? "max-w-40"
                      : i === 5
                        ? "max-w-48"
                        : "",
                  i === 3 ? "" : "text-center",
                  data === "leave"
                    ? "text-gray-500"
                    : data === "active"
                      ? "text-point-blue"
                      : "text-gray-800"
                )}
              >
                {i === 0
                  ? idx + 1
                  : i === 4
                    ? data
                    : i === 5
                      ? data === "leave"
                        ? "탈퇴"
                        : data === "active"
                          ? "활동중"
                          : "-"
                      : data}
              </div>
            ))}
          </li>
        ))}
    </ul>
  );
}
