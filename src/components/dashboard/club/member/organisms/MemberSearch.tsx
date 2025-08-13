"use client";

import { useState } from "react";
import type { SearchValue } from "@/lib/types/search";
import Search from "@/components/dashboard/common/Search";
import { useMemberSearch } from "@/hooks/queries";

const fieldList = [
  { name: "부서", value: "dept" },
  { name: "이름", value: "name" },
];
const filterList = [
  { name: "전체 보기", value: "all" },
  { name: "신규회원 신청", value: "new" },
  { name: "기존회원", value: "member" },
];

interface Props {
  onSearch: (searchValue: SearchValue) => void;
  currentPage: number;
}

export default function MemberSearch({ onSearch, currentPage }: Props) {
  const [currentSearchValue, setCurrentSearchValue] = useState<SearchValue>({
    // field: "dept",
    term: "",
    // filter: "all",
  });
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { data: userResults = [], isLoading } = useMemberSearch(submittedQuery);

  const handleSearch = async () => {
    console.log("=== 검색 실행 ===");
    console.log("현재 페이지:", currentPage);
    console.log("검색어:", currentSearchValue.term);
    console.log("================");

    // 유저 검색 API(/member/search) 호출: 훅 트리거
    setSubmittedQuery(currentSearchValue.term);

    // 테이블 필터링(부가 기능) 유지
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
      handleChange={({ term }) => {
        setCurrentSearchValue((prev) => {
          const newValue = { term: term || "" };
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
// 동호회 임원 - 동호회 회원 검색 컴포넌트
