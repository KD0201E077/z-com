"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import style from "./rightSearchZone.module.css";
import SearchFilter from "./SearchFilter";
import SearchForm from "./SearchForm";

export default function RightSearchZone() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filterData = useMemo(
    () => [
      {
        name: "사용자",
        filters: [
          {
            label: "모든 사용자",
            value: "pf",
            onChange: () => {
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.delete("pf");
              router.replace(`/search?${newSearchParams.toString()}`);
            },
          },
          {
            label: "내가 팔로우하는 사람들",
            value: "pf",
            onChange: () => {
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set("pf", "on");
              router.replace(`/search?${newSearchParams.toString()}`);
            },
          },
        ],
      },
      {
        name: "위치",
        filters: [
          {
            label: "어디에서나",
            value: "ne",
            onChange: () => {
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.delete("ne");
              router.replace(`/search?${newSearchParams.toString()}`);
            },
          },
          {
            label: "현 위치 주변",
            value: "ne",
            onChange: () => {
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set("ne", "on");
              router.replace(`/search?${newSearchParams.toString()}`);
            },
          },
        ],
      },
    ],
    [pathname, searchParams]
  );
  if (pathname === "/explore") return null;
  if (pathname === "/search") {
    return (
      <div>
        <h5 className={style.filterTitle}>검색 필터</h5>
        <div className={style.filterSection}>
          {filterData.map((filter, idx) => (
            <SearchFilter key={idx} {...filter} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 60, width: "inherit" }}>
      <SearchForm />
    </div>
  );
}
