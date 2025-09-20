"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import style from "./searchFilter.module.css";

type Props = {
  name: string;
  filters: {
    label: string;
    value: string;
    onChange: () => void;
  }[];
};

export default function SearchFilter({ name, filters }: Props) {
  const searchParams = useSearchParams();
  const checked = useMemo(() => {
    if (searchParams.has(filters[0].value)) {
      return 1; // 'pf' 파라미터가 있으면 두 번째 필터 선택 (내가 팔로우하는 사람들)
    }
    return 0; // 없으면 첫 번째 필터 선택 (모든 사용자)
  }, [searchParams]);
  const handleClick = (idx: number, onChange: () => void) => {
    onChange();
  };
  return (
    <div>
      <label className={style.label}>{name}</label>
      {filters.map((filter, idx) => (
        <div key={idx} className={style.radio}>
          <div>{filter.label}</div>
          <input type="radio" name={name} value={filter.value} hidden />
          <span
            className={style.customRadio}
            onClick={() => handleClick(idx, filter.onChange)}
          >
            {idx === checked && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="12" fill="#1DA1F2" />{" "}
                {/* 파란 배경 */}
                <path
                  d="M6 12.5L10 16.5L18 8.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />{" "}
                {/* 하얀 체크 표시 */}
              </svg>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
