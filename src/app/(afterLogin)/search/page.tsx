import { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import BackButton from "../_component/BackButton";
import SearchForm from "../_component/SearchForm";
import Loading from "../home/loading";
import SearchResult from "./_component/SearchResult";
import Tab from "./_component/Tab";
import style from "./search.module.css";

type Props = {
  searchParams: Promise<{ q: string; f?: string; pf?: string }>;
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { q } = await searchParams;
  console.log("parent", parent);
  return {
    title: `${q} - 검색 / Z`,
    description: `${q} - 검색 / Z`,
  };
}

export default async function Search({ searchParams }: Props) {
  const query = await searchParams;
  return (
    <main className={style.main}>
      <div className={style.searchTop}>
        <div className={style.searchZone}>
          <div className={style.buttonZone}>
            <BackButton />
          </div>
          <div className={style.formZone}>
            <SearchForm q={query.q} f={query.f} pf={query.pf} />
          </div>
        </div>
        <Tab />
      </div>
      <div className={style.list}>
        <Suspense fallback={<Loading />}>
          <SearchResult searchParams={query} />
        </Suspense>
      </div>
    </main>
  );
}
