import type { SearchValue } from "@/lib/types/search";
import Search from "@/components/dashboard/common/Search";
import { DateRange } from "@/components/dashboard/common/DateFilter";
import { useState } from "react";

const fieldList = [
  { name: "동호회명", value: "club" },
  { name: "부서", value: "dept" },
];
const filterList = [
  { name: "전체 보기", value: "all" },
  { name: "해체신청", value: "request" },
  { name: "활동중", value: "active" },
];

// interface Props {
//   currentSearchValue: SearchValue;
//   setCurrentSearchValue: React.Dispatch<React.SetStateAction<SearchValue>>;
//   handleSearch: () => void;
// }

interface Props {
  onSearch: (searchValue: SearchValue) => void;
  currentDateRange: DateRange;
  currentPage: number;
}

export default function ClubSearch({
  onSearch,
  currentDateRange,
  currentPage,
}: Props) {
  const [currentSearchValue, setCurrentSearchValue] = useState<SearchValue>({
    term: "",
    field: "all",
  });

  const handleSearch = () => {
    console.log("=== 검색 실행 ===");
    console.log("현재 페이지:", currentPage);
    console.log("검색어:", currentSearchValue.term);
    console.log("필터 값:", currentSearchValue.field);
    console.log("날짜 범위:", currentDateRange);
    console.log("================");

    // 부모 컴포넌트에 검색 값 전달
    onSearch(currentSearchValue);

    // 검색 후 검색어 초기화
    setCurrentSearchValue((prev) => ({
      ...prev,
      term: "",
    }));
  };

  return (
    <Search
      // fieldList={fieldList}
      // filterList={filterList}
      currentValue={currentSearchValue}
      handleChange={({ term, field }) => {
        setCurrentSearchValue((prev) => {
          const newValue = {
            term: term || "",
            field: field !== undefined ? field : prev.field,
          };
          console.log("=== 입력값 변경 ===");
          console.log("이전 값:", prev);
          console.log("새로운 값:", newValue);
          console.log("=================");
          return newValue;
        });
      }}
      handleSearch={handleSearch}
    />
  );
}
