"use client";

import Post from "@/app/(afterLogin)/_component/Post";
import { Post as IPost } from "@/model/Post";
import {
  InfiniteData,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getComments } from "../_lib/getComments";

type Props = {
  id: string;
};

export default function Comments({ id }: Props) {
  const queryClient = useQueryClient();
  const post = queryClient.getQueryData(["posts", id]);
  const { data, fetchNextPage, hasNextPage, isFetching, isError } =
    useSuspenseInfiniteQuery<
      IPost[],
      object,
      InfiniteData<IPost[]>,
      [_1: string, id: string, _2: string],
      number
    >({
      queryKey: ["posts", id, "comments"],
      queryFn: getComments,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
      staleTime: 60 * 1000,
      gcTime: 300 * 1000,
    });
  const { ref, inView } = useInView({
    threshold: 0,
    delay: 10,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isError) {
    return "에러 발생";
  }
  // const { data, error } = useQuery<
  //   IPost[],
  //   object,
  //   IPost[],
  //   [_1: string, _2: string, _3: string]
  // >({
  //   queryKey: ["posts", id, "comments"],
  //   queryFn: getComments,
  //   staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
  //   gcTime: 300 * 1000,
  //   enabled: !!post,
  // });

  if (post) {
    // return data?.map((post) => <Post post={post} key={post.postId} />);
    return (
      <>
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((post, idx) => (
              <Post post={post} key={post.postId} />
            ))}
          </Fragment>
        ))}
        <div ref={ref} style={{ height: 50 }} />
      </>
    );
  }
  return null;
}
