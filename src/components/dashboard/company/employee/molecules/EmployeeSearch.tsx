"use client";

import { useState } from "react";
import type { SearchValue } from "@/lib/types/search";
import Search from "@/components/dashboard/common/Search";

const fieldList = [
  { name: "전체", value: "all" },
  { name: "이름", value: "name" },
  { name: "직급", value: "rank" },
];

interface Props {
  onSearch: (searchValue: SearchValue) => void;
}

export default function EmployeeSearch({ onSearch }: Props) {
  const [currentSearchValue, setCurrentSearchValue] = useState<SearchValue>({
    term: "",
    field: "all",
  });

  const handleSearch = () => {
    onSearch(currentSearchValue);
  };

  return (
    <Search
      fieldList={fieldList}
      currentValue={currentSearchValue}
      handleChange={({ term, field }) => {
        setCurrentSearchValue((prev) => ({
          ...prev,
          term: term || "",
          field: field !== undefined ? field : prev.field,
        }));
      }}
      handleSearch={handleSearch}
    />
  );
}
