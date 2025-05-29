import { getData } from "@/api/action";
import { Document, Print } from "@/assets/icons/util";
import * as XLSX from "xlsx";

export const PrintButton = () => {
  return (
    <button className="p-1 rounded bg-gray-900">
      <Print className="w-6 h-6 text-gray-0" />
    </button>
  );
};

export const SaveButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      className="p-1 rounded bg-point-green"
      onClick={onClick} // 함수만 전달
    >
      <Document className="w-6 h-6 text-gray-0" />
    </button>
  );
};

export default function DocUtilButtons() {
  const savedExcel = async () => {
    try {
      const res = await getData("v1/manager/member/excel");
      const data = res.data;

      // 데이터 가공
      const excelData = data.map((item: any) => ({
        "ID": item.id,
        "이름": item.name,
        "이메일": item.email || "",
        "부서": item.department?.replace("\r", "") || "",
        "직급": item.position || "",
        "가입일": item.createdDate,
        "소속 동호회": item.clubNames?.join(", ") || "",
      }));

      // 워크북 생성
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // 컬럼 너비 설정
      const colWidths = [
        { wch: 5 }, // ID
        { wch: 10 }, // 이름
        { wch: 20 }, // 이메일
        { wch: 15 }, // 부서
        { wch: 15 }, // 직급
        { wch: 12 }, // 가입일
        { wch: 30 }, // 소속 동호회
      ];
      ws["!cols"] = colWidths;

      // 워크시트를 워크북에 추가
      XLSX.utils.book_append_sheet(wb, ws, "회원정보");

      // 엑셀 파일 생성 및 다운로드
      XLSX.writeFile(wb, "회원정보.xlsx");
    } catch (error) {
      console.error("Excel download failed:", error);
    }
  };
  return (
    <div className="flex gap-3">
      <PrintButton />
      <SaveButton onClick={savedExcel} />
    </div>
  );
}
