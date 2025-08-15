import type { SearchValue } from "@/lib/types/search";
import Search from "@/components/dashboard/common/Search";
import { DateRange } from "@/components/dashboard/common/DateFilter";
import { useState } from "react";
import { getData } from "@/api/action";
import type { ClubApplicationListResponse } from "@/api/types/company/club";

// const filterList = [
//   { name: "전체 보기", value: "all" },
//   { name: "승인대기", value: "pending" },
//   { name: "승인완료", value: "approved" },
//   { name: "반려완료", value: "rejected" },
// ];

interface Props {
  onSearch: (searchValue: SearchValue) => void;
  currentDateRange: DateRange;
  currentPage: number;
}

export default function ApplicationSearch({
  onSearch,
  currentDateRange,
  currentPage,
}: Props) {
  const [currentSearchValue, setCurrentSearchValue] = useState<SearchValue>({
    term: "",
    field: "all",
    filter: "all", // 기본값을 "전체 보기"로 설정
  });

  const handleSearch = async () => {
    console.log("=== 검색 실행 ===");
    console.log("현재 페이지:", currentPage);
    console.log("검색어:", currentSearchValue.term);
    console.log("필터 값:", currentSearchValue.filter);
    console.log("날짜 범위:", currentDateRange);
    console.log("================");

    try {
      // OpenAPI 스펙에 맞게 페이지를 0부터 시작하도록 수정
      const pageParam = Math.max(0, currentPage - 1);

      const response = (await getData(
        `v1/manager/club?page=${pageParam}&search=${currentSearchValue.term}&filter=${currentSearchValue.filter}&startDate=${currentDateRange.startDate?.toISOString().split("T")[0]}&endDate=${currentDateRange.endDate?.toISOString().split("T")[0]}`,
        true
      )) as unknown as ClubApplicationListResponse;

      console.log(response.data);
      // OpenAPI 스펙에 맞게 응답 코드 체크 수정
      if (response.resultCode === "200" && response.data) {
        onSearch(currentSearchValue);
        // 검색 후 검색어 초기화
        setCurrentSearchValue((prev) => ({
          ...prev,
          term: "",
        }));
      } else {
        console.error("검색 실패");
      }
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    }
  };

  return (
    <Search
      // filterList={filterList}
      currentValue={currentSearchValue}
      handleChange={({ term, field }) => {
        setCurrentSearchValue((prev) => {
          const newValue = {
            term: term || "",
            field: field !== undefined ? field : prev.field,
            filter: "all", // 항상 "전체 보기"로 고정
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
