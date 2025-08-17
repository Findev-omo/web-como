import { ComponentProps } from "react";
import { Document, Print } from "@/assets/icons/util";

export const PrintButton = ({
  onClick,
  ...props
}: ComponentProps<"button"> & { onClick?: () => void }) => {
  const handlePrint = () => {
    if (onClick) {
      onClick();
    } else {
      // 기본 인쇄 기능
      window.print();
    }
  };

  return (
    <button
      className="p-1 rounded bg-gray-900"
      onClick={handlePrint}
      {...props}
    >
      <Print className="w-6 h-6 text-gray-0" />
    </button>
  );
};

export const SaveButton = ({
  onClick,
  clubId,
}: {
  onClick?: () => void;
  clubId?: number;
}) => {
  const handleExcelDownload = async () => {
    if (onClick) {
      onClick();
      return;
    }

    try {
      const XLSX = await import("xlsx");

      // API 호출 - 회원 정보 엑셀 다운로드
      const response = await fetch(`/api/server/v1/manager/member/excel`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Excel 데이터를 가져오는데 실패했습니다.");
      }

      const result = await response.json();
      const raw = Array.isArray(result?.data) ? result.data : [];

      if (!Array.isArray(raw)) {
        throw new Error("유효한 데이터가 없습니다.");
      }

      // Excel 데이터 포맷팅 - OpenAPI 스펙에 맞게 수정
      const newData = raw.map((item: any, idx: number) => {
        const newItem: Record<string, any> = { ...item };

        // 날짜 포맷팅
        const createDate = newItem.createAt
          ? new Date(newItem.createAt).toLocaleDateString("ko-KR")
          : "";

        // 상태 한글화
        const statusMap: Record<string, string> = {
          ACTIVE: "활성",
          INACTIVE: "비활성",
          PENDING: "대기중",
        };

        // 역할 한글화
        const roleMap: Record<string, string> = {
          MEMBER: "회원",
          MANAGER: "관리자",
          ADMIN: "관리자",
        };

        newItem.id = idx + 1;
        newItem["번호"] = idx + 1;
        newItem["이름"] = newItem.name || "";
        newItem["닉네임"] = newItem.nickname || "";
        newItem["회사명"] = newItem.companyName || "";
        newItem["부서"] = newItem.Department || "";
        newItem["직급"] = newItem.position || "";
        newItem["상태"] = statusMap[newItem.status] || newItem.status || "";
        newItem["가입일"] = createDate;
        newItem["이메일"] = newItem.email || "";
        newItem["역할"] = roleMap[newItem.role] || newItem.role || "";
        newItem["가입동호회"] = Array.isArray(newItem.joinedClub)
          ? newItem.joinedClub.join(", ")
          : newItem.joinedClub || "";

        // 원본 필드 삭제
        delete newItem["name"];
        delete newItem["nickname"];
        delete newItem["companyName"];
        delete newItem["Department"];
        delete newItem["position"];
        delete newItem["status"];
        delete newItem["createAt"];
        delete newItem["email"];
        delete newItem["role"];
        delete newItem["joinedClub"];
        delete newItem["profileMessage"];
        delete newItem["profileImage"];

        return newItem;
      });

      // Excel 파일 생성
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(wb, ws, "회원 정보");
      XLSX.writeFile(wb, "member_info.xlsx");
    } catch (error) {
      console.error("엑셀 다운로드 중 오류 발생:", error);
    }
  };

  return (
    <button
      className="p-1 rounded bg-point-green"
      onClick={handleExcelDownload}
    >
      <Document className="w-6 h-6 text-gray-0" />
    </button>
  );
};

export default function DocUtilButtons() {
  return (
    <div className="flex gap-3">
      <PrintButton />
      <SaveButton />
    </div>
  );
}
