"use client";

import { useRouter, useSearchParams } from "next/navigation";
import style from "../search.module.css";

export default function Tab() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = searchParams.get("f") === "live" ? "new" : "hot";

  const onClickHot = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("f");
    router.replace(`/search?${newSearchParams.toString()}`);
  };

  const onClickNew = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("f", "live");
    router.replace(`/search?${newSearchParams.toString()}`);
  };
  return (
    <div className={style.homeFixed}>
      <div className={style.homeTab}>
        <div onClick={onClickHot}>
          인기
          <div className={style.tabIndicator} hidden={current === "new"}></div>
        </div>
        <div onClick={onClickNew}>
          최신
          <div className={style.tabIndicator} hidden={current === "hot"}></div>
        </div>
      </div>
    </div>
  );
}
